import { NextFunction, Request, Response } from "express";
export declare function updateProject(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getProjects(req: Request, res: Response): Promise<any>;
export declare function createProject(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function deleteProject(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addBoardToProject(boardId: string, projectId: string): Promise<any>;
export declare function findProjectsByUserAndDelete(userId: string): Promise<any>;
export declare function getProjectsByUser(userId: string): Promise<any>;
