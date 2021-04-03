import { NextFunction, Request, Response } from "express";
import {
  teamMemberTeamsAddFields,
  teamMemberTeamsLookup,
} from "../../util/teamMemberFilters";
import EmailService from "../../services/email";
import Member from "../../models/member";
import { addMemberToUser } from "../user";
import mongoose from "mongoose";
import config from "config";
import { getBoard } from "../board";
import { getPagination } from "../../util";

export async function updateMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = {
        _id: mongoose.Types.ObjectId(req.body.memberId),
      },
      update = {
        $set: {
          name: req.body.name,
          email: req.body.email,
          userId: req.body.userId,
          status: req.body.status || "active",
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        strict: false,
      };
    const updated: any = await Member.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    await addMemberToUser(updated?._id, req.body.userId);
    return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function createMember(payload: { [Key: string]: any }) {
  try {
    const member = await new Member(payload);
    return await member.save();
  } catch (err) {
    throw err | err.message;
  }
}

export async function getMemberDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const members = await Member.aggregate([
      { $match: query },
      teamMemberTeamsLookup,
    ]);
    return res.status(200).json(members);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getMembersByUser(
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
        $match: { $text: { $search: req.query.queryString, $language: "en" } },
      });
      aggregators.push({ $addFields: { score: { $meta: "textScore" } } });
    }
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit },
          teamMemberTeamsLookup,
          teamMemberTeamsAddFields,
        ],
        total: [{ $count: "count" }],
      },
    });

    const members = await Member.aggregate(aggregators);
    return res.status(200).send(members ? members[0] : null);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getMember(query: { [Key: string]: any }): Promise<any> {
  try {
    const member = await Member.findOne(query);
    return member;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const deleted = await Member.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    return res.status(200).json({ deleted: true });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function findMembersByTeamAndDelete(teamId: string): Promise<any> {
  try {
    const membersList = await getMembersByTeam(teamId);
    if (!membersList?.length) {
      return;
    }
    const deleted = membersList.reduce(
      async (promise: Promise<any>, member: { [Key: string]: any }) => {
        await promise;
        await Member.findByIdAndRemove(member._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

async function getMembersByTeam(teamId: string): Promise<any> {
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
  memberId: string
): Promise<any> {
  try {
    if (!teamMemberId || !teamMemberId) {
      return;
    }
    const updated = await Member.findByIdAndUpdate(
      memberId,
      { $push: { teams: teamMemberId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

export async function removeTeamFromMember(memberId: string, teamId: string) {
  try {
    if (!memberId || !teamId) {
      return;
    }
    await Member.findByIdAndUpdate(memberId, { $pull: { teams: teamId } });
  } catch (err) {
    throw new Error("Cannot remove team from member");
  }
}

export async function sendInvitationsToMembers(
  memberIds: Array<string>,
  sender: { [Key: string]: any },
  boardId: string
) {
  try {
    if (!memberIds?.length || !sender || !boardId) {
      return;
    }
    const board: any = await getBoard({
      _id: mongoose.Types.ObjectId(boardId),
    });
    if (!board) {
      return;
    }
    return await memberIds.reduce(async (promise: any, memberId: string) => {
      await promise;
      const member = await getMember({
        _id: mongoose.Types.ObjectId(memberId),
      });
      await sendInviteToMember(board, sender, member);
    }, Promise.resolve());
  } catch (err) {
    return new Error("Cannot remove team from member");
  }
}

export async function sendInviteToMember(
  board: { [Key: string]: any },
  sender: { [Key: string]: any },
  receiver: { [Key: string]: any }
) {
  try {
    if (!sender || !receiver || !board) {
      return;
    }
    const emailService = await new EmailService();
    await emailService.sendEmail(
      "/templates/invite.ejs",
      {
        url: config.get("url"),
        invite_link: `${config.get("url")}/board/${board?._id}?source="email"`,
        name: receiver?.name,
        boardName: board?.title,
        projectName: board?.project?.title,
        senderName: sender?.name,
      },
      receiver.email,
      `You have been invited to join retrospective board ${board?.title}`
    );
  } catch (err) {
    throw err | err.message;
  }
}
