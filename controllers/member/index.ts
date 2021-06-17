import {
  MAX_MEMBER_COUNT,
  MAX_MEMBER_ERROR,
  RESOURCE_ALREADY_EXISTS,
  VERIFY_TOKEN_EXPIRY,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import {
  addOrRemoveMemberFromTeamInternal,
  removeMemberFromTeam,
} from "../team";
import { getPagination, getUser } from "../../util";
import {
  teamMemberTeamsAddFields,
  teamMemberTeamsLookup,
} from "../../util/teamMemberFilters";

import EmailService from "../../services/email";
import Member from "../../models/member";
import TeamMember from "../../models/teamMember";
import Token from "../../models/token";
import { addMemberToUser } from "../user";
import config from "config";
import { createActivity } from "../activity";
import { generateToken } from "../auth";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";

export async function updateMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const user = getUser(req.headers.authorization as string);
    const count = await Member.find({
      userId: user?._id,
    }).countDocuments();
    if (count >= MAX_MEMBER_COUNT) {
      return res.status(409).json({
        errorId: MAX_MEMBER_ERROR,
        message: `You have reached the limit of maximum members ${MAX_MEMBER_COUNT}. Please upgrade your plan.`,
      });
    }
    if (!req.body.memberId) {
      const member: any = await getMember(
        {
          userId: user?._id,
          email: req.body.email,
        },
        session
      );
      if (member?._id) {
        return res.status(409).json({
          errorId: RESOURCE_ALREADY_EXISTS,
          message: `Member already exists.`,
        });
      }
    }

    const query = {
        _id: mongoose.Types.ObjectId(req.body.memberId),
      },
      update = {
        $set: {
          name: req.body.name,
          email: req.body.email,
          userId: user._id,
          status: req.body.status || "active",
          avatarId: req.body.avatarId,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        strict: false,
        session: session,
      };
    const updated: any = await Member.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    if (req.body?.teams?.length) {
      await req.body?.teams.reduce(
        async (promise: any, team: { [Key: string]: any }) => {
          await promise;
          await addOrRemoveMemberFromTeamInternal(
            team?._id,
            updated?._id,
            session
          );
        },
        Promise.resolve()
      );
    }
    await addMemberToUser(updated?._id, req.body.userId, session);
    /* Send email notification to confirm when creating new member */
    if (!updated?.isVerified) {
      await sendEmailConfirmationToMember(user, updated, session);
    }
    const members: any = await getMemberDetailsLocal(
      { _id: updated?._id },
      session
    );
    await session.commitTransaction();
    return res.status(200).send(members ? members[0] : null);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function createMember(
  payload: { [Key: string]: any },
  session: any
) {
  try {
    const query = {
        _id: { $exists: false },
      },
      update = {
        $set: {
          name: payload?.name,
          email: payload?.email,
          userId: payload?.userId,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        strict: false,
        session: session,
      };
    const updated: any = await Member.findOneAndUpdate(query, update, options);
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getMemberDetails(
  req: Request,
  res: Response
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const members = await getMemberDetailsLocal(query, session);
    await session.commitTransaction();
    return res.status(200).json(members);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function getMemberDetailsLocal(
  query: {
    [Key: string]: any;
  },
  session: any
): Promise<any> {
  try {
    const members = await Member.aggregate([
      { $match: query },
      teamMemberTeamsLookup,
    ]).session(session);
    return members;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getMembersByUser(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      userId: mongoose.Types.ObjectId(req.query.userId as string),
      ...(req.query.status ? { status: req.query.status } : {}),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [
            { name: { $regex: req.query.queryString, $options: "i" } },
            { email: { $regex: req.query.queryString, $options: "i" } },
          ],
        },
      });
    }
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          // { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit },
          teamMemberTeamsLookup,
          teamMemberTeamsAddFields,
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const members = await Member.aggregate(aggregators);
    return res.status(200).send(members ? members[0] : null);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getMembersByTeam(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      teamId: mongoose.Types.ObjectId(req.query.teamId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [
            { name: { $regex: req.query.queryString, $options: "i" } },
            { email: { $regex: req.query.queryString, $options: "i" } },
          ],
        },
      });
    }
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit },
          memberLookup,
          {
            $unwind: {
              path: "$member",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const members = await TeamMember.aggregate(aggregators);
    return res.status(200).send(members ? members[0] : null);
  } catch (err) {
    throw new Error(err || err.message);
  }
}

export async function getMember(
  query: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const member = await Member.findOne(query).session(session);
    return member;
  } catch (err) {
    throw err | err.message;
  }
}

export async function searchMembers(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const members = await Member.aggregate([
      {
        $match: {
          email: { $ne: payload?.email },
          userId: { $ne: payload?.userId },
          $or: [
            { name: { $regex: payload?.queryString, $options: "i" } },
            { email: { $regex: payload?.queryString, $options: "i" } },
          ],
        },
      },
    ]);
    return members;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteMember(req: Request, res: Response): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const member: any = await Member.findById(req.params.id).session(session);
    if (!member) {
      return res.status(500).json({ message: `Cannot find member` });
    }
    await member?.teams?.reduce(
      async (promise: any, teamMemberId: string) => {
        await promise;
        const teamMember: any = await TeamMember.findById(teamMemberId).session(
          session
        );
        if (teamMember) {
          await removeMemberFromTeam(
            teamMember?._id,
            teamMember.teamId,
            session
          );
        }
      },
      [Promise.resolve()]
    );
    await Member.findByIdAndRemove(member._id).session(session);
    await session.commitTransaction();
    return res.status(200).json({ deleted: true });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function findMembersByTeamAndDelete(
  teamId: string,
  session: any
): Promise<any> {
  try {
    const membersList = await getMembersByTeamLocal(teamId);
    if (!membersList?.length) {
      return;
    }
    const deleted = membersList.reduce(
      async (promise: Promise<any>, member: { [Key: string]: any }) => {
        await promise;
        await Member.findByIdAndRemove(member._id).session(session);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

async function getMembersByTeamLocal(teamId: string): Promise<any> {
  try {
    if (!teamId) {
      return;
    }
    return await Member.find({ teamId });
  } catch (err) {
    throw `Error while fetching members ${err || err.message}`;
  }
}

export async function addTeamMemberToMember(
  teamMemberId: string,
  memberId: string,
  session: any
): Promise<any> {
  try {
    if (!teamMemberId || !teamMemberId || !session) {
      return;
    }
    const updated = await Member.findByIdAndUpdate(
      memberId,
      { $push: { teams: teamMemberId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

export async function removeTeamFromMember(
  memberId: string,
  teamId: string,
  session: any
) {
  try {
    if (!memberId || !teamId || !session) {
      return;
    }
    await Member.findByIdAndUpdate(memberId, {
      $pull: { teams: teamId },
    }).session(session);
  } catch (err) {
    throw new Error("Cannot remove team from member");
  }
}

export async function sendInvitationsToMembers(
  memberIds: Array<string>,
  sender: { [Key: string]: any },
  boardId: string,
  session: any
) {
  try {
    if (!memberIds?.length || !sender || !boardId || !session) {
      return;
    }
    return await memberIds.reduce(async (promise: any, memberId: string) => {
      await promise;
      const member = await getMember(
        {
          _id: mongoose.Types.ObjectId(memberId),
        },
        session
      );
      await sendInviteToMember(boardId, sender, member, session);
    }, Promise.resolve());
  } catch (err) {
    return new Error("Error while sending invite to members");
  }
}

export async function sendInviteToMember(
  boardId: string,
  sender: { [Key: string]: any },
  receiver: { [Key: string]: any },
  session: any
) {
  try {
    if (!sender || !receiver || !boardId) {
      return;
    }
    const emailService = await new EmailService();
    const sent = await emailService.sendEmail(
      "/templates/invite.ejs",
      {
        url: config.get("url"),
        invite_link: `${config.get("url")}/board/${boardId}/${receiver?.token}`,
        name: receiver?.name || "",
        senderName: sender?.name,
      },
      receiver.email,
      `You've been invited to join a retrospective session`
    );
    await createActivity(
      {
        memberId: receiver?._id,
        boardId: boardId,
        message: ` <u>${receiver?.name ||
          receiver?.email}</u> have been invited`,
        type: "invite",
      },
      session
    );
    return sent;
  } catch (err) {
    throw err | err.message;
  }
}

/* Send invite to new member when created */
export async function sendEmailConfirmationToMember(
  sender: { [Key: string]: any },
  receiver: { [Key: string]: any },
  session: any
) {
  try {
    if (!sender || !receiver || !session) {
      return;
    }
    const emailService = await new EmailService();
    // Generate jwt token
    const jwtToken = await generateToken(
      {
        userId: sender._id,
        name: receiver.name,
        email: receiver.email,
        type: "confirm-email",
      },
      config.get("accessTokenSecret"),
      VERIFY_TOKEN_EXPIRY
    );

    const query = {
        userId: sender?._id,
        email: receiver?.email,
        type: "confirm-email",
      },
      update = {
        $set: {
          userId: sender?._id,
          email: receiver?.email,
          type: "confirm-email",
          token: jwtToken,
          createdAt: Date.now(),
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const newToken: any = await Token.findOneAndUpdate(query, update, options);
    let sent = null;
    //@TODO - Send Email Activation Link
    if (newToken) {
      sent = await emailService.sendEmail(
        "/templates/join-team.ejs",
        {
          url: config.get("url"),
          confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
          name: receiver?.name,
          senderName: sender?.name,
        },
        receiver?.email,
        "Cofirm your email"
      );
    }

    return sent;
  } catch (err) {
    throw err | err.message;
  }
}
