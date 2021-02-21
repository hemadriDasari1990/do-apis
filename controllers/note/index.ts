import { NextFunction, Request, Response } from "express";
import {
  noteAddFields,
  reactionDeserveLookup,
  reactionDisAgreeLookup,
  reactionLookup,
  reactionLoveLookup,
  reactionPlusOneLookup,
  reactionPlusTwoLookup
} from '../../util/noteFilters';

import Note from '../../models/note';
import { addNoteToSection } from "../section";
import { findReactionsByNoteAndDelete } from "../reaction";
import mongoose from 'mongoose';
import { socket } from "../../index";

export async function updateNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const update = {
      description: req.body.description,
      sectionId: req.body.sectionId
    };
    const options = { upsert: true, new: true };
    const updated: any = await Note.findByIdAndUpdate(req.body.noteId ? req.body.noteId: new mongoose.Types.ObjectId(), update, options);
    if(!updated){ return next(updated);}
    const added = await addNoteToSection(updated._id, req.body.sectionId);
    if(!added){
      return next(added);
    }
    const note = await getNoteDetails(updated?._id);
    socket.emit(`update-note-${note?.sectionId}`, note);
    return res.status(200).send(note)
  } catch(err){
    return res.status(500).send(err || err.message);
  }
};

export async function getNotesBySectionId(req: Request, res: Response): Promise<any> {
  try {
    const query = { sectionId: mongoose.Types.ObjectId(req.params.sectionId)};
    const notes = await Note.aggregate([
      { "$match": query },
      reactionLookup,
      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionPlusTwoLookup,
      reactionDisAgreeLookup,
      reactionLoveLookup,
      noteAddFields
    ]);
    return res.status(200).json(notes);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

async function getNoteDetails(noteId: string): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(noteId)};
    const notes = await Note.aggregate([
      { "$match": query },
      reactionLookup,
      reactionDeserveLookup,
      reactionPlusOneLookup,
      reactionPlusTwoLookup,
      reactionDisAgreeLookup,
      reactionLoveLookup,
      noteAddFields
    ]);
    return notes ? notes[0]: null;;
  } catch(err){
    throw err || err.message;
  }
}

export async function markReadNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id)},
    update = { $set: {
      read: req.body.read,
    }};
    const noteUpdated: any = await Note.findOneAndUpdate(query, update);
    if (!noteUpdated) {
      res.status(500).json({ message: `Cannot Update note`});
      return next(noteUpdated);
    }
    noteUpdated.read = req.body.read;
    await socket.emit(`mark-read-${noteUpdated?.sectionId}`, noteUpdated);
    return res.status(200).send(noteUpdated);
  } catch(err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const noteDeleted = await deleteNoteById(req.params.id);
    if (!noteDeleted) {
      res.status(500).json({ message: `Cannot delete resource`});
      return next(noteDeleted);
    }
    socket.emit(`delete-note-${noteDeleted?.sectionId}`, noteDeleted);
    return res.status(200).send(noteDeleted);
  } catch(err) {
    return res.status(500).send(err || err.message);
  }
}

export async function addReactionToNote(reactionId: string, noteId:string) : Promise<any> {
  try {
    if(!reactionId || !noteId){
      return;
    }
    const updated = await Note.findByIdAndUpdate(
      noteId,
      { $push: { reactions: reactionId }},
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch(err){
    throw `Error adding like ${err || err.message}`;
  }
}

export async function findNotesBySectionAndDelete(sectionId: string): Promise<any> {
  try {
    const notesList = await getNotesBySection(sectionId);
    if(!notesList?.length){
      return;
    }
    const deleted = notesList.reduce(async (promise: Promise<any>, note: {[Key: string]: any}) => {
      await promise;
      await findReactionsByNoteAndDelete(note._id)
      await deleteNoteById(note._id);
    }, [Promise.resolve()]);
    return deleted;
  } catch(err) {
    throw err || err.message;
  }
}

async function deleteNoteById(noteId: string):Promise<any> {
  try {
    if(!noteId){
      return;
    }
    return await Note.findByIdAndRemove(noteId);
  } catch(err) {
    throw `Error while deleting note ${err || err.message}`;
  }
}

async function getNotesBySection(sectionId: string):Promise<any> {
  try {
    if(!sectionId){
      return;
    }
    return await Note.find({ sectionId });
  } catch(err) {
    throw `Error while fetching notes ${err || err.message}`;
  }
}
