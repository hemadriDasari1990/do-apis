import { Request, Response } from "express";
export declare function updateActionItem(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getActionItemsByActionId(req: Request, res: Response): Promise<any>;
export declare function deleteActionItem(id: string, actionId: string): Promise<any>;
export declare function updateActionItemActionId(actionItemId: string, actionId: string): Promise<any>;
export declare function findActionItemsByActionAndDelete(sectionId: string): Promise<any>;
export declare function getActionItem(query: {
    [Key: string]: any;
}): Promise<any>;
