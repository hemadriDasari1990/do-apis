import { NextFunction, Request, Response } from "express";
export declare function addSectionToBoard(sectionId: string, boardId: string): Promise<any>;
export declare function updateBoard(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function startOrCompleteBoard(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getBoardDetailsLocal(boardId: string): Promise<any>;
export declare function getBoardDetails(req: Request, res: Response): Promise<any>;
export declare function getBoards(req: Request, res: Response): Promise<any>;
export declare function deleteBoard(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getBoard(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function findBoardsByProjectAndDelete(projectId: string): Promise<any>;
export declare function addTeamsToBoad(teams: Array<string>, boardId: string): Promise<any>;
export declare function changeVisibility(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function inviteMemberToBoard(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function downloadBoardReport(req: Request, res: Response): Promise<any>;
