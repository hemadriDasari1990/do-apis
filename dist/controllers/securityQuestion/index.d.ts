import { Request, Response } from "express";
export declare function createSecurityQuestion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getSecurityQuestions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
