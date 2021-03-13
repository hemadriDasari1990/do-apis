import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
export declare function createSection(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function saveSection(input: any): Promise<mongoose.Document<any> | undefined>;
export declare function updateSection(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getSectionsByBoardId(req: Request, res: Response): Promise<any>;
export declare function deleteSection(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addNoteToSection(noteId: string, sectionId: string): Promise<any>;
