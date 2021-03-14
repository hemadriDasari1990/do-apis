import { NextFunction, Request, Response } from "express";

import Reaction from "../../models/reaction";
import { addReactionToNote } from "../note";
import { socket } from "../../index";

export async function createOrUpdateReaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const reaction = new Reaction({
      noteId: req.body?.noteId,
      type: req.body?.type,
    });
    const reactionCreated = await reaction.save();
    if (!reactionCreated) {
      return res.status(500).send("Resource creation is failed");
    }
    const added = await addReactionToNote(reactionCreated._id, req.body.noteId);
    if (!added) {
      return next(added);
    }
    socket.emit(`new-reaction-${added?._id}`, reactionCreated);
    return res.status(200).send(reactionCreated);
  } catch (err) {
    throw new Error(err || err.message);
  }
}

export async function findReactionsByNoteAndDelete(
  noteId: string
): Promise<any> {
  try {
    const reactionsList = await getReactionsByNote(noteId);
    if (!reactionsList?.length) {
      return;
    }
    const deleted = reactionsList.reduce(
      async (promise: Promise<any>, note: { [Key: string]: any }) => {
        await promise;
        await deleteReactionById(note._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

async function deleteReactionById(reactionId: string): Promise<any> {
  try {
    if (!reactionId) {
      return;
    }
    return await Reaction.findByIdAndRemove(reactionId);
  } catch (err) {
    throw `Error while deleting note ${err || err.message}`;
  }
}

async function getReactionsByNote(noteId: string): Promise<any> {
  try {
    if (!noteId) {
      return;
    }
    return await Reaction.find({ noteId });
  } catch (err) {
    throw `Error while fetching notes ${err || err.message}`;
  }
}
