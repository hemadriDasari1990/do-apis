import { NextFunction, Request, Response } from "express";
import {
  noteAddFields,
  notesLookup
} from '../../util/noteFilters';

import Note from '../../models/note';
import { addNoteToSection } from "../section";
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
    };
    await Note.findByIdAndUpdate(req.params.id, update, (err: any) => {
      if(err){ return next(err);}
      return res.status(200).send("Resource updated Successfully")
    });
  } catch(err){
    return res.status(500).send(err || err.message);
  }
};

export async function getAllNotes(req: Request, res: Response): Promise<any> {
  try {
    const notes = await Note.find().sort({_id: -1}).limit(10).populate([
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
      notesLookup,
      noteAddFields
    ]);
    return res.status(200).json(notes);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction): Promise<any> {
  try{
    await Note.findByIdAndRemove(req.params.id, (err: any) => {
      if (err) {
        res.status(500).json({ message: `Cannot delete resource ${err || err.message}`});
        return next(err);
      }
      return res.status(200).json({message: "Resource has been deleted successfully"});
    });
  } catch(err) {
    return res.status(500).send(err || err.message);
  }
}

export async function addLikeToNote(likeId: string, noteId:string) : Promise<any> {
  try {
    if(!likeId || !noteId){
      return;
    }
    const updated = await Note.findByIdAndUpdate(
      noteId,
      { $push: { likes: likeId }},
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch(err){
    throw `Error adding like ${err || err.message}`;
  }
}
