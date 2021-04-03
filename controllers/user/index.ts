import { NextFunction, Request, Response } from "express";
import {
  activeProjectsLookup,
  inActiveProjectsLookup,
  projectAddFields,
  projectsLookup,
} from "../../util/projectFilters";
import { memberAddFields, membersLookup } from "../../util/memberFilters";
import { teamAddFields, teamsLookup } from "../../util/teamFilters";

import Board from "../../models/board";
import EmailService from "../../services/email";
import Project from "../../models/project";
import Token from "../../models/token";
import { UNAUTHORIZED } from "../../util/constants";
import User from "../../models/user";
import config from "config";
import crypto from "crypto";
// import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function createUser(req: Request, res: Response): Promise<any> {
  try {
    const emailService = await new EmailService();
    const user = await getUserByEmail(req.body.email);
    if (user && !user?.isVerified) {
      return res.status(400).json({
        errorId: "USER_ALREADY_EXIST",
        message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
      });
    }

    if (user && user?.isVerified) {
      return res.status(400).json({
        errorId: "EMAIL_VERIFIED",
        message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
      });
    }

    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // if(!hashedPassword){
    //   return res
    //       .status(400)
    //       .json({ message: 'Error hashing password' });
    // }

    const newUser: { [Key: string]: any } = new User({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      password: req.body.password,
      isAgreed: req.body.isAgreed,
    });
    const newOrg = await newUser.save();
    newOrg.password = undefined;

    const token = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const newToken: any = await token.save();
    //@TODO - Send Email Activation Link
    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: req.body.name,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).json({
      message:
        "An email verification link has been sent. Please check your inbox",
      newOrg,
    });
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}

export async function confirmEmail(req: Request, res: Response): Promise<any> {
  try {
    const token: any = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send({
        message:
          "Your verification link may have expired. Please click on resend for verify your Email.",
      });
    }
    const user: any = await User.findOne({
      _id: mongoose.Types.ObjectId(token.userId),
      email: req.params.email,
    });
    if (!user) {
      return res.status(401).send({
        message: `We are unable to find a user account associated with ${req.params.email} for this verification. Please SignUp!`,
      });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .send("User has been already verified. Please Login");
    }
    user.isVerified = true;
    await user.save();
    //@TODO - Send successfully verified Email
    return res
      .status(200)
      .send("Your account has been successfully verified. Please login now");
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}
export async function resendActivationLink(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user: any = await User.findOne({
      email: req.params.email,
    });
    if (!user) {
      return res.status(401).send({
        message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
      });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .send("User has been already verified. Please Login");
    }
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    //@TODO - Send Email Activation Link
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}

export async function getUserDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const aggregators: Array<{ [Key: string]: any }> = [
      { $match: query },
      teamsLookup,
      teamAddFields,
      membersLookup,
      memberAddFields,
      projectsLookup,
      projectAddFields,
    ];
    const users = await User.aggregate(aggregators);
    const user: any = users ? users[0] : null;
    if (user) {
      user.password = undefined;
      user.token = undefined;
      return res.status(200).json(user);
    }
    return res.status(401).json({ code: UNAUTHORIZED });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getUserSummary(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const userSummary = await User.aggregate([
      { $match: query },
      activeProjectsLookup,
      inActiveProjectsLookup,
      projectsLookup,
      projectAddFields,
      teamsLookup,
      teamAddFields,
      membersLookup,
      memberAddFields,
    ]);
    const org: any = userSummary ? userSummary[0] : null;
    if (org) {
      org.password = undefined;
      org.token = undefined;
    }
    return res.status(200).json(org);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getUsers(req: Request, res: Response): Promise<any> {
  try {
    console.log(req);
    const users = await User.find({}).select({
      name: 1,
      isVerified: 1,
      description: 1,
      _id: 0,
    });
    return res.status(200).json({
      users,
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getAllSummary(req: Request, res: Response): Promise<any> {
  try {
    console.log(req);
    const usersCount = await User.find({}).count();
    const projectsCount = await Project.find({}).count();
    const boardsCount = await Board.find({}).count();
    return res.status(200).json({
      usersCount,
      projectsCount,
      boardsCount,
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const deleted = await User.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    return res
      .status(200)
      .json({ message: "Resource has been deleted successfully" });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getUserByEmail(email: string): Promise<any> {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    return err || err.message;
  }
}

export async function addDepartmentToUser(
  departmentId: string,
  userId: string
): Promise<any> {
  try {
    if (!userId || !departmentId) {
      return;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { departments: departmentId } },
      { new: true, useFindAndModify: false }
    );
    return user;
  } catch (err) {
    throw "Cannot add department to user";
  }
}

export async function addTeamToUser(
  teamId: string,
  userId: string
): Promise<any> {
  try {
    if (!userId || !teamId) {
      return;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { teams: teamId } },
      { new: true, useFindAndModify: false }
    );
    return user;
  } catch (err) {
    throw "Cannot add team" + err || err.message;
  }
}

export async function addMemberToUser(
  memberId: string,
  userId: string
): Promise<any> {
  try {
    if (!userId || !memberId) {
      return;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { members: memberId } },
      { new: true, useFindAndModify: false }
    );
    return user;
  } catch (err) {
    throw "Cannot add team" + err || err.message;
  }
}

export async function addBoardToUser(
  boardId: string,
  userId: string
): Promise<any> {
  try {
    if (!boardId || !userId) {
      return;
    }
    const updated = await User.findByIdAndUpdate(
      userId,
      { $push: { boards: boardId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding board to user ${err || err.message}`;
  }
}
