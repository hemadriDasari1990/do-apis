import { Request, Response } from "express";
export declare function createOrUpdateReaction(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function findReactionsByNoteAndDelete(noteId: string): Promise<any>;
export declare function getReactions(req: Request, res: Response): Promise<any>;
export declare function getReaction(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function getReactionSummaryByBoard(req: Request, res: Response): Promise<any>;
export declare function getReactionSummaryBySection(req: Request, res: Response): Promise<any>;
export declare function getReactionSummaryByNote(req: Request, res: Response): Promise<any>;
