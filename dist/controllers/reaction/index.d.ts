import { Request, Response } from "express";
export declare function createOrUpdateReaction(req: Request, res: Response): Promise<any>;
export declare function findReactionsByNoteAndDelete(noteId: string): Promise<any>;
export declare function getReaction(query: {
    [Key: string]: any;
}): Promise<any>;
