import { NextFunction, Request, Response } from "express";

import Like from '../../models/like';
import { addLikeToNote } from "../note";

export async function createLike(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const like = new Like(req.body);
    const likeCreated = await like.save();
    if(!likeCreated){
      return res.status(500).send("Resource creation is failed");
    }
    const added = await addLikeToNote(likeCreated._id, req.body.noteId);
    if(!added){
      return next(added);
    }
    return res.status(200).send("Resource created Successfully");
  } catch(err) {
    throw new Error(err || err.message);
  }
};