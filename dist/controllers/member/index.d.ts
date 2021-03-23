import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
export declare function updateMember(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function createMember(payload: {
    [Key: string]: any;
}): Promise<mongoose.Document<any>>;
export declare function getMemberDetails(req: Request, res: Response): Promise<any>;
export declare function getMembersByUser(req: Request, res: Response): Promise<any>;
export declare function getMember(query: {
    [Key: string]: any;
}): Promise<any>;
export declare function deleteMember(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function findMembersByTeamAndDelete(teamId: string): Promise<any>;
export declare function addTeamMemberToMember(teamMemberId: string, memberId: string): Promise<any>;
export declare function removeTeamFromMember(memberId: string, teamId: string): Promise<void>;
export declare function sendInvitationsToMembers(memberIds: Array<string>, sender: {
    [Key: string]: any;
}, boardId: string): Promise<void | Error>;
export declare function sendInviteToMember(board: {
    [Key: string]: any;
}, sender: {
    [Key: string]: any;
}, receiver: {
    [Key: string]: any;
}): Promise<void>;
