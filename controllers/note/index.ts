import { NextFunction, Request, Response } from "express";
import {
  noteAddFields,
  reactionAgreeLookup,
  reactionDisAgreeLookup,
  reactionLookup,
  reactionLoveLookup
} from '../../util/noteFilters';

import Note from '../../models/note';
import { addNoteToSection } from "../section";
import { findReactionsByNoteAndDelete } from "../reaction";
import mongoose from 'mongoose';

export async function createNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const note = new Note(req.body);
    const noteCreated = await note.save();
    if(!noteCreated){
      return res.status(500).send("Resource creation is failed");
    }
    const added = await addNoteToSection(noteCreated._id, req.body.sectionId);
    if(!added){
      return next(added);
    }
    return res.status(200).send("Resource created Successfully");
  } catch(err) {
    throw new Error(err || err.message);
  }
};

export async function updateNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const update = {
      description: req.body.description,
      sectionId: req.body.sectionId
    };
    const options = { upsert: true, new: true };
    const updated = await Note.findByIdAndUpdate(req.body.noteId ? req.body.noteId: new mongoose.Types.ObjectId(), update, options);
    if(!updated){ return next(updated);}
    const added = await addNoteToSection(updated._id, req.body.sectionId);
    if(!added){
      return next(added);
    }
    return res.status(200).send(updated)
  } catch(err){
    return res.status(500).send(err || err.message);
  }
};

export async function getAllNotes(req: Request, res: Response): Promise<any> {
  try {
    console.log(req);
    const notes = await Note.find().sort({_id: 1}).limit(10).populate([
      {
        path: 'likes',
        model: 'Like'
      }
    ]);
    return res.status(200).json(notes);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function getNotesBySectionId(req: Request, res: Response): Promise<any> {
  try {
    const query = { sectionId: mongoose.Types.ObjectId(req.params.sectionId)};
    const notes = await Note.aggregate([
      { "$match": query },
      reactionLookup,
      reactionAgreeLookup,
      reactionDisAgreeLookup,
      reactionLoveLookup,
      noteAddFields
    ]);
    return res.status(200).json(notes);
  } catch(err){
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
