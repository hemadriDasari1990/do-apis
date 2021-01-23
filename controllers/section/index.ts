import { NextFunction, Request, Response } from "express";
import {
  sectionAddFields,
  sectionsLookup
} from '../../util/sectionFilters';

import Section from '../../models/section';
import mongoose from 'mongoose';

export async function createSection(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const created = await saveSection(req.body);
    if (!created) { return next(created); }
    return res.status(200).send("Title created Successfully");
  } catch(err) {
    throw new Error(err || err.message);
  }
};

export async function saveSection(input: any) {
  try {
    if(!input){
      return;
    }
    const section = new Section(input);
    return await section.save();
  } catch(err){
    throw err;
  }
}

export async function updateSection(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const update = {
              title: req.body.title,
            };
        await Section.findByIdAndUpdate(req.params.id, update, async (err: any) => {
            if(err) { 
            return next(err); 
            }
            return res.status(200).send("Title updated successfully");
        });
    } catch(err){
        return res.status(500).send(err || err.message);
    }
};

export async function getAllSections(req: Request, res: Response): Promise<any> {
  try {
    const sections = await Section.find().sort({_id: -1}).limit(25).populate([
      {
        path: 'notes',
        model: 'Note'
      }
    ]);
    return res.status(200).json(sections);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function getSectionsByBoardId(req: Request, res: Response): Promise<any> {
  try {
    const query = { boardId: mongoose.Types.ObjectId(req.params.boardId) };
    const sections = await Section.aggregate([
      { "$match": query },
      sectionsLookup,
      sectionAddFields
    ]);
    return res.status(200).json(sections);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function deleteSection(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    await Section.findByIdAndRemove(req.params.id, (err: any) => {
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

export async function addNoteToSection(noteId: string, sectionId: string) : Promise<any> {
  try {
    if(!noteId || !sectionId){
      return;
    }
    const updated = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { notes: noteId }},
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch(err){
    throw `Error while adding note to section ${err || err.message}`;
  }
}
