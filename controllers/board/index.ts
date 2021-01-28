import { NextFunction, Request, Response } from "express";
import {
  boardAddFields,
  sectionsLookup
} from '../../util/boardFilters';

import Board from '../../models/board';
import mongoose from 'mongoose';
import { saveSection } from '../section';

export async function createBoard(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const board = new Board({
      title: req.body.title,
      description: req.body.description,
      sprint: req.body.sprint,
      duration: req.body.duration
    });
    const created = await board.save();
    if(!created) { 
      return next(created); 
    }
    await Array(parseInt(req.body.noOfSections)).fill(0).reduce(async (promise) => {
      await promise;
      const section = await saveSection({
        boardId: created._id,
        title: "Section Title"
      });
      await addSectionToBoard(section?._id, created._id);
    }, Promise.resolve());
    return res.status(200).send(created);
  } catch(err) {
    throw new Error(err || err.message);
  }
};

export async function addSectionToBoard(sectionId: string, boardId: string): Promise<any> {
  try {
    if(!boardId || !sectionId){
      return;
    }
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { sections: sectionId }},
      { new: true, useFindAndModify: false }
    );
    return board;
  } catch(err){
    throw 'Cannot add section to Board';
  }
}

export async function updateBoard(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const update = {
          title: req.body.title,
          description: req.body.description
        };
        const updated = await Board.findByIdAndUpdate(req.params.id, update)
        if(!updated) { 
          return next(updated); 
        }
        return res.status(200).send("Updated board successfully");
    } catch(err){
        return res.status(500).send(err || err.message);
    }
};

export async function getAllBoards(req: Request, res: Response): Promise<any> {
  try {
    console.log(req);
    const boards = await Board.find().sort({_id: -1}).limit(25).populate([
      {
        path: 'sections',
        model: 'Section'
      }
    ]);
    return res.status(200).json(boards);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function getBoardDetails(req: Request, res: Response): Promise<any> {
  try {
    const query = {_id: mongoose.Types.ObjectId(req.params.id)};
    const boards = await Board.aggregate([
      { "$match": query },
      sectionsLookup,
      boardAddFields
    ]);
    return res.status(200).json(boards ? boards[0]: null);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function deleteBoard(req: Request, res: Response, next: NextFunction): Promise<any> {
  try{
    const deleted = await Board.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource`});
      return next(deleted);
    }
    return res.status(200).json({message: "Resource has been deleted successfully"});
  } catch(err) {
    return res.status(500).send(err || err.message);
  }
}
