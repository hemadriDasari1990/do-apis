import { Request, Response } from "express";
import { getMember, sendInviteToMember } from "../member";

import InviteMember from "../../models/invite";
import TeamMember from "../../models/teamMember";
import crypto from "crypto";
import { getPagination } from "../../util";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";

export async function getInvitedMembers(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      boardId: mongoose.Types.ObjectId(req.query.boardId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
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
          // { $replaceRoot: { newRoot: "$member" } },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const boards = await InviteMember.aggregate(aggregators);
    return res.status(200).send(boards ? boards[0] : boards);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function createInvitedTeams(
  teams: Array<string>,
  boardId: string,
  sender: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    if (
      !teams ||
      !Array.isArray(teams) ||
      !teams?.length ||
      !boardId ||
      !sender
    ) {
      return;
    }
    await teams.reduce(async (promise, id: string) => {
      await promise;
      await updateInvitedMembers(id, boardId, sender, session);
    }, Promise.resolve());
  } catch (err) {
    throw new Error(
      `Error while adding invited teams to board ${err || err.message}`
    );
  }
}

export async function updateInvitedMembers(
  teamId: string,
  boardId: string,
  sender: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    if (!teamId || !boardId || !sender) {
      return;
    }
    const teamMembers: any = await TeamMember.find({ teamId: teamId }).session(
      session
    );
    if (!teamMembers?.length) {
      return;
    }
    await teamMembers?.reduce(
      async (promise: any, teamMember: { [Key: string]: any }) => {
        await promise;
        const member: any = await getMember(
          {
            _id: teamMember?.memberId,
          },
          session
        );
        const invitedMember = {
          name: member?.name,
          email: member?.email,
          avatarId: member?.avatarId || 0,
        };
        await updateInvitedMember(boardId, invitedMember, sender, session);
      },
      Promise.resolve()
    );
  } catch (err) {
    throw new Error(
      `Error while adding invited teams to board ${err || err.message}`
    );
  }
}

export async function updateInvitedMember(
  boardId: string,
  sender: { [Key: string]: any },
  invitedMember: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    if (!invitedMember || !boardId || !sender) {
      return;
    }
    const token: any = crypto.randomBytes(16).toString("hex");
    const query = {
        boardId: mongoose.Types.ObjectId(boardId),
        email: invitedMember?.email,
      },
      update = {
        $set: {
          boardId: boardId,
          name: invitedMember?.name,
          email: invitedMember?.email,
          avatarId: invitedMember?.avatarId,
          token: token,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const updatedInvitedMember: any = await InviteMember.findOneAndUpdate(
      query,
      update,
      options
    );
    const sent = await sendInviteToMember(
      boardId,
      sender,
      updatedInvitedMember,
      session
    );
    return sent;
  } catch (err) {
    throw new Error(
      `Error while adding invited members to board ${err || err.message}`
    );
  }
}

export async function createInvitedMember(
  boardId: string,
  name: string,
  email: string,
  avatarId: number,
  session: any
): Promise<any> {
  try {
    if (!boardId || !email) {
      return;
    }
    const token: any = await crypto.randomBytes(16).toString("hex");
    const invite = new InviteMember({
      boardId: boardId,
      name: name || "",
      email: email,
      avatarId: avatarId || 0,
      token: token,
    });
    return await invite.save({ session });
  } catch (err) {
    throw new Error(
      `Error while adding invited member to board ${err || err.message}`
    );
  }
}

export async function checkIfMemberAlreadyInvited(
  memberId: string,
  boardId: string,
  session: any
): Promise<any> {
  try {
    if (!boardId || !memberId) {
      return;
    }
    return await InviteMember.findOne({
      boardId: boardId,
      memberId: memberId,
    }).session(session);
  } catch (err) {
    throw new Error(
      `Error while fetching invited member details ${err || err.message}`
    );
  }
}

export async function findInvitedMembersByBoardAndDelete(
  boardId: string,
  session: any
): Promise<any> {
  try {
    const invitedMembersList: any = await InviteMember.find({
      boardId: boardId,
    });
    if (!invitedMembersList?.length) {
      return;
    }
    const deleted = invitedMembersList?.reduce(
      async (promise: Promise<any>, invitedMember: { [Key: string]: any }) => {
        await promise;
        await InviteMember.findByIdAndRemove(invitedMember?._id).session(
          session
        );
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function updateInvitedMemberAvatar(
  boardId: string,
  invitedMember: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const query = {
        boardId: mongoose.Types.ObjectId(boardId),
        email: invitedMember?.email,
      },
      update = {
        $set: {
          name: invitedMember?.name,
          avatarId: invitedMember?.avatarId,
        },
      },
      options = {
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const updatedInvitedMember: any = await InviteMember.findOneAndUpdate(
      query,
      update,
      options
    );
    return updatedInvitedMember;
  } catch (err) {
    throw `Error while updating invited member ${err || err.message}`;
  }
}
