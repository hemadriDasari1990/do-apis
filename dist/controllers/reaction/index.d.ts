import { NextFunction, Request, Response } from "express";
export declare function createOrUpdateReaction(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function findReactionsByNoteAndDelete(noteId: string): Promise<any>;
