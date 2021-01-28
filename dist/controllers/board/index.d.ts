import { NextFunction, Request, Response } from "express";
export declare function createBoard(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function addSectionToBoard(sectionId: string, boardId: string): Promise<any>;
export declare function updateBoard(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getAllBoards(req: Request, res: Response): Promise<any>;
export declare function getBoardDetails(req: Request, res: Response): Promise<any>;
export declare function deleteBoard(req: Request, res: Response, next: NextFunction): Promise<any>;
