import { Request, Response } from "express";
export declare function updateNote(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getNotesBySectionId(req: Request, res: Response): Promise<any>;
export declare function markNoteRead(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function deleteNote(id: string, userId: string): Promise<any>;
export declare function createNoteActivity(notedId: string, action: string, userId?: string): Promise<any>;
export declare function addReactionToNote(reactionId: string, noteId: string): Promise<any>;
export declare function removeReactionFromNote(reactionId: string, noteId: string): Promise<void>;
export declare function findNotesBySectionAndDelete(sectionId: string): Promise<any>;
export declare function getNote(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function updateNotePosition(payload: {
    [Key: string]: any;
}): Promise<any>;
