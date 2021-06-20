import { Request, Response } from "express";
import { createdByLookUp, updatedByLookUp } from "../../util/noteFilters";
import {
  reactionAddFields,
  reactionAgreeLookup,
  reactionDeserveLookup,
  reactionDisagreeLookup,
  reactionHighlightLookup,
  reactionLoveLookup,
} from "../../util/reactionFilters";

import Note from "../../models/note";
import { RESOURCE_NOT_FOUND } from "../../util/constants";
import Section from "../../models/section";
import { addNoteToSection } from "../section";
import { createActivity } from "../activity";
import { findReactionsByNoteAndDelete } from "../reaction";
import { getBoardDetailsWithProject } from "../board";
import mongoose from "mongoose";
import { sectionLookup } from "../../util/sectionFilters";

export async function updateNote(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const board = await getBoardDetailsWithProject(payload?.boardId, session);
    if (!board) {
      return {
        errorId: RESOURCE_NOT_FOUND,
        message: "Board isn't found",
      };
    }
    let createdById = payload.createdById;
    let updatedById = null;
    if (!payload.noteId && !payload?.isAnonymous && !board?.isAnonymous) {
      createdById = payload.createdById;
      updatedById = payload.createdById;
    }

    if (payload.noteId && !payload?.isAnonymous && !board?.isAnonymous) {
      createdById = payload.createdById;
      updatedById = payload.updatedById;
    }

    // @TODO - Need a way to capture anonymous people avatar and name
    const query = { _id: mongoose.Types.ObjectId(payload.noteId) },
      update = {
        $set: {
          description: payload.description,
          sectionId: payload.sectionId,
          createdById: createdById,
          updatedById: updatedById,
          isAnonymous: payload.isAnonymous || false,
          ...(!payload.noteId ? { position: payload.position } : {}),
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const updated: any = await Note.findOneAndUpdate(query, update, options);
    const sectionUpdated: any = await addNoteToSection(
      updated._id,
      payload.sectionId,
      session
    );

    if (payload.noteId) {
      await createActivity(
        {
          memberId: updatedById,
          boardId: payload?.boardId,
          message: ` renamed note <u>${payload.previousDescription}</u> to <u>${payload.description}</u> under section <u>${sectionUpdated?.name}</u>`,
          type: "note",
        },
        session
      );
    } else {
      await createActivity(
        {
          memberId: createdById,
          boardId: payload?.boardId,
          message: ` created note <u>${payload.description}</u> under section <u>${sectionUpdated?.name}</u>`,
          type: "note",
        },
        session
      );
    }

    const note = await getNoteDetails(updated?._id, session);
    await session.commitTransaction();
    return note;
  } catch (err) {
    await session.abortTransaction();
    return err || err.message;
  } finally {
    await session.endSession();
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
      { $sort: { position: 1 } },
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
      reactionAgreeLookup,
      reactionHighlightLookup,
      reactionDisagreeLookup,
      reactionLoveLookup,
      reactionAddFields,
      sectionLookup,
      {
        $unwind: {
          path: "$section",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          createdBy: 1,
          createdById: 1,
          createdAt: 1,
          updatedAt: 1,
          description: 1,
          isAnonymous: 1,
          position: 1,
          read: 1,
          sectionId: 1,
          section: 1,
          totalDeserve: 1,
          totalHighlight: 1,
          totalLove: 1,
          totalDisagree: 1,
          totalAgree: 1,
          totalReactions: 1,
          _id: 1,
          reactions: 1,
          updatedBy: 1,
          updatedById: 1,
        },
      },
    ]);
    return res.status(200).json(notes);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getNoteDetails(
  noteId: string,
  session: any
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(noteId) };
    const notes = await Note.aggregate([
      { $match: query },
      sectionLookup,
      {
        $unwind: {
          path: "$section",
          preserveNullAndEmptyArrays: true,
        },
      },
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
      reactionAgreeLookup,
      reactionHighlightLookup,
      reactionDisagreeLookup,
      reactionLoveLookup,
      reactionAddFields,
    ]).session(session);
    return notes ? notes[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function markNoteRead(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const query = { _id: mongoose.Types.ObjectId(payload.id) },
      update = {
        $set: {
          read: payload.read,
        },
      },
      options = { new: true, session: session };
    const noteUpdated: any = await Note.findOneAndUpdate(
      query,
      update,
      options
    );
    await createActivity(
      {
        boardId: payload?.boardId,
        memberId: payload?.joinedMemberId,
        message: ` marked <u>${noteUpdated?.description}</u> as <b>${
          payload.read ? "discussed" : "not discussed"
        }</b>`,
        type: "note",
      },
      session
    );
    await session.commitTransaction();
    return noteUpdated;
  } catch (err) {
    await session.abortTransaction();
    return err || err.message;
  } finally {
    await session.endSession();
  }
}

export async function deleteNote(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const deleted: any = await deleteNoteById(payload?.id, session);
    if (!deleted) {
      return {
        deleted: false,
      };
    }
    const section: any = await Section.findById(payload?.sectionId).session(
      session
    );
    await createActivity(
      {
        memberId: payload?.joinedMemberId,
        boardId: payload?.boardId,
        message: ` deleted note <u>${payload?.description}</u> under <u>${section?.name}</u>`,
        type: "note",
      },
      session
    );
    await session.commitTransaction();
    return { deleted: true, _id: payload?.id, sectionId: payload?.sectionId };
  } catch (err) {
    await session.abortTransaction();
    return {
      deleted: false,
      message: err || err?.message,
      _id: payload?.id,
      sectionId: payload?.sectionId,
    };
  } finally {
    await session.endSession();
  }
}

export async function addReactionToNote(
  reactionId: string,
  noteId: string,
  session: any
): Promise<any> {
  try {
    if (!reactionId || !noteId) {
      return;
    }
    const updated = await Note.findByIdAndUpdate(
      noteId,
      { $push: { reactions: reactionId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return updated;
  } catch (err) {
    throw `Error while adding reaction ${err || err.message}`;
  }
}

export async function updateNoteSectionId(
  noteId: string,
  sectionId: string,
  session: any
): Promise<any> {
  try {
    if (!noteId || !sectionId || !session) {
      return;
    }
    const updated = await Note.findByIdAndUpdate(noteId, {
      sectionId: sectionId,
    }).session(session);
    return updated;
  } catch (err) {
    throw `Error while updating new section ${err || err.message}`;
  }
}

export async function removeReactionFromNote(
  reactionId: string,
  noteId: string,
  session: any
) {
  try {
    if (!reactionId || !noteId || !session) {
      return;
    }
    await Note.findByIdAndUpdate(noteId, {
      $pull: { reactions: reactionId },
    }).session(session);
  } catch (err) {
    throw new Error("Error while removing reaction from note");
  }
}

export async function findNotesBySectionAndDelete(
  sectionId: string,
  session: any
): Promise<any> {
  try {
    const notesList = await getNotesBySection(sectionId, session);
    if (!notesList?.length) {
      return;
    }
    const deleted = notesList.reduce(
      async (promise: Promise<any>, note: { [Key: string]: any }) => {
        await promise;
        await findReactionsByNoteAndDelete(note._id, session);
        await deleteNoteById(note._id, session);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getNote(
  query: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const note = await Note.findOne(query).session(session);
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
    const sourceQuery = {
        $and: [
          { sectionId: mongoose.Types.ObjectId(payload?.sectionId) },
          { position: payload?.sourceIndex },
        ],
      },
      update = {
        $set: {
          position: payload?.destinationIndex,
        },
      },
      options = { new: true, setDefaultsOnInsert: true };
    const destinationQuery = {
        $and: [
          { sectionId: mongoose.Types.ObjectId(payload?.sectionId) },
          { position: payload?.destinationIndex },
        ],
      },
      destinationUpdate = {
        $set: {
          position: payload?.sourceIndex,
        },
      },
      destinationOptions = {
        new: true,
        setDefaultsOnInsert: true,
      };
    const sourceNote: any = await Note.findOneAndUpdate(
      sourceQuery,
      update,
      options
    );
    const destinationNote: any = await Note.findOneAndUpdate(
      destinationQuery,
      destinationUpdate,
      destinationOptions
    );

    return {
      updated: true,
      sourceIndex: sourceNote?.position,
      destinationIndex: destinationNote?.position,
    };
  } catch (err) {
    return {
      updated: false,
      error: err | err.message,
    };
  }
}

async function deleteNoteById(noteId: string, session: any): Promise<any> {
  try {
    if (!noteId || !session) {
      return;
    }
    return await Note.findByIdAndRemove(noteId).session(session);
  } catch (err) {
    throw `Error while deleting note ${err || err.message}`;
  }
}

async function getNotesBySection(
  sectionId: string,
  session: any
): Promise<any> {
  try {
    if (!sectionId || !session) {
      return;
    }
    return await Note.find({ sectionId }).session(session);
  } catch (err) {
    throw `Error while fetching notes ${err || err.message}`;
  }
}
