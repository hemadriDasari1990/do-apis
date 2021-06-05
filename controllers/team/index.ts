import { MAX_TEAM_COUNT, MAX_TEAM_ERROR, REQUIRED } from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import {
  addTeamMemberToMember,
  findMembersByTeamAndDelete,
  getMember,
  removeTeamFromMember,
  sendInvitationsToMembers,
} from "../member";
import { decodeToken, getPagination, getToken, getUser } from "../../util";
import {
  teamMemberMembersAddFields,
  teamMemberMembersLookup,
} from "../../util/teamMemberFilters";

import Board from "../../models/board";
// import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import Team from "../../models/team";
import TeamMember from "../../models/teamMember";
import { addTeamToUser } from "../user";
import { getMemberIds } from "../../util/member";
import mongoose from "mongoose";
import { teamLookup } from "../../util/teamFilters";

export async function updateTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const user = getUser(req.headers.authorization as string);
    const count = await Team.find({
      userId: user?._id,
    }).countDocuments();
    if (count >= MAX_TEAM_COUNT) {
      return res.status(409).json({
        errorId: MAX_TEAM_ERROR,
        message: `You have reached the limit of maximum teams ${MAX_TEAM_COUNT}. Please upgrade your plan.`,
      });
    }

    const query = {
        _id: mongoose.Types.ObjectId(req.body.teamId),
      },
      update = {
        $set: {
          name: req.body.name,
          userId: user?._id,
          status: req.body.status || "active",
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

    const updated: any = await Team.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    await addTeamToUser(updated?._id, user._id, session);
    await session.commitTransaction();
    return res.status(200).send(updated);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

// export async function getTeamDetails(
//   req: Request,
//   res: Response
// ): Promise<any> {
//   try {
//     const query = { _id: mongoose.Types.ObjectId(req.params.id) };
//     const teams = await Team.aggregate([
//       { $match: query },
//       membersLookup,
//       memberAddFields,
//     ]);
//     return res.status(200).json(teams);
//   } catch (err) {
//     return res.status(500).send(err || err.message);
//   }
// }

export async function getTeamsByMember(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      memberId: mongoose.Types.ObjectId(req.params.memberId as string),
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
          teamLookup,
          {
            $unwind: {
              path: "$team",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const teams = await TeamMember.aggregate(aggregators);
    return res.status(200).send(teams ? teams[0] : null);
  } catch (err) {
    throw new Error(err || err.message);
  }
}

export async function getTeamsByUser(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = {
      userId: mongoose.Types.ObjectId(req.query.userId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [{ name: { $regex: req.query.queryString, $options: "i" } }],
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
          teamMemberMembersLookup,
          teamMemberMembersAddFields,
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const teams = await Team.aggregate(aggregators);
    return res.status(200).send(teams ? teams[0] : teams);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getTeams(query: { [Key: string]: any }): Promise<any> {
  try {
    const teams = await Team.aggregate([
      { $match: query },
      teamMemberMembersLookup,
      teamMemberMembersAddFields,
    ]);
    return teams;
  } catch (err) {
    throw err | err.message;
  }
}

async function getTeam(
  query: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const teams = await Team.aggregate([
      { $match: query },
      teamMemberMembersLookup,
      teamMemberMembersAddFields,
    ]).session(session);
    return teams ? teams[0] : null;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await findMembersByTeamAndDelete(req.params.id, session);
    const deleted = await Team.findByIdAndRemove(req.params.id).session(
      session
    );
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    await session.commitTransaction();
    return res.status(200).json({ deleted: true });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

async function getTemMember(query: { [Key: string]: any }, session: any) {
  try {
    if (!query || !session) {
      return;
    }
    const teamMember = await TeamMember.findOne(query).session(session);
    return teamMember;
  } catch (err) {
    throw err || err.message;
  }
}

async function removeTeamMember(id: string, session: any) {
  try {
    if (!id) {
      return;
    }
    await TeamMember.findOneAndRemove({
      _id: id,
    }).session(session);
  } catch (err) {
    throw err || err.message;
  }
}

async function updateTeamMember(
  query: { [Key: string]: any },
  update: { [Key: string]: any },
  options: { [Key: string]: any }
) {
  try {
    if (!query || !update) {
      return;
    }
    const updated = await TeamMember.findOneAndUpdate(query, update, options);
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

async function getTeamMember(query: { [Key: string]: any }, session: any) {
  try {
    if (!query || !session) {
      return;
    }
    const teamMember = await TeamMember.findOne(query)
      .populate([
        {
          path: "member",
          model: "Member",
        },
        {
          path: "team",
          model: "Team",
        },
      ])
      .session(session);
    return teamMember;
  } catch (err) {
    throw err || err.message;
  }
}

export async function addOrRemoveMemberFromTeam(
  req: Request,
  res: Response
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const updated = await addOrRemoveMemberFromTeamInternal(
      req.body.teamId,
      req.body.memberId,
      session
    );
    await session.commitTransaction();
    return res.status(200).json(updated);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function addOrRemoveMemberFromTeamInternal(
  teamId: string,
  memberId: string,
  session: any
): Promise<any> {
  try {
    if (!teamId || !memberId || !session) {
      return;
    }
    const query = {
        teamId: mongoose.Types.ObjectId(teamId),
        memberId: mongoose.Types.ObjectId(memberId),
      },
      update = {
        $set: {
          teamId: teamId,
          memberId: memberId,
        },
      },
      options = { upsert: true, new: true, session: session };

    const teamMember = await getTemMember(query, session);
    const member = await getMember(
      {
        _id: mongoose.Types.ObjectId(memberId),
      },
      session
    );
    const team = await getTeam(
      {
        _id: mongoose.Types.ObjectId(teamId),
      },
      session
    );
    if (teamMember) {
      await removeTeamMember(teamMember?._id, session);
      if (member && member.teams?.includes(teamMember?._id)) {
        await removeTeamFromMember(memberId, teamMember?._id, session);
      }
      if (team && team.members?.includes(teamMember?._id)) {
        await removeMemberFromTeam(teamMember?._id, teamId, session);
      }
      return { removed: true };
    }

    const teamMemberUpdated = await updateTeamMember(query, update, options);
    if (team && !team.members?.includes(teamMemberUpdated?._id)) {
      await addTeamMemberToTeam(teamMemberUpdated?._id, teamId, session);
    }
    if (member && !member.teams?.includes(teamMemberUpdated?._id)) {
      await addTeamMemberToMember(teamMemberUpdated?._id, memberId, session);
    }
    const updatedTeamMember = await getTeamMember(
      {
        _id: mongoose.Types.ObjectId(teamMemberUpdated?._id),
      },
      session
    );
    return updatedTeamMember;
  } catch (err) {
    throw err || err.message;
  }
}

export async function addTeamMemberToTeam(
  teamMemberId: string,
  teamId: string,
  session: any
): Promise<any> {
  try {
    if (!teamMemberId || !teamId || !session) {
      return;
    }
    const updated = await Team.findByIdAndUpdate(
      teamId,
      { $push: { members: teamMemberId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return updated;
  } catch (err) {
    throw `Error while adding member to the team ${err || err.message}`;
  }
}

export async function removeMemberFromTeam(
  memberId: string,
  teamId: string,
  session: any
) {
  try {
    if (!memberId || !teamId || !session) {
      return;
    }

    await Team.findByIdAndUpdate(teamId, {
      $pull: { members: memberId },
    }).session(session);
  } catch (err) {
    throw new Error("Error while removing team from member");
  }
}

export async function sendInvitationToTeams(req: Request, res: Response) {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const teamIds: Array<string> = req.body.teamIds;
    if (!teamIds || !teamIds?.length) {
      return res.status(500).json({
        errorId: REQUIRED,
        message: `Team id's are required in an array`,
      });
    }
    const authHeader: string = req.headers.authorization as string;
    const token = getToken(authHeader);
    const sender: any = decodeToken(token);
    const updatedBoard = await sendInvitation(
      teamIds,
      sender,
      req.body.boardId,
      session
    );
    await session.commitTransaction();
    return res.status(200).json({
      board: updatedBoard,
      inviteSent: true,
      message: `Invitations has been sent to ${teamIds?.length} teams`,
    });
  } catch (err) {
    await session.abortTransaction();
    throw new Error("Error while sending invite to teams");
  } finally {
    await session.endSession();
  }
}

export async function sendInvitation(
  teamIds: Array<string>,
  sender: { [Key: string]: any },
  boardId: string,
  session: any
) {
  try {
    if (!teamIds || !teamIds?.length || !sender || !boardId) {
      return;
    }
    await teamIds.reduce(async (promise: any, teamId: string) => {
      await promise;
      const team: any = await getTeam(
        {
          _id: mongoose.Types.ObjectId(teamId),
        },
        session
      );
      const memberIds = await getMemberIds(team?.members);
      await sendInvitationsToMembers(memberIds, sender, boardId, session);
    }, Promise.resolve());
    const update = {
      $set: {
        inviteSent: true,
      },
      $inc: { inviteCount: 1 },
    };
    const updatedBoard = await Board.findByIdAndUpdate(boardId, update, {
      new: true,
      session: session,
    });
    return updatedBoard;
  } catch (err) {
    throw new Error("Error while sending invite to teams");
  }
}
