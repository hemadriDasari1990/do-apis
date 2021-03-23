import { NextFunction, Request, Response } from "express";
export declare function updateDepartment(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getDepartmentDetails(req: Request, res: Response): Promise<any>;
export declare function getDepartments(userId: string): Promise<any>;
export declare function deleteDepartment(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addProjectToDepartment(projectId: string, departmentId: string): Promise<any>;
