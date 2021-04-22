import { Request, Response } from "express";
import mongoose from "mongoose";
export declare function saveSection(input: any): Promise<mongoose.Document<any> | undefined>;
export declare function updateAction(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getAction(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function getActionByBoardId(req: Request, res: Response): Promise<any>;
export declare function deleteAction(actionId: string): Promise<any>;
export declare function removeActionItemFromAction(actionItemId: string, actionId: string): Promise<any>;
export declare function findActionsByBoardAndDelete(boardId: string): Promise<any>;
export declare function addActionItemToAction(actionItemId: string, actionId: string): Promise<any>;
