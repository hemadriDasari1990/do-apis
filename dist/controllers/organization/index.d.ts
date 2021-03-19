import { NextFunction, Request, Response } from "express";
export declare function createUser(req: Request, res: Response): Promise<any>;
export declare function confirmEmail(req: Request, res: Response): Promise<any>;
export declare function resendActivationLink(
  req: Request,
  res: Response
): Promise<any>;
export declare function getUserDetails(
  req: Request,
  res: Response
): Promise<any>;
export declare function getUserSummary(
  req: Request,
  res: Response
): Promise<any>;
export declare function getUsers(req: Request, res: Response): Promise<any>;
export declare function getAllSummary(
  req: Request,
  res: Response
): Promise<any>;
export declare function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any>;
export declare function getUserByEmail(email: string): Promise<any>;
export declare function addDepartmentToUser(
  departmentId: string,
  userId: string
): Promise<any>;
