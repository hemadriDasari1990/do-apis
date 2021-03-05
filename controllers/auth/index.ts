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
        return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
      } else {
        return next();
      }
    });
  } else {
    return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
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
        .json({ message: "Please enter valid email address" });
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
      return res.status(422).json({ message: "Invalid Password" });
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
      return res.status(500).json({ message: "Email is required" });
    }
    const organization = await Organization.findOne({ email: req.body.email });
    if (!organization) {
      return res.status(409).json({ message: "Email does not exist" });
    }
    const token: any = new Token({
      organizationId: organization._id,
      token: crypto.randomBytes(16).toString("hex"),
      expires: Date.now() + 3600000, // 1hr
    });
    await token.save();
    await Token.find({
      organizationId: organization._id,
      token: { $ne: token.token },
    })
      .remove()
      .exec();
    //@TODO - Send forgot password email to reset the password
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
export async function validateForgotPasswordToken(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (!req.body.token) {
      return res.status(500).json({ message: "Token is required" });
    }
    const token: any = await Token.findOne({
      token: req.body.token,
      expires: { $gt: Date.now() },
    });
    if (!token) {
      return res
        .status(409)
        .json({ message: "Password reset token is invalid or has expired" });
    }
    const updated = Organization.findOne({
      _id: token.organizationId,
    });
    if (updated) {
      return res.status(200).json({ message: "Token verified successfully." });
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
        .json({ errorId: "NOT_FOUND", message: "Token is required" });
    }
    const token: any = await Token.findOne({
      token: req.body.token,
    });

    if (!token) {
      return res.status(500).json({
        errorId: "TOKEN_EXPIRED",
        message:
          "We are unable to find a valid token. Your token my have expired.",
      });
    }
    const organization: any = await Organization.findOne({
      _id: token.organizationId,
    });
    if (!organization) {
      return res.status(500).send({
        errorId: "NOT_FOUND",
        message: "We are unable to find a user for this token.",
      });
    }
    if (organization?.isVerified) {
      return res.status(500).send({
        errorId: "ALREADY_VERIFIED",
        message: "This account has already been verified. Please login",
      });
    }
    // Verify and save the user
    organization.isVerified = true;
    organization.isActive = true;
    const saved = await organization.save();
    if (!saved) {
      return res.status(500).send({
        errorId: "INTERNAL_SERVER_ERROR",
        message: "Error while verifying the account ",
      });
    }
    return res
      .status(200)
      .json({ message: "The account has been verified. Please login!" });
  } catch (err) {
    return res
      .status(500)
      .json({ errorId: "INTERNAL_SERVER_ERROR", message: err || err.message });
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
        .json({ errorId: "NOT_FOUND", message: "Email address is required" });
    }
    const emailService = await new EmailService();
    const organization: any = await Organization.findOne({
      email: req.body.email,
    });
    if (!organization) {
      return res.status(500).json({
        errorId: "NOT_FOUND",
        message: "We are unable to find a user with that email.",
      });
    }
    if (organization.isVerified)
      return res.status(500).json({
        errorId: "ALREADY_VERIFIED",
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
      .json({ errorId: "INTERNAL_SERVER_ERROR", message: err || err.message });
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
    if (!req.body.token) {
      return res.status(500).json({ message: "Token is required" });
    }
    const token: any = await Token.findOne({
      token: req.body.token,
      expires: { $gt: Date.now() },
    });
    if (!token) {
      return res
        .status(409)
        .json({ message: "Password reset token is invalid or has expired" });
    }
    const query = {
        _id: mongoose.Types.ObjectId(token.organizationId),
      },
      update = {
        $set: {
          password: req.body.password,
        },
      };
    const updated = Organization.findOneAndUpdate(query, update);
    if (!updated) {
      return res.status(200).json({ message: "Password can not reset" });
    }
    await token.remove();
    //@TODO - Send sucessfull password reset email
    return res.status(200).json({ message: "Password reset successfully" });
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
