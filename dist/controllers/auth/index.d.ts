import { NextFunction, Request, Response } from "express";
export declare function authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function login(req: Request, res: Response): Promise<any>;
export declare function refreshToken(req: Request, res: Response): Promise<any>;
export declare function logout(req: Request, res: Response): Promise<any>;
export declare function generateToken(payload: {
    [Key: string]: any;
}): Promise<string>;
export declare function refreshAccessToken(payload: {
    [Key: string]: any;
}): Promise<string>;
