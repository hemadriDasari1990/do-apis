import { Request, Response } from "express";

import Invite from "../../models/Invite";
import { getPagination } from "../../util";
import mongoose from "mongoose";
import { teamLookup } from "../../util/teamFilters";

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
          teamLookup,
          {
            $unwind: "$team",
          },
          {
            $unwind: "$team.members",
          },
          {
            $unwind: "$team.members.member",
          },
          { $replaceRoot: { newRoot: "$team.members.member" } },
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
  boardId: mongoose.Schema.Types.ObjectId
): Promise<any> {
  try {
    if (!teams || !Array.isArray(teams) || !teams?.length || !boardId) {
      return;
    }
    await teams.reduce(async (promise, id: string) => {
      await promise;
      const invite = new Invite({
        boardId: boardId,
        teamId: id,
      });
      await invite.save();
    }, Promise.resolve());
  } catch (err) {
    throw `Error while adding team to board ${err || err.message}`;
  }
}
