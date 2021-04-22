import { Request, Response } from "express";
import mongoose from "mongoose";
export declare function getInvitedMembers(req: Request, res: Response): Promise<any>;
export declare function createInvitedTeams(teams: Array<string>, boardId: mongoose.Schema.Types.ObjectId): Promise<any>;
