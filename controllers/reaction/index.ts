import { addReactionToNote, getNote, removeReactionFromNote } from "../note";

import Reaction from "../../models/reaction";
import { getMember } from "../member";
import { memberLookup } from "../../util/memberFilters";
import mongoose from "mongoose";

export async function createOrUpdateReaction(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    /* Get the admin member */
    const member: any = await getMember({
      userId: payload.reactedBy,
      isAuthor: true,
      isVerified: true,
    });
    const query = payload.reactedBy
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
          noteId: payload.noteId,
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
