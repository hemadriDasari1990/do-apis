import {
  EMAIL_VERIFIED,
  INCORRECT_PASSWORD,
  PASSWORDS_ARE_NOT_SAME,
  PASSWORDS_ARE_SAME,
  UNAUTHORIZED,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  VERIFY_TOKEN_EXPIRY,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import {
  activeProjectsLookup,
  inActiveProjectsLookup,
  projectAddFields,
  projectAddTotalFields,
  projectsLookup,
} from "../../util/projectFilters";
import {
  memberAddFields,
  memberLookup,
  membersLookup,
} from "../../util/memberFilters";
import { teamAddFields, teamsLookup } from "../../util/teamFilters";

import Board from "../../models/board";
import EmailService from "../../services/email";
import Member from "../../models/member";
import Project from "../../models/project";
import Token from "../../models/token";
import User from "../../models/user";
import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { generateToken } from "../auth";
import { getMember } from "../member";
import { getUser } from "../../util";
import mongoose from "mongoose";

export async function createUser(req: Request, res: Response): Promise<any> {
  try {
    const emailService = await new EmailService();
    const user = await getUserByEmail(req.body.email);
    if (user && !user?.isVerified) {
      return res.status(400).json({
        errorId: USER_ALREADY_EXIST,
        message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
      });
    }

    if (user && user?.isVerified) {
      return res.status(400).json({
        errorId: EMAIL_VERIFIED,
        message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
      });
    }

    if (req.body.password?.trim() !== req.body.confirmPassword?.trim()) {
      return res.status(400).json({
        errorId: EMAIL_VERIFIED,
        message: `Password and Confirm Password do not match`,
      });
    }

    const newUser: { [Key: string]: any } = new User({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      newEmail: req.body.email, // This flag is required for changing email address
      password: req.body.password,
      isAgreed: req.body.isAgreed,
    });
    const userCreated = await newUser.save();
    userCreated.password = undefined;

    /* Create member */
    const memberQuery = { email: req.body.email, userId: userCreated?._id },
      updateMember = {
        $set: {
          name: userCreated.name,
          email: userCreated.email,
          userId: userCreated?._id,
          isAuthor: true,
        },
      },
      memberOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updatedMember: any = await Member.findOneAndUpdate(
      memberQuery,
      updateMember,
      memberOptions
    );
    await addMemberToUser(updatedMember?._id, userCreated?._id, true);
    // Generate jwt token
    const jwtToken = await generateToken(
      {
        name: userCreated.name,
        email: userCreated.email,
        memberId: updatedMember._id,
      },
      config.get("accessTokenSecret"),
      VERIFY_TOKEN_EXPIRY
    );
    if (!jwtToken) {
      return res.status(500).json({ message: "Error while generating tokens" });
    }
    const token = new Token({
      memberId: updatedMember._id,
      token: jwtToken,
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
      userCreated,
    });
  } catch (err) {
    throw err || err.message;
  }
}

export async function resendActivationLink(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const member: any = await getMember({
      email: req.body.email?.trim(),
    });
    if (!member) {
      return res.status(401).send({
        message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
      });
    }
    if (member.isVerified) {
      return res
        .status(200)
        .send("User has been already verified. Please Login");
    }
    const token = new Token({
      userId: member._id,
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
      memberLookup,
      {
        $unwind: {
          path: "$member",
          preserveNullAndEmptyArrays: true,
        },
      },
      membersLookup,
      memberAddFields,
      projectsLookup,
      projectAddTotalFields,
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

export async function updateAvatar(req: Request, res: Response): Promise<any> {
  try {
    const user = getUser(req.headers.authorization as string);
    if (user?._id) {
      const userQuery = {
          _id: mongoose.Types.ObjectId(user?._id),
        },
        userUpdate = {
          $set: {
            avatarId: req.body.avatarId,
          },
        },
        options = {
          new: true,
        };
      await User.findOneAndUpdate(userQuery, userUpdate, options);
      const query = {
          userId: mongoose.Types.ObjectId(user?._id),
        },
        update = {
          $set: {
            avatarId: req.body.avatarId,
          },
        },
        memberOptions = {
          new: true,
        };
      const updated: any = await Member.findOneAndUpdate(
        query,
        update,
        memberOptions
      );
      return res.status(200).send(updated);
    }
    // const updated: any = await updateMemberAvatar(
    //   req.body.email,
    //   user?._id,
    //   req.body.avatarId
    // );
    // return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function updateMemberAvatar(
  memberId: string,
  avatarId: number
): Promise<any> {
  try {
    const query = {
        _id: mongoose.Types.ObjectId(memberId),
      },
      update = {
        $set: {
          avatarId: avatarId,
        },
      },
      options = {
        new: true,
      };
    const updated: any = await Member.findOneAndUpdate(query, update, options);
    return updated;
  } catch (err) {
    throw `Error while updating avatar ${err || err.message}`;
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
    const user: any = userSummary ? userSummary[0] : null;
    if (user) {
      user.password = undefined;
      user.token = undefined;
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getUsers(req: Request, res: Response): Promise<any> {
  try {
    const users = await User.find({}).select({
      name: 1,
      _id: 0,
    });
    return res.status(200).json({
      users,
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getBoardsByUser(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      _id: mongoose.Types.ObjectId(req.params.id),
    };
    const aggregators = [
      { $match: query },
      projectsLookup,
      {
        $unwind: "$projects",
      },
      {
        $unwind: "$projects.boards",
      },
      { $replaceRoot: { newRoot: "$projects.boards" } },
      {
        $sort: {
          _id: -1,
        },
      },
      { $limit: parseInt(req.query.limit as string) },
    ];

    const boards = await User.aggregate(aggregators);
    return res.status(200).send(boards);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getAllSummary(req: Request, res: Response): Promise<any> {
  try {
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
  userId: string,
  updateMember?: boolean // Whether to update member id or not
): Promise<any> {
  try {
    if (!userId || !memberId) {
      return;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { members: memberId },
        ...(updateMember
          ? {
              $set: {
                memberId: memberId,
              },
            }
          : {}),
      },
      { new: true, useFindAndModify: false }
    );
    return user;
  } catch (err) {
    throw "Cannot add team" + err || err.message;
  }
}

export async function addProjectToUser(
  projectId: string,
  userId: string
): Promise<any> {
  try {
    if (!projectId || !userId) {
      return;
    }
    const updated = await User.findByIdAndUpdate(
      userId,
      { $push: { projects: projectId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding project to user ${err || err.message}`;
  }
}

export async function updateEmail(req: Request, res: Response) {
  try {
    const user = await getUser(req.headers.authorization as string);

    const userFromDb: any = await User.findOne({
      _id: mongoose.Types.ObjectId(user?._id),
    });

    if (!userFromDb) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        errorMessage: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userFromDb?.password
    );
    if (!isPasswordValid) {
      return res.status(422).json({
        errorId: INCORRECT_PASSWORD,
        errorMessage: "Incorrect Password",
      });
    }
    const emailService = await new EmailService();
    const query = { _id: mongoose.Types.ObjectId(userFromDb?._id) },
      update = {
        $set: {
          newEmail: req.body.email, // This flag is required for changing email address
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updatedUser: any = await User.findOneAndUpdate(
      query,
      update,
      options
    );
    const tokenQuery = { userId: updatedUser._id },
      updateToken = {
        $set: {
          userId: updatedUser._id,
          token: crypto.randomBytes(16).toString("hex"),
        },
      },
      tokenOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
    const newToken: any = await Token.findOneAndUpdate(
      tokenQuery,
      updateToken,
      tokenOptions
    );
    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: updatedUser.name,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).send({
      updated: true,
      message:
        "We've sent an email confirmation link to your new email address. Please check your inbox",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function updatePassword(req: Request, res: Response) {
  try {
    const user = await getUser(req.headers.authorization as string);

    const userFromDb: any = await User.findOne({
      _id: mongoose.Types.ObjectId(user?._id),
    });

    if (!userFromDb) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        errorMessage: "User not found",
      });
    }

    const isCurrentPasswordSame = await bcrypt.compare(
      req.body.currentPassword?.trim(),
      userFromDb?.password?.trim()
    );
    if (!isCurrentPasswordSame) {
      return res.status(422).json({
        errorId: PASSWORDS_ARE_NOT_SAME,
        errorMessage: "You've provide incorrect current password. Please check",
      });
    }

    const isPasswordSame = await bcrypt.compare(
      req.body.newPassword?.trim(),
      userFromDb?.password?.trim()
    );
    if (isPasswordSame) {
      return res.status(422).json({
        errorId: PASSWORDS_ARE_SAME,
        errorMessage:
          "New password can't be same as old password. Please choose different one",
      });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.newPassword?.trim(),
      Number(config.get("bcryptSalt"))
    );
    const update = {
        $set: {
          password: hashedPassword,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(userFromDb?._id),
      update,
      options
    );

    return res.status(200).send({
      updated: true,
      message:
        "Your password is successfully changed. Please login with new password",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function updateName(req: Request, res: Response) {
  try {
    if (!req.body.name?.trim()?.length) {
      return;
    }
    const user = await getUser(req.headers.authorization as string);
    const userFromDb: any = await User.findOne({
      _id: mongoose.Types.ObjectId(user?._id),
    });

    if (!userFromDb) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        errorMessage: "User not found",
      });
    }

    const query = { _id: mongoose.Types.ObjectId(userFromDb?._id) },
      update = {
        $set: {
          name: req.body.name,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await User.findOneAndUpdate(query, update, options);
    return res.status(200).send({
      updated: true,
      message: "Name has been updated successfully",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
