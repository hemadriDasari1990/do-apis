import { RESOURCE_NOT_FOUND, TOKEN_EXPIRED } from "../../util/constants";
import { Request, Response } from "express";

import Join from "../../models/join";
import Token from "../../models/token";
import config from "config";
import { getBoardDetailsWithProject } from "../board";
import { getMember } from "../member";
import { getPagination } from "../../util";
import jwt from "jsonwebtoken";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";
import { updateMemberAvatar } from "../user";

export async function getJoinedMember(
  query: {
    [Key: string]: any;
  },
  session: any
): Promise<any> {
  try {
    const joined = await Join.findOne(query).session(session);
    return joined;
  } catch (err) {
    throw err | err.message;
  }
}

export async function joinMemberToBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (
      (!payload?.token && !payload?.guestName?.trim()?.length) ||
      !payload?.boardId
    ) {
      return;
    }

    /* Validate invited users */
    let token: any;
    if (payload?.token) {
      /* Check if token exists */
      token = await Token.findOne({
        token: payload?.token?.trim(),
      });
      if (!token) {
        return {
          errorId: TOKEN_EXPIRED,
          message:
            "We are unable to find a valid token. Your token my have expired.",
        };
      }
      /* Verify JWT Token */
      const decodedUser: any = await jwt.verify(
        token?.token,
        config.get("accessTokenSecret")
      );
      if (!decodedUser?.email || !decodedUser) {
        return {
          errorId: TOKEN_EXPIRED,
          message: "The token is expired",
        };
      }
      const board = await getBoardDetailsWithProject(payload?.boardId, session);
      if (!board) {
        return {
          errorId: RESOURCE_NOT_FOUND,
          message: "Board isn't found",
        };
      }
    }

    let member = null;
    let joinedMember: any;
    if (token?.memberId) {
      member = await getMember(
        {
          _id: token?.memberId,
        },
        session
      );

      /* Update member avatar */
      if (member && payload?.avatarId) {
        await updateMemberAvatar(member?._id, payload?.avatarId, session);
      }

      /* Check if member joined */
      joinedMember = await getJoinedMember(
        {
          memberId: member?._id,
          boardId: payload?.boardId,
        },
        session
      );

      /* Do nothing if member is already joined */
      if (joinedMember?._id) {
        joinedMember.avatarId = payload?.avatarId;
        return joinedMember;
      }
    }

    const join = new Join({
      boardId: payload.boardId,
      memberId: member?._id,
      guestName: member ? member?.name : payload.guestName,
      avatarId: payload?.avatarId,
    });
    joinedMember = await join.save({ session });
    await session.commitTransaction();
    return joinedMember;
  } catch (err) {
    await session.abortTransaction();
    throw `Error while joining member to board ${err || err.message}`;
  } finally {
    await session.endSession();
  }
}

export async function checkIfMemberJoinedBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (!payload?.token) {
      return;
    }
    /* Check if token exists */
    const token: any = await Token.findOne({
      token: payload?.token?.trim(),
    }).session(session);
    if (!token) {
      return;
    }
    /* Verify JWT Token */
    const decodedMember: any = await jwt.verify(
      token?.token,
      config.get("accessTokenSecret")
    );
    if (!decodedMember?.email || !decodedMember) {
      return {
        errorId: TOKEN_EXPIRED,
        message: "The token is expired",
      };
    }
    /* Check if member joined */
    const joinedMember = await getJoinedMember(
      {
        memberId: token?.memberId,
        boardId: payload?.boardId,
      },
      session
    );
    await session.commitTransaction();
    return joinedMember;
  } catch (err) {
    await session.abortTransaction();
    throw `Error while checking if member already joined ${err || err.message}`;
  } finally {
    await session.endSession();
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
