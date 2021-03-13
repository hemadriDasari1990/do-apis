import {
  ALREADY_VERIFIED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  REQUIRED,
  TOKEN_EXPIRED,
  UNAUTHORIZED,
  VERIFIED,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";

import EmailService from "../../services/email";
import Organization from "../../models/organization";
import Token from "../../models/token";
import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { getOrganizationByEmail } from "../organization";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { socket } from "../../index";

/**
 * Validate the token
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const authHeader: string = req.headers.authorization as string;
  if (authHeader) {
    const token: string = authHeader.split(" ")[1];
    const organization: any = await Organization.findOne({ token: token });
    let secret: any;
    if (organization?.token) {
      secret = config.get("refreshTokenSecret");
    } else {
      secret = config.get("accessTokenSecret");
    }
    jwt.verify(token, secret, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({ status: "error", code: UNAUTHORIZED });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: UNAUTHORIZED });
      } else {
        return next();
      }
    });
  } else {
    return res.status(401).json({ status: "error", code: UNAUTHORIZED });
  }
}

/**
 * Login user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function login(req: Request, res: Response): Promise<any> {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const organization: { [Key: string]: any } = await getOrganizationByEmail(
      email
    );
    if (!organization) {
      return res
        .status(422)
        .json({ message: "Email is not registered with us" });
    }
    if (!organization?.isVerified) {
      return res.status(422).json({
        message:
          "Your account is not verified yet. Please check your inbox and confirm your email",
      });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      organization.password
    );
    if (!isPasswordValid)
      return res.status(422).json({ message: "Incorrect Password" });
    const payload = {
      _id: organization._id,
      title: organization.title,
      description: organization.description,
    };

    // Sign token
    const token = await generateToken(payload);
    if (!token) {
      return res.status(500).json({ message: "Error while logging in" });
    }
    const refreshToken = await refreshAccessToken(payload);
    if (!refreshToken) {
      return res.status(500).json({ message: "Error while logging in" });
    }
    await Organization.findByIdAndUpdate(organization._id, {
      token: refreshToken,
    });
    await socket.emit(`login-success`);
    return res.status(200).json({
      success: true,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ message: err | err.message });
  }
}

/**
 * Refresh token for user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function refreshToken(req: Request, res: Response): Promise<any> {
  try {
    const organization: any = await Organization.findOne({
      token: req.body.refreshToken,
    });
    if (!organization) {
      return res.status(401).json({ error: "Token expired!" });
    }
    //extract payload from refresh token and generate a new access token and send it
    const payload: any = jwt.verify(
      organization?.token,
      config.get("refreshTokenSecret")
    );
    // Sign token
    const token = await refreshAccessToken(payload);
    if (!token) {
      return res
        .status(500)
        .json({ message: "Error while generating the token" });
    }
    return res.status(200).json({
      success: true,
      token: token,
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

/**
 * Innvalidate the session and logout user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function logout(req: Request, res: Response): Promise<any> {
  try {
    await Organization.findByIdAndUpdate(req.body.organizationId, {
      token: null,
    });
    return res.status(200).json({ success: "User logged out!" });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

/**
 * Generate forgot password token and send an email notification to reset
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function forgotPassword(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (!req.body.email) {
      return res
        .status(500)
        .json({ errorId: REQUIRED, message: "Email is required" });
    }
    const emailService = await new EmailService();
    const organization: any = await Organization.findOne({
      email: req.body.email,
    });
    if (!organization) {
      return res.status(409).json({
        errorId: NOT_FOUND,
        message: "Email does not exist! Please create account",
      });
    }

    const token: any = new Token({
      organizationId: organization._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
    });
    await token.save();
    await Token.find({
      organizationId: organization._id,
      token: { $ne: token?.token },
    })
      .remove()
      .exec();
    //@TODO - Send forgot password email to reset the password
    await emailService.sendEmail(
      "/templates/forgot-password.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/reset-password/${token?.token}`,
        name: organization.title,
      },
      req.body.email,
      "Resetting your letsdoretro password"
    );
    res.status(200).json({
      message:
        "Email has been sent. Please check your inbox for further instructions to reset the password",
    });
  } catch (err) {
    return res.status(500).json({ message: err || err.message });
  }
}

/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function validateForgotPassword(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (!req.body.token) {
      return res
        .status(500)
        .json({ errorId: REQUIRED, message: "Token is required" });
    }
    const token: any = await Token.findOne({
      token: req.body.token,
    });
    if (!token) {
      return res.status(409).json({
        errorId: TOKEN_EXPIRED,
        message: "Password reset token is invalid or has expired",
      });
    }
    const organization: any = await Organization.findOne({
      _id: token.organizationId,
    });
    if (organization) {
      return res.status(200).json({
        organization: { _id: organization._id },
        message: "Token verified successfully. Please set new password",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err || err.message });
  }
}

/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function verifyAccount(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.token) {
      return res
        .status(500)
        .json({ errorId: NOT_FOUND, message: "Token is required" });
    }
    const emailService = await new EmailService();
    const token: any = await Token.findOne({
      token: req.body.token,
    });

    if (!token) {
      return res.status(500).json({
        errorId: TOKEN_EXPIRED,
        message:
          "We are unable to find a valid token. Your token my have expired.",
      });
    }
    const organization: any = await Organization.findOne({
      _id: token.organizationId,
    });
    if (!organization) {
      return res.status(500).send({
        errorId: NOT_FOUND,
        message: "We are unable to find a user for this token.",
      });
    }
    if (organization?.isVerified) {
      return res.status(500).send({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified. Please login",
      });
    }
    // Verify and save the user
    organization.isVerified = true;
    organization.isActive = true;
    const saved = await organization.save();
    if (!saved) {
      return res.status(500).send({
        errorId: INTERNAL_SERVER_ERROR,
        message: "Error while verifying the account ",
      });
    }
    await emailService.sendEmail(
      "/templates/welcome.ejs",
      {
        url: config.get("url"),
        login_link: `${config.get("url")}/login`,
        name: organization.title,
      },
      organization.email,
      "Welcome to letsdoretro.com"
    );
    return res
      .status(200)
      .json({ message: "The account has been verified. Please login!" });
  } catch (err) {
    return res
      .status(500)
      .json({ errorId: INTERNAL_SERVER_ERROR, message: err || err.message });
  }
}

/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function resendToken(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.email) {
      return res
        .status(500)
        .json({ errorId: NOT_FOUND, message: "Email address is required" });
    }
    const emailService = await new EmailService();
    const organization: any = await Organization.findOne({
      email: req.body.email,
    });
    if (!organization) {
      return res.status(500).json({
        errorId: NOT_FOUND,
        message: "We are unable to find a user with that email.",
      });
    }
    if (organization.isVerified)
      return res.status(500).json({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified. Please log in.",
      });
    const token = new Token({
      organizationId: organization._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const newToken: any = await token.save();
    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: organization.title,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).json({
      message:
        "A verification email has been sent to " + organization.email + ".",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ errorId: INTERNAL_SERVER_ERROR, message: err || err.message });
  }
}

/**
 * Reset new Password
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function resetPassword(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.password) {
      return res.status(500).json({ message: "Password is required" });
    }
    if (!req.body.confirmPassword) {
      return res.status(500).json({ message: "Confirm Password is required" });
    }
    const emailService = await new EmailService();
    const organization: any = await Organization.findOne({
      _id: mongoose.Types.ObjectId(req.body.organizationId),
    });
    const isPasswordSame = await bcrypt.compare(
      req.body.password.trim(),
      organization.password.trim()
    );
    if (isPasswordSame) {
      return res.status(500).json({
        message:
          "Your new password and old password can't be same. Please use different one",
      });
    }
    const hash = await bcrypt.hash(
      req.body.password,
      Number(config.get("bcryptSalt"))
    );
    const query = {
        _id: mongoose.Types.ObjectId(req.body.organizationId),
      },
      update = {
        $set: {
          password: hash,
        },
      },
      options = { useFindAndModify: true };
    const updated: any = await Organization.findOneAndUpdate(
      query,
      update,
      options
    );
    if (!updated) {
      return res
        .status(500)
        .json({ message: "Error while updating new password" });
    }
    await emailService.sendEmail(
      "/templates/password-changed.ejs",
      {
        url: config.get("url"),
        login_link: `${config.get("url")}/login`,
        name: updated.title,
      },
      updated.email,
      "Your letsdoretro password has been changed"
    );
    await Token.find({
      organizationId: updated._id,
    })
      .remove()
      .exec();
    return res.status(200).json({
      code: VERIFIED,
      message: "Password reset successfully! Login now",
    });
  } catch (err) {
    return res.status(500).json({ message: err || err.message });
  }
}

/**
 * Generate New Token
 *
 * @param {Object} payload
 * @returns {String}
 */
export async function generateToken(payload: {
  [Key: string]: any;
}): Promise<string> {
  try {
    const token: string = await jwt.sign(
      payload,
      config.get("accessTokenSecret"),
      {
        expiresIn: "1hr", // 1 hr
      }
    );
    return token;
  } catch (err) {
    throw err | err.message;
  }
}

/**
 * Generate refresh token
 *
 * @param {Object} payload
 * @returns {String}
 */
export async function refreshAccessToken(payload: {
  [Key: string]: any;
}): Promise<string> {
  try {
    delete payload["exp"];
    const token: string = await jwt.sign(
      payload,
      config.get("refreshTokenSecret"),
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
    return token;
  } catch (err) {
    throw err | err.message;
  }
}
