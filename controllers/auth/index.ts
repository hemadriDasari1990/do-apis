import {
  ALREADY_VERIFIED,
  INCORRECT_PASSWORD,
  INTERNAL_SERVER_ERROR,
  TOKEN_EXPIRED,
  TOKEN_MISSING,
  UNAUTHORIZED,
  USER_NOT_FOUND,
  VERIFIED,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import { getToken, getUser } from "../../util";

import EmailService from "../../services/email";
import Token from "../../models/token";
import User from "../../models/user";
import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { getMember } from "../member";
import { getUserByEmail } from "../user";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
  /* Unauthorize the request if user not found */
  if (!user) {
    return res.status(401).json({ status: "error", code: UNAUTHORIZED });
  }
  let secret: any;
  if (user?.token) {
    secret = config.get("refreshTokenSecret");
  } else {
    secret = config.get("accessTokenSecret");
  }
  await jwt.verify(token, secret, (err: any, jwtUser: any) => {
    if (err) {
      return res.status(401).json({ status: "error", code: UNAUTHORIZED });
    }
    if (!jwtUser) {
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

    /* Check if user is registered */
    if (!user) {
      return res.status(422).json({
        message: "Email is not registered with us. Please create an account",
      });
    }
    /* Check if user account is verified */
    if (!user?.isVerified) {
      return res.status(422).json({
        message:
          "Your account is not verified yet. Please check your inbox and confirm your email",
      });
    }
    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(422)
        .json({ errorId: INCORRECT_PASSWORD, message: "Incorrect Password" });
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
    };

    // Generate token
    const token = await generateToken(
      payload,
      config.get("accessTokenSecret"),
      "1hr"
    );
    if (!token) {
      return res.status(500).json({ message: "Error while logging in" });
    }

    /* Refresh token */
    const refreshToken = await refreshAccessToken(payload);
    if (!refreshToken) {
      return res.status(500).json({ message: "Error while logging in" });
    }

    /* Update the token */
    await User.findByIdAndUpdate(user._id, {
      token: refreshToken,
    });
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
    const user = getUser(req.headers.authorization as string);
    await User.findByIdAndUpdate(user?._id, {
      token: null,
    });
    return res.status(200).json({ success: "Logout successfull" });
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
    const emailService = await new EmailService();
    const member: any = await getMember({
      email: req.body.email,
    });

    if (!member) {
      return res.status(409).json({
        errorId: USER_NOT_FOUND,
        message: "Email does not exist! Please create account",
      });
    }

    const token: any = new Token({
      memberId: member._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
    });
    await token.save();
    await Token.find({
      memberId: member._id,
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
        name: member.name,
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
    const token: any = await Token.findOne({
      token: req.body.token,
    });
    if (!token) {
      return res.status(409).json({
        errorId: TOKEN_EXPIRED,
        message: "Password reset token isn't found or has expired",
      });
    }
    const member: any = await getMember({
      _id: token.memberId,
    });
    if (member) {
      return res.status(200).json({
        user: { _id: member?.userId },
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
    const emailService = await new EmailService();
    /* Check if token exists */
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
    /* Verify JWT Token */
    const decodedUser: any = await jwt.verify(
      token?.token,
      config.get("accessTokenSecret")
    );
    if (!decodedUser?.email || !decodedUser) {
      return res.status(401).json({
        errorId: TOKEN_EXPIRED,
        message: "The token is expired",
      });
    }
    const member: any = await getMember({
      _id: token.memberId,
    });
    if (!member) {
      return res.status(500).send({
        errorId: USER_NOT_FOUND,
        message: "We are unable to find a user for this token.",
      });
    }
    if (member?.isVerified) {
      return res.status(500).send({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified.",
      });
    }
    member.isVerified = true;
    await member.save();

    const user: any = await User.findOne({
      _id: member.userId,
    });
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
    return res.status(200).json({ message: "Your account has been verified" });
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
    const emailService = await new EmailService();
    const member: any = await getMember({
      email: req.body.email,
    });
    if (!member) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        message: "We are unable to find a user with that email.",
      });
    }
    if (member.isVerified) {
      return res.status(500).json({
        errorId: ALREADY_VERIFIED,
        message: "This account has already been verified. Please log in.",
      });
    }

    const token: any = new Token({
      memberId: member._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const newToken: any = await token.save();

    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: member.name,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).json({
      message: "A verification email has been sent to " + member.email + ".",
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
    const emailService = await new EmailService();
    const user: any = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.userId),
    });
    const isPasswordSame = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordSame) {
      return res.status(500).json({
        message:
          "Your new password and old password can't be same. Please use different one",
      });
    }
    const hashPassword = await bcrypt.hash(
      req.body.password,
      Number(config.get("bcryptSalt"))
    );
    const query = {
        _id: mongoose.Types.ObjectId(req.body.userId),
      },
      update = {
        $set: {
          password: hashPassword,
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
export async function generateToken(
  payload: {
    [Key: string]: any;
  },
  secret: string,
  expiry: string
): Promise<string> {
  try {
    const token: string = await jwt.sign(payload, secret, {
      expiresIn: expiry, // 1 hr
    });
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
