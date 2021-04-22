import { Request, Response } from "express";
export declare function createActivity(payload: {
    [Key: string]: any;
}): Promise<any>;
export declare function getActivities(req: Request, res: Response): Promise<any>;
