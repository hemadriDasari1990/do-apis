import { NextFunction, Request, Response } from "express";
export declare function updateProject(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getProjectDetails(req: Request, res: Response): Promise<any>;
export declare function deleteProject(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addBoardToProject(boardId: string, projectId: string): Promise<any>;
export declare function findProjectsByDepartmentAndDelete(departmentId: string): Promise<any>;
