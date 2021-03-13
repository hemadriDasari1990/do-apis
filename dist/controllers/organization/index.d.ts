import { NextFunction, Request, Response } from "express";
export declare function createOrganization(req: Request, res: Response): Promise<any>;
export declare function confirmEmail(req: Request, res: Response): Promise<any>;
export declare function resendActivationLink(req: Request, res: Response): Promise<any>;
export declare function getOrganizationDetails(req: Request, res: Response): Promise<any>;
export declare function getOrganizationSummary(req: Request, res: Response): Promise<any>;
export declare function deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function getOrganizationByEmail(email: string): Promise<any>;
export declare function addDepartmentToOrganization(departmentId: string, organizationId: string): Promise<any>;
