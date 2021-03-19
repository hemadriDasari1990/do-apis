import { Request, Response } from "express";
import { addReactionToNote, getNote, removeReactionFromNote } from "../note";
import { memberLookup } from "../../util/memberFilters";

import Reaction from "../../models/reaction";
import mongoose from "mongoose";
import { socket } from "../../index";
import { getMember } from "../member";

export async function createOrUpdateReaction(
  req: Request,
  res: Response
): Promise<any> {
  try {
    /* Get the admin member */
    const member: any = await getMember({
      userId: req.body.reactedBy,
      isAuthor: true,
      isVerified: true,
    });
    const query = req.body.reactedBy
        ? {
            $and: [
              { noteId: mongoose.Types.ObjectId(req.body.noteId) },
              { reactedBy: mongoose.Types.ObjectId(member?._id) },
            ],
          }
        : {
            reactedBy: { $exists: false }, // this condition is required to insert new record if no records
          },
      update = {
        $set: {
          noteId: req.body.noteId,
          reactedBy: member?._id,
          type: req.body?.type,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const note = await getNote({
      _id: mongoose.Types.ObjectId(req.body?.noteId),
    });
    const reactionDetails = await getReaction({
      $and: [
        { reactedBy: mongoose.Types.ObjectId(member?._id) },
        { noteId: mongoose.Types.ObjectId(req.body.noteId) },
      ],
    });
    /* Remove only if member is known */
    if (
      reactionDetails &&
      req.body.reactedBy &&
      reactionDetails?.type === req.body?.type
    ) {
      if (note?.reactions?.includes(reactionDetails?._id)) {
        await removeReactionFromNote(reactionDetails?._id, req.body?.noteId);
      }
      await removeReactionById(reactionDetails?._id);
      await socket.emit(`new-reaction-${req.body.noteId}`, {
        removed: true,
        ...reactionDetails,
      });
      return res.status(200).send({ removed: true, ...reactionDetails });
    }

    const reactionUpdated: any = await updateReaction(query, update, options);
    if (!reactionUpdated) {
      return res.status(500).send("Error while updating reaction");
    }
    const newReaction: any = await getReaction({
      _id: mongoose.Types.ObjectId(reactionUpdated?._id),
    });
    if (!note?.reactions?.includes(newReaction?._id)) {
      const added = await addReactionToNote(newReaction._id, req.body.noteId);
      await socket.emit(`new-reaction-${added?._id}`, newReaction);
    }
    await socket.emit(`new-reaction-${note?._id}`, newReaction);
    return res.status(200).send(newReaction);
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

export async function getReaction(query: { [Key: string]: any }): Promise<any> {
  try {
    const reaction = await Reaction.aggregate([
      { $match: query },
      memberLookup,
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
