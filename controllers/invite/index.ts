import { Request, Response } from "express";

import Invite from "../../models/invite";
import TeamMember from "../../models/teamMember";
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
            $unwind: "$member",
          },
          { $replaceRoot: { newRoot: "$member" } },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const boards = await Invite.aggregate(aggregators);
    return res.status(200).send(boards ? boards[0] : boards);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function createInvitedTeams(
  teams: Array<string>,
  boardId: string,
  session: any
): Promise<any> {
  try {
    if (!teams || !Array.isArray(teams) || !teams?.length || !boardId) {
      return;
    }
    await teams.reduce(async (promise, id: string) => {
      await promise;
      await createInvitedMembers(id, boardId, session);
    }, Promise.resolve());
  } catch (err) {
    throw new Error(
      `Error while adding invited teams to board ${err || err.message}`
    );
  }
}

export async function createInvitedMembers(
  teamId: string,
  boardId: string,
  session: any
): Promise<any> {
  try {
    if (!teamId || !boardId) {
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
        await createInvitedMember(
          teamMember?.memberId,
          boardId,
          "",
          0,
          session
        );
      },
      Promise.resolve()
    );
  } catch (err) {
    throw new Error(
      `Error while adding invited teams to board ${err || err.message}`
    );
  }
}

export async function createInvitedMember(
  memberId: string,
  boardId: string,
  guestName: string,
  avatarId: number,
  session: any
): Promise<any> {
  try {
    if (!memberId || !boardId) {
      return;
    }
    const query = {
        boardId: mongoose.Types.ObjectId(boardId),
        memberId: mongoose.Types.ObjectId(memberId),
      },
      update = {
        $set: {
          boardId: boardId,
          memberId: memberId,
          guestName: guestName,
          avatarId: avatarId,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    return await Invite.findOneAndUpdate(query, update, options);
  } catch (err) {
    throw new Error(
      `Error while adding invited members to board ${err || err.message}`
    );
  }
}
