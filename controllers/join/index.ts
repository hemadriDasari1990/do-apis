import {
  INTERNAL_SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  TOKEN_EXPIRED,
} from "../../util/constants";
import { Request, Response } from "express";

import Board from "../../models/board";
import InviteMember from "../../models/invite";
import Join from "../../models/join";
import { addJoinedMemberToBoard } from "../board";
import { createActivity } from "../activity";
import { getPagination } from "../../util";
import { getSocketInstance } from "../../socket";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";
import { updateInvitedMemberAvatar } from "../invite";

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

export async function joinMemberToBoard(
  req: Request,
  res: Response
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (!req?.body?.boardId) {
      return;
    }
    const io: any = getSocketInstance();

    const board = await Board.findById(req?.body?.boardId).session(session);
    if (!board) {
      return {
        errorId: RESOURCE_NOT_FOUND,
        message: "Board isn't found",
      };
    }

    /* Validate invited users */
    let token: any;
    if (req?.body?.token && !req?.body?.isAnonymous) {
      /* Check if token exists */
      token = await InviteMember.findOne({
        memberId: req?.body?.memberId,
        boardId: req?.body?.boardId,
        token: req?.body?.token?.trim(),
      }).session(session);
      if (!token) {
        return {
          errorId: TOKEN_EXPIRED,
          message: "We are unable to find a valid token.",
        };
      }
      await updateInvitedMemberAvatar(
        req?.body?.boardId,
        {
          avatarId: req?.body?.avatarId,
          name: req?.body?.name,
        },
        session
      );
    }

    const query = req?.body?.email
        ? {
            $and: [
              { boardId: mongoose.Types.ObjectId(req?.body.boardId) },
              { email: req?.body?.email },
            ],
          }
        : { _id: { $exists: false } },
      update = {
        $set: {
          boardId: req?.body.boardId,
          name: !req?.body?.isAnonymous ? req?.body?.name : "Team Member",
          avatarId: req?.body?.avatarId || 0,
          email: req?.body?.email,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const joinedMember: any = await Join.findOneAndUpdate(
      query,
      update,
      options
    );
    await createActivity(
      {
        memberId: joinedMember?._id,
        boardId: req?.body.boardId,
        message: ` joined the session`,
        type: "join",
      },
      session
    );
    await addJoinedMemberToBoard(joinedMember?._id, req?.body.boardId, session);
    await session.commitTransaction();
    io.emit(`join-member-to-board-response`, joinedMember);
    return res.status(200).send(joinedMember);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({
      errorId: INTERNAL_SERVER_ERROR,
      message: err || err?.message,
    });
  } finally {
    await session.endSession();
  }
}

// export async function checkIfMemberJoinedBoard(payload: {
//   [Key: string]: any;
// }): Promise<any> {
//   const session = await mongoose.startSession();
//   await session.startTransaction();
//   try {
//     if (!payload?.token) {
//       return;
//     }
//     /* Check if token exists */
//     const token: any = await Token.findOne({
//       token: payload?.token?.trim(),
//     }).session(session);
//     if (!token) {
//       return;
//     }
//     /* Verify JWT Token */
//     const decodedMember: any = await jwt.verify(
//       token?.token,
//       config.get("accessTokenSecret")
//     );
//     if (!decodedMember?.email || !decodedMember) {
//       return {
//         errorId: TOKEN_EXPIRED,
//         message: "The token is expired",
//       };
//     }
//     /* Check if member joined */
//     const joinedMember = await getJoinedMember(
//       {
//         memberId: token?.memberId,
//         boardId: payload?.boardId,
//       },
//       session
//     );
//     await session.commitTransaction();
//     return joinedMember;
//   } catch (err) {
//     await session.abortTransaction();
//     throw `Error while checking if member already joined ${err || err.message}`;
//   } finally {
//     await session.endSession();
//   }
// }

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

export async function findJoinedMembersByBoardAndDelete(
  boardId: string,
  session: any
): Promise<any> {
  try {
    const joinedMembersList: any = await Join.find({ boardId: boardId });
    if (!joinedMembersList?.length) {
      return;
    }
    const deleted = joinedMembersList?.reduce(
      async (promise: Promise<any>, joinedMember: { [Key: string]: any }) => {
        await promise;
        await Join.findByIdAndRemove(joinedMember?._id).session(session);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}
