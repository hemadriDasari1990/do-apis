import { Request, Response } from "express";

import Join from "../../models/join";
import { RESOURCE_NOT_FOUND } from "../../util/constants";
import { getBoardDetailsWithProject } from "../board";
import { getMember } from "../member";
import { getPagination } from "../../util";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";
import { updateMemberAvatar } from "../user";

export async function getJoinedMember(query: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const joined = await Join.findOne(query);
    return joined;
  } catch (err) {
    throw err | err.message;
  }
}

export async function joinMemberToBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    if (
      (!payload?.email && !payload?.guestName?.trim()?.length) ||
      !payload?.boardId
    ) {
      return;
    }
    const board = await getBoardDetailsWithProject(payload?.boardId);
    if (!board) {
      return {
        errorId: RESOURCE_NOT_FOUND,
        message: "Board isn't found",
      };
    }
    let member = null;
    let joinedMember = null;
    if (payload?.email) {
      member = await getMember({
        email: payload?.email?.trim(),
        userId: board?.project?.userId,
      });

      /* Update member avatar */
      if (member && payload?.avatarId) {
        await updateMemberAvatar(
          member?.email?.trim(),
          board?.project?.userId,
          payload?.avatarId
        );
      }

      /* Check if member joined */
      joinedMember = await getJoinedMember({
        memberId: member?._id,
        boardId: payload?.boardId,
      });
    }
    /* Do nothing if member is already joined */
    if (joinedMember?._id) {
      joinedMember.newMember = false;
      joinedMember.avatarId = payload?.avatarId;
      return joinedMember;
    }

    const join = new Join({
      boardId: payload.boardId,
      memberId: member?._id,
      guestName: member ? member?.name : payload.guestName,
      avatarId: payload?.avatarId,
    });
    const joined = await join.save();

    return { ...joined, guestName: member ? member?.name : payload.guestName };
  } catch (err) {
    throw `Error while joining member to board ${err || err.message}`;
  }
}

export async function getJoinedMembers(
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
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const joinedMembers = await Join.aggregate(aggregators);
    return res
      .status(200)
      .send(joinedMembers ? joinedMembers[0] : joinedMembers);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
