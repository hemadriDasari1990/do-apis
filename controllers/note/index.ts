import { Request, Response } from "express";
import { createdByLookUp, updatedByLookUp } from "../../util/noteFilters";
import {
  reactionAddFields,
  reactionDeserveLookup,
  reactionLookup,
  reactionLoveLookup,
  reactionMinusOneLookup,
  reactionPlusOneLookup,
  reactionPlusTwoLookup,
} from "../../util/reactionFilters";

import Note from "../../models/note";
import NoteActivity from "../../models/noteActivity";
import { addNoteToSection } from "../section";
import { findReactionsByNoteAndDelete } from "../reaction";
import { getMember } from "../member";
import mongoose from "mongoose";

export async function updateNote(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const creator = payload.createdById
      ? await getMember({
          userId: mongoose.Types.ObjectId(payload.createdById),
        })
      : null;
    const updator = payload.updatedById
      ? await getMember({
          userId: mongoose.Types.ObjectId(payload.updatedById),
        })
      : null;
    const query = { _id: mongoose.Types.ObjectId(payload.noteId) },
      update = {
        $set: {
          description: payload.description,
          sectionId: payload.sectionId,
          createdById: creator ? creator?._id : payload.createdById || null,
          updatedById: updator ? updator?._id : payload.updatedById || null,
          isAnnonymous: payload.isAnnonymous || false,
          position: payload?.position,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updated: any = await Note.findOneAndUpdate(query, update, options);
    await addNoteToSection(updated._id, payload.sectionId);
    await createNoteActivity(updated._id, "update", payload?.user?._id);
    const note = await getNoteDetails(updated?._id);
    return note;
  } catch (err) {
    return err || err.message;
  }
}

export async function getNotesBySectionId(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { sectionId: mongoose.Types.ObjectId(req.params.sectionId) };
    const notes = await Note.aggregate([
      { $match: query },
      createdByLookUp,
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      updatedByLookUp,
      {
        $unwind: {
          path: "$updatedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      reactionLookup,
      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionPlusTwoLookup,
      reactionMinusOneLookup,
      reactionLoveLookup,
      reactionAddFields,
    ]);
    return res.status(200).json(notes);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getNoteDetails(noteId: string): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(noteId) };
    const notes = await Note.aggregate([
      { $match: query },
      createdByLookUp,
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      updatedByLookUp,
      {
        $unwind: {
          path: "$updatedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      reactionLookup,
      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionPlusTwoLookup,
      reactionMinusOneLookup,
      reactionLoveLookup,
      reactionAddFields,
    ]);
    return notes ? notes[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function markNoteRead(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(payload.id) },
      update = {
        $set: {
          read: payload.read,
        },
      },
      options = { new: true };
    const noteUpdated: any = await Note.findOneAndUpdate(
      query,
      update,
      options
    );
    await createNoteActivity(
      noteUpdated._id,
      payload.read ? "read" : "un-read",
      payload?.user?._id
    );
    return noteUpdated;
  } catch (err) {
    return err || err.message;
  }
}

export async function deleteNote(
  id: string,
  userId: string,
  sectionId: string
): Promise<any> {
  try {
    const deleted = deleteNoteById(id);
    if (!deleted) {
      return deleted;
    }
    await createNoteActivity(id, "delete", userId);
    return { deleted: true, _id: id, sectionId };
  } catch (err) {
    return {
      deleted: false,
      message: err || err?.message,
      _id: id,
      sectionId,
    };
  }
}

export async function createNoteActivity(
  notedId: string,
  action: string,
  userId?: string
): Promise<any> {
  try {
    const activity = await new NoteActivity({
      userId: userId,
      notedId: notedId,
      type: "note",
      action: action,
    });
    await activity.save();
  } catch (err) {
    throw err || err.message;
  }
}

export async function addReactionToNote(
  reactionId: string,
  noteId: string
): Promise<any> {
  try {
    if (!reactionId || !noteId) {
      return;
    }
    const updated = await Note.findByIdAndUpdate(
      noteId,
      { $push: { reactions: reactionId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding reaction ${err || err.message}`;
  }
}

export async function removeReactionFromNote(
  reactionId: string,
  noteId: string
) {
  try {
    if (!reactionId || !noteId) {
      return;
    }
    await Note.findByIdAndUpdate(noteId, { $pull: { reactions: reactionId } });
  } catch (err) {
    throw new Error("Error while removing reaction from note");
  }
}

export async function findNotesBySectionAndDelete(
  sectionId: string
): Promise<any> {
  try {
    const notesList = await getNotesBySection(sectionId);
    if (!notesList?.length) {
      return;
    }
    const deleted = notesList.reduce(
      async (promise: Promise<any>, note: { [Key: string]: any }) => {
        await promise;
        await findReactionsByNoteAndDelete(note._id);
        await deleteNoteById(note._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getNote(query: { [Key: string]: any }): Promise<any> {
  try {
    const note = await Note.findOne(query);
    return note;
  } catch (err) {
    throw err | err.message;
  }
}

export async function updateNotePosition(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    if (!payload) {
      return { updated: false };
    }
    const sourceNote = await getNote({
      _id: mongoose.Types.ObjectId(payload?.sourceId),
    });
    const destinationNote = await getNote({
      _id: mongoose.Types.ObjectId(payload?.destinationId),
    });
    if (sourceNote && destinationNote) {
      await Note.findByIdAndUpdate(sourceNote?._id, {
        position: destinationNote?.position,
      });
    }

    if (sourceNote && destinationNote) {
      await Note.findByIdAndUpdate(destinationNote?._id, {
        position: sourceNote?.position,
      });
    }
    return {
      updated: true,
    };
  } catch (err) {
    return {
      updated: false,
      error: err | err.message,
    };
  }
}

async function deleteNoteById(noteId: string): Promise<any> {
  try {
    if (!noteId) {
      return;
    }
    return await Note.findByIdAndRemove(noteId);
  } catch (err) {
    throw `Error while deleting note ${err || err.message}`;
  }
}

async function getNotesBySection(sectionId: string): Promise<any> {
  try {
    if (!sectionId) {
      return;
    }
    return await Note.find({ sectionId });
  } catch (err) {
    throw `Error while fetching notes ${err || err.message}`;
  }
}
