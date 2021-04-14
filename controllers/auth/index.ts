import {
  ALREADY_VERIFIED,
  INCORRECT_PASSWORD,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  REQUIRED,
  TOKEN_EXPIRED,
  TOKEN_MISSING,
  UNAUTHORIZED,
  VERIFIED,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";

import EmailService from "../../services/email";
import Member from "../../models/member";
import Token from "../../models/token";
import User from "../../models/user";
import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { getToken } from "../../util";
import { getUserByEmail } from "../user";
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
  const token = getToken(authHeader);
  if (!token) {
    return res.status(500).json({
      errorId: TOKEN_MISSING,
      message: "Token is missing",
      code: UNAUTHORIZED,
    });
  }
  const user: any = await User.findOne({ token: token });
  let secret: any;
  if (user?.token) {
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
    }
    return next();
  });
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
    const user: { [Key: string]: any } = await getUserByEmail(email);
    if (!user) {
      return res.status(422).json({
        message: "Email is not registered with us. Please create an account",
      });
    }
    if (!user?.isVerified) {
      return res.status(422).json({
        message:
          "Your account is not verified yet. Please check your inbox and confirm your email",
      });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(422)
        .json({ errorId: INCORRECT_PASSWORD, message: "Incorrect Password" });
    const payload = {
      _id: user._id,
      name: user.name,
      description: user.description,
      email: user.email,
      accountType: user.accountType,
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
    await User.findByIdAndUpdate(user._id, {
      token: refreshToken,
    });
    await socket.emit(`login-success`);
    return res.status(200).json({
      success: true,
      token: token,
      refreshToken: refreshToken,
      accountType: user?.accountType,
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
    const user: any = await User.findOne({
      token: req.body.refreshToken,
    });
    if (!user) {
      return res.status(401).json({ error: "Token expired!" });
    }
    //extract payload from refresh token and generate a new access token and send it
    const payload: any = jwt.verify(
      user?.token,
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
    return res.status(401).send(err || err.message);
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
    await User.findByIdAndUpdate(req.body.userId, {
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
    const user: any = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({
        errorId: NOT_FOUND,
        message: "Email does not exist! Please create account",
      });
    }

    const token: any = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
    });
    await token.save();
    await Token.find({
      userId: user._id,
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
        name: user.name,
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
    const user: any = await User.findOne({
      _id: token.userId,
    });
    if (user) {
      return res.status(200).json({
        user: { _id: user._id },
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
    const user: any = await User.findOne({
      _id: token.userId,
    });
    if (!user) {
      return res.status(500).send({
        errorId: NOT_FOUND,
        message: "We are unable to find a user for this token.",
      });
    }
    if (user?.isVerified && user.email === user.newEmail) {
      return res.status(500).send({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified. Please login",
      });
    }
    const currentEmail = user.email;
    // Verify and save the user
    user.isVerified = true;
    user.isActive = true;
    user.email = user.newEmail; // Add new email address to current email address
    const userUpdated = await user.save();
    if (!userUpdated) {
      return res.status(500).send({
        errorId: INTERNAL_SERVER_ERROR,
        message: "Error while verifying the account",
      });
    }
    const memberQuery = { email: currentEmail, userId: userUpdated?._id },
      updateMember = {
        $set: {
          name: userUpdated.name,
          email: userUpdated.email,
          userId: userUpdated?._id,
          isVerified: userUpdated.isVerified,
          isAuthor: true,
        },
      },
      memberOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
    await Member.findOneAndUpdate(memberQuery, updateMember, memberOptions);

    await emailService.sendEmail(
      "/templates/welcome.ejs",
      {
        url: config.get("url"),
        login_link: `${config.get("url")}/login`,
        name: user.name,
      },
      user.email,
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
    const user: any = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(500).json({
        errorId: NOT_FOUND,
        message: "We are unable to find a user with that email.",
      });
    }
    if (user.isVerified)
      return res.status(500).json({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified. Please log in.",
      });
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const newToken: any = await token.save();
    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: user.name,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).json({
      message: "A verification email has been sent to " + user.email + ".",
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
    const user: any = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.userId),
    });
    const isPasswordSame = await bcrypt.compare(
      req.body.password.trim(),
      user.password.trim()
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
        _id: mongoose.Types.ObjectId(req.body.userId),
      },
      update = {
        $set: {
          password: hash,
        },
      },
      options = { useFindAndModify: true };
    const updated: any = await User.findOneAndUpdate(query, update, options);
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
        name: updated.name,
      },
      updated.email,
      "Your letsdoretro password has been changed"
    );
    await Token.find({
      userId: updated._id,
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
