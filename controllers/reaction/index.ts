import { Request, Response } from "express";
import { addReactionToNote, getNote, removeReactionFromNote } from "../note";

import Board from "../../models/board";
import Note from "../../models/note";
import Reaction from "../../models/reaction";
import Section from "../../models/section";
import { createActivity } from "../activity";
import { getMember } from "../member";
import { getPagination } from "../../util";
import mongoose from "mongoose";
import { notesLookup } from "../../util/noteFilters";
import { reactedByLookup } from "../../util/memberFilters";
import { reactionLookup } from "../../util/reactionFilters";
import { sectionsLookup } from "../../util/sectionFilters";

export async function createOrUpdateReaction(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    /* Get the admin member */
    const member: any = !payload?.isAnnonymous
      ? await getMember({
          userId: payload.reactedBy,
          isAuthor: true,
          isVerified: true,
        })
      : null;
    const query = payload?.reactedBy
        ? {
            $and: [
              { noteId: mongoose.Types.ObjectId(payload.noteId) },
              { reactedBy: mongoose.Types.ObjectId(member?._id) },
            ],
          }
        : {
            reactedBy: { $exists: false }, // this condition is required to insert new record if no records
          },
      update = {
        $set: {
          noteId: payload?.noteId,
          reactedBy: member?._id,
          type: payload?.type,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const note = await getNote({
      _id: mongoose.Types.ObjectId(payload?.noteId),
    });
    const reactionDetails = await getReaction({
      $and: [
        { reactedBy: mongoose.Types.ObjectId(member?._id) },
        { noteId: mongoose.Types.ObjectId(payload?.noteId) },
      ],
    });
    /* Remove only if member is known */
    if (
      reactionDetails &&
      payload.reactedBy &&
      reactionDetails?.type === payload?.type
    ) {
      if (note?.reactions?.includes(reactionDetails?._id)) {
        await removeReactionFromNote(reactionDetails?._id, payload?.noteId);
      }
      await removeReactionById(reactionDetails?._id);
      await createActivity({
        userId: payload.reactedBy,
        boardId: payload?.boardId,
        title: payload?.type,
        primaryAction: "to",
        primaryTitle: note?.description,
        type: payload?.type,
        action: "un-react",
      });
      return {
        removed: true,
        ...reactionDetails,
      };
    }

    const reactionUpdated: any = await updateReaction(query, update, options);
    if (!reactionUpdated) {
      return {};
    }
    const newReaction: any = await getReaction({
      _id: mongoose.Types.ObjectId(reactionUpdated?._id),
    });
    if (!note?.reactions?.includes(newReaction?._id)) {
      await addReactionToNote(newReaction._id, payload.noteId);
      await createActivity({
        userId: payload.reactedBy,
        boardId: payload?.boardId,
        title: payload?.type,
        primaryAction: "to",
        primaryTitle: note?.description,
        type: payload?.type,
        action: "react",
      });
    }

    return newReaction;
  } catch (err) {
    throw new Error(err || err.message);
  }
}

async function updateReaction(
  query: { [Key: string]: any },
  update: { [Key: string]: any },
  options: { [Key: string]: any }
) {
  try {
    if (!query || !update) {
      return;
    }
    const updated = await Reaction.findOneAndUpdate(query, update, options);
    return updated;
  } catch (err) {
    throw err || err.message;
  }
}

export async function findReactionsByNoteAndDelete(
  noteId: string
): Promise<any> {
  try {
    const reactionsList = await getReactionsByNote({ noteId });
    if (!reactionsList?.length) {
      return;
    }
    const deleted = reactionsList.reduce(
      async (promise: Promise<any>, note: { [Key: string]: any }) => {
        await promise;
        await removeReactionById(note._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

async function removeReactionById(reactionId: string): Promise<any> {
  try {
    if (!reactionId) {
      return;
    }
    return await Reaction.findByIdAndRemove(reactionId);
  } catch (err) {
    throw `Error while deleting note ${err || err.message}`;
  }
}

async function getReactionsByNote(query: { [Key: string]: any }): Promise<any> {
  try {
    if (!query) {
      return;
    }
    return await Reaction.find(query);
  } catch (err) {
    throw `Error while fetching notes ${err || err.message}`;
  }
}

export async function getReactions(req: Request, res: Response): Promise<any> {
  try {
    const query = {
      noteId: mongoose.Types.ObjectId(req.query.noteId as string),
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
          reactedByLookup,
          {
            $unwind: {
              path: "$reactedBy",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });
    const reactions = await Reaction.aggregate(aggregators);
    return res.status(200).send(reactions ? reactions[0] : reactions);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getReaction(query: { [Key: string]: any }): Promise<any> {
  try {
    const reaction = await Reaction.aggregate([
      { $match: query },
      reactedByLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return reaction ? reaction[0] : null;
  } catch (err) {
    throw err | err.message;
  }
}

export async function getReactionSummaryByBoard(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.boardId) };
    const reactionsSummary = await Board.aggregate([
      { $match: query },
      sectionsLookup,
      {
        $unwind: "$sections",
      },
      {
        $unwind: "$sections.notes",
      },
      {
        $unwind: "$sections.notes.reactions",
      },
      { $replaceRoot: { newRoot: "$sections.notes.reactions" } },
      {
        $group: {
          _id: null,
          plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
          highlight: {
            $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
          },
          minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
          love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
          deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
          totalReactions: { $sum: 1 },
        },
      },
    ]);
    return res
      .status(200)
      .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getReactionSummaryBySection(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.sectionId) };
    const reactionsSummary = await Section.aggregate([
      { $match: query },
      notesLookup,
      {
        $unwind: "$notes",
      },
      {
        $unwind: "$notes.reactions",
      },
      { $replaceRoot: { newRoot: "$notes.reactions" } },
      {
        $group: {
          _id: null,
          plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
          highlight: {
            $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
          },
          minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
          love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
          deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
          totalReactions: { $sum: 1 },
        },
      },
    ]);
    return res
      .status(200)
      .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getReactionSummaryByNote(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.noteId) };
    const reactionsSummary = await Note.aggregate([
      { $match: query },
      reactionLookup,
      {
        $unwind: "$reactions",
      },
      { $replaceRoot: { newRoot: "$reactions" } },
      {
        $group: {
          _id: null,
          plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
          highlight: {
            $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
          },
          minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
          love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
          deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
          totalReactions: { $sum: 1 },
        },
      },
    ]);
    return res
      .status(200)
      .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
