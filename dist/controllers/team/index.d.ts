import { NextFunction, Request, Response } from "express";
export declare function updateTeam(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getTeams(req: Request, res: Response): Promise<any>;
export declare function deleteTeam(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addOrRemoveMemberFromTeam(req: Request, res: Response): Promise<any>;
export declare function addTeamMemberToTeam(teamMemberId: string, teamId: string): Promise<any>;
export declare function removeMemberFromTeam(memberId: string, teamId: string): Promise<void>;
export declare function sendInvitationToTeams(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
