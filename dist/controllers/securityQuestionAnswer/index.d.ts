import { Request, Response } from "express";
export declare function createSecurityQuestionAnswer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function verifySecurityQuestionAnswer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
