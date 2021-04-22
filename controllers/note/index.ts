import { Request, Response } from "express";
import { createdByLookUp, updatedByLookUp } from "../../util/noteFilters";
import {
  reactionAddFields,
  reactionDeserveLookup,
  reactionHighlightLookup,
  reactionLoveLookup,
  reactionMinusOneLookup,
  reactionPlusOneLookup,
} from "../../util/reactionFilters";

import Note from "../../models/note";
import Section from "../../models/section";
import { addNoteToSection } from "../section";
import { createActivity } from "../activity";
import { findReactionsByNoteAndDelete } from "../reaction";
import { getMember } from "../member";
import mongoose from "mongoose";
import { sectionLookup } from "../../util/sectionFilters";

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
    const sectionUpdated: any = await addNoteToSection(
      updated._id,
      payload.sectionId
    );

    if (payload.noteId) {
      await createActivity({
        userId: payload?.userId,
        boardId: payload?.boardId,
        title: `${payload.previousDescription}`,
        primaryAction: "to",
        primaryTitle: `${payload.description}`,
        secondaryAction: "under",
        secondaryTitle: sectionUpdated?.title,
        type: "note",
        action: "update",
      });
    } else {
      await createActivity({
        userId: payload?.userId,
        boardId: payload?.boardId,
        title: `${payload.description}`,
        primaryAction: "under",
        primaryTitle: sectionUpdated?.title,
        type: "note",
        action: "create",
      });
    }

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

      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionHighlightLookup,
      reactionMinusOneLookup,
      reactionLoveLookup,
      reactionAddFields,
      sectionLookup,
      {
        $unwind: {
          path: "$section",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.status(200).json(notes);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getNoteDetails(noteId: string): Promise<any> {
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
      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionHighlightLookup,
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
    await createActivity({
      boardId: payload?.boardId,
      userId: payload?.userId,
      title: ` ${noteUpdated?.description}`,
      primaryAction: "as",
      primaryTitle: payload.read ? "read" : "un read",
      type: "note",
      action: payload.read ? "read" : "un-read",
    });
    return noteUpdated;
  } catch (err) {
    return err || err.message;
  }
}

export async function deleteNote(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const deleted: any = deleteNoteById(payload?.id);
    if (!deleted) {
      return deleted;
    }
    const section: any = await Section.findById(payload?.sectionId);
    await createActivity({
      userId: payload?.userId,
      boardId: payload?.boardId,
      title: `${payload?.description}`,
      primaryAction: "under",
      primaryTitle: section?.title,
      type: "note",
      action: "delete",
    });
    return { deleted: true, _id: payload?.id, sectionId: payload?.sectionId };
  } catch (err) {
    return {
      deleted: false,
      message: err || err?.message,
      _id: payload?.id,
      sectionId: payload?.sectionId,
    };
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

export async function updateNoteSectionId(
  noteId: string,
  sectionId: string
): Promise<any> {
  try {
    if (!noteId || !sectionId) {
      return;
    }
    const updated = await Note.findByIdAndUpdate(noteId, {
      sectionId: sectionId,
    });
    return updated;
  } catch (err) {
    throw `Error while updating new section ${err || err.message}`;
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
