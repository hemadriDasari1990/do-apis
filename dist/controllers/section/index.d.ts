import { Request, Response } from "express";
import mongoose from "mongoose";
export declare function saveSection(input: any): Promise<mongoose.Document<any> | undefined>;
export declare function updateSection(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getSection(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function getSectionsByBoardId(req: Request, res: Response): Promise<any>;
export declare function addAndRemoveNoteFromSection(data: {
    [Key: string]: any;
}): Promise<any>;
export declare function deleteSection(sectionId: string, userId: string, boardId: string): Promise<any>;
export declare function removeNoteFromSection(noteId: string, sectionId: string): Promise<any>;
export declare function findSectionsByBoardAndDelete(boardId: string): Promise<any>;
export declare function addNoteToSection(noteId: string, sectionId: string): Promise<any>;
