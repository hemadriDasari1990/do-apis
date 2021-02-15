import { NextFunction, Request, Response } from "express";
export declare function updateNote(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getNotesBySectionId(req: Request, res: Response): Promise<any>;
export declare function deleteNote(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addReactionToNote(reactionId: string, noteId: string): Promise<any>;
export declare function findNotesBySectionAndDelete(sectionId: string): Promise<any>;
