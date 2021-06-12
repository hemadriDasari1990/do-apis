import {
  ALREADY_VERIFIED,
  INCORRECT_PASSWORD,
  INTERNAL_SERVER_ERROR,
  PASSWORDS_ARE_SAME,
  TOKEN_EXPIRED,
  TOKEN_MISSING,
  UNAUTHORIZED,
  USER_NOT_FOUND,
  VERIFIED,
  VERIFY_TOKEN_EXPIRY,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import { decodeToken, getToken, getUser } from "../../util";

import EmailService from "../../services/email";
import Member from "../../models/member";
import Token from "../../models/token";
import User from "../../models/user";
import bcrypt from "bcrypt";
import config from "config";
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
  const user: any = await User.findOne({ token: token?.trim() });

  /* Unauthorize the request if user not found */
  if (!user) {
    return res.status(401).json({ status: "error", code: UNAUTHORIZED });
  }
  const secret: string = config.get("accessTokenSecret");
  if (authHeader) {
    await jwt.verify(token, secret, (err: any, jwtUser: any) => {
      if (err || !jwtUser) {
        return res.status(401).json({ status: "error", code: UNAUTHORIZED });
      }
      return next();
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
    const user: { [Key: string]: any } = await getUserByEmail(email);

    /* Check if user is registered */
    if (!user) {
      return res.status(422).json({
        message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
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
      memberId: user?.memberId,
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
    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user._id) },
      {
        $set: {
          token: token,
        },
      }
    );
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
    //extract payload from refresh token and generate a new access token and send it
    const decodedUser: any = jwt.verify(
      req.body.refreshToken,
      config.get("refreshTokenSecret")
    );
    if (!decodedUser || !decodedUser?.email) {
      return res
        .status(401)
        .json({ token: null, message: "Invalid refresh token" });
    }

    const user: any = await User.findOne({
      email: decodedUser?.email,
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      memberId: user?.memberId,
    };

    // Sign token
    const token = await generateToken(
      payload,
      config.get("accessTokenSecret"),
      86400
    ); // 86400 i.e., expires in 24 hrs

    /* Update the token */
    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user._id) },
      {
        $set: {
          token: token,
        },
      }
    );
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
    const user: any = getUser(req.headers.authorization as string);
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
    const user: any = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(409).json({
        errorId: USER_NOT_FOUND,
        message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
      });
    }
    const payload = {
      name: user.name,
      email: user.email,
      type: "forgot-password",
    };

    // Sign token
    const jwtToken = await generateToken(
      payload,
      config.get("accessTokenSecret"),
      86400
    ); // 86400 i.e., expires in 24 hrs
    const query = {
        userId: user._id,
        email: user?.email,
        type: "forgot-password",
      },
      update = {
        $set: {
          userId: user._id,
          email: user?.email,
          type: "forgot-password",
          token: jwtToken,
          createdAt: Date.now(),
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      };
    const token: any = await Token.findOneAndUpdate(query, update, options);

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
    return res.status(200).json({
      message:
        "Email has been sent. Please check your inbox for further instructions to reset the password",
    });
  } catch (err) {
    return res.status(500).json({ message: err || err.message });
  }
}

/**
 * Generate activation link and send an email notification to activate
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export async function resendActivation(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const emailService = await new EmailService();
    const user: any = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(409).json({
        errorId: USER_NOT_FOUND,
        message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        errorId: ALREADY_VERIFIED,
        message: "Your account has been already verified. Please login!",
      });
    }

    // Generate jwt token
    const jwtToken = await generateToken(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        type: "confirm-email",
      },
      config.get("accessTokenSecret"),
      VERIFY_TOKEN_EXPIRY
    );
    if (!jwtToken) {
      return res
        .status(500)
        .json({ message: "Error while generating the token" });
    }
    const query = {
        userId: user?._id,
        email: user?.email,
        type: "confirm-email",
      },
      update = {
        $set: {
          userId: user?._id,
          email: user?.email,
          type: "confirm-email",
          token: jwtToken,
          createdAt: Date.now(),
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      };
    const newToken: any = await Token.findOneAndUpdate(query, update, options);

    //@TODO - Send Email Activation Link
    if (newToken) {
      await emailService.sendEmail(
        "/templates/account-confirmation.ejs",
        {
          url: config.get("url"),
          confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
          name: user?.name,
        },
        user?.email,
        "Please confirm your email"
      );
    }
    return res.status(200).json({
      message:
        "Email has been sent. Please check your inbox for further instructions to activate your account",
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
    const decodedUser: any = await decodeToken(req.body.token as string);
    const user: any = await User.findOne({
      email: decodedUser?.email,
    });

    if (!user) {
      return res.status(409).json({
        errorId: USER_NOT_FOUND,
        message: `We are unable to find an user account associated with ${user.email}. Make sure your Email is correct!`,
      });
    }
    const token: any = await Token.findOne({
      email: user?.email,
      type: "forgot-password",
      token: req?.body?.token?.trim(),
    });
    if (!token) {
      return res.status(409).json({
        errorId: TOKEN_EXPIRED,
        message:
          "Password reset token isn't found or has expired. Please request a new one",
      });
    }
    const verifyUser: any = await jwt.verify(
      token?.token,
      config.get("accessTokenSecret")
    );
    if (!verifyUser?.email || !verifyUser) {
      return res.status(401).json({
        errorId: TOKEN_EXPIRED,
        message:
          "Your token is expired! Please request for new forgot password link.",
      });
    }
    return res.status(200).json({
      message: "Token verified successfully. Please set new password",
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
export async function verifyAccount(req: Request, res: Response): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const emailService = await new EmailService();
    const tokenUser: any = await jwt.verify(
      req.body.token,
      config.get("accessTokenSecret")
    );

    if (!tokenUser?.email || !tokenUser) {
      return res.status(401).json({
        errorId: TOKEN_EXPIRED,
        message:
          "Your token is expired! Please request for new activation link.",
      });
    }

    if (tokenUser?.type !== "update-email") {
      const member: any = await Member.findOne({
        userId: tokenUser?.userId,
        email: tokenUser?.email,
      }).session(session);

      if (!member) {
        return res.status(409).json({
          errorId: USER_NOT_FOUND,
          message: `We are unable to find an user account associated with ${tokenUser?.email}. Make sure your Email is correct!`,
        });
      }

      if (member?.isVerified) {
        return res.status(500).send({
          errorId: ALREADY_VERIFIED,
          message: "This account has already been verified.",
        });
      }
      await Member.findByIdAndUpdate(
        member?._id,
        { $set: { isVerified: true } },
        { session }
      );
    }

    /* Check if token exists */
    const token: any = await Token.findOne({
      userId: mongoose.Types.ObjectId(tokenUser?.userId),
      email: tokenUser?.email,
      type: "confirm-email",
      token: req?.body?.token?.trim(),
    }).session(session);

    if (!token) {
      return res.status(500).json({
        errorId: TOKEN_EXPIRED,
        message:
          "We are unable to find a valid token. Your token my have expired.",
      });
    }
    /* Verify JWT Token */
    const user: any = await User.findOne({
      email: tokenUser?.email,
    }).session(session);
    if (user) {
      const userUpdated = await User.findByIdAndUpdate(
        user?._id,
        { $set: { isVerified: true, isActive: true, email: user.newEmail } },
        { session, new: true }
      );
      if (!userUpdated) {
        return res.status(500).send({
          errorId: INTERNAL_SERVER_ERROR,
          message: "Error while verifying the account",
        });
      }
    }

    if (tokenUser?.type === "update-email") {
      await Member.findOneAndUpdate(
        {
          userId: tokenUser?.userId,
          email: tokenUser?.email,
        },
        {
          $set: {
            email: user.newEmail,
          },
        },
        {
          session: session,
        }
      );
    }
    await Token.findByIdAndRemove(token?._id).session(session);
    if (user) {
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
    }

    await session.commitTransaction();
    return res.status(200).json({ message: "Your account has been verified" });
  } catch (err) {
    await session.abortTransaction();
    return res
      .status(500)
      .json({ errorId: INTERNAL_SERVER_ERROR, message: err || err.message });
  } finally {
    await session.endSession();
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
    const decodedUser: any = await decodeToken(req.body.token as string);
    const user: any = await User.findOne({
      email: decodedUser?.email,
    });

    if (!user) {
      return res.status(409).json({
        errorId: USER_NOT_FOUND,
        message: `We are unable to find an user account associated with ${user.email}. Make sure your Email is correct!`,
      });
    }

    const isPasswordSame = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordSame) {
      return res.status(500).json({
        errorId: PASSWORDS_ARE_SAME,
        message:
          "Your new password and old password can't be same. Please use different one",
      });
    }
    const hashPassword = await bcrypt.hash(
      req.body.password,
      Number(config.get("bcryptSalt"))
    );
    const query = {
        _id: mongoose.Types.ObjectId(user._id),
      },
      update = {
        $set: {
          password: hashPassword,
        },
      },
      options = { useFindAndModify: true };
    const updated: any = await User.findOneAndUpdate(query, update, options);
    if (!updated) {
      return res.status(500).json({
        errorId: INTERNAL_SERVER_ERROR,
        message: "Error while updating new password",
      });
    }
    await emailService.sendEmail(
      "/templates/password-changed.ejs",
      {
        url: config.get("url"),
        login_link: `${config.get("url")}/login`,
        name: updated.name,
      },
      updated.email,
      "Your password has been changed successfully"
    );
    await Token.find({
      userId: user?._id,
      email: user?.email,
      type: "forgot-password",
      token: req?.body?.token?.trim(),
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
  expiry: any
): Promise<string> {
  try {
    const token: string = await jwt.sign(payload, secret, {
      expiresIn: expiry,
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
        expiresIn: 86400, // 86400 i.e., expires in 24 hrs
      }
    );
    return token;
  } catch (err) {
    throw err | err.message;
  }
}
