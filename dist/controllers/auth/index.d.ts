import { NextFunction, Request, Response } from "express";
/**
 * Validate the token
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<any>;
/**
 * Login user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function login(req: Request, res: Response): Promise<any>;
/**
 * Refresh token for user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function refreshToken(req: Request, res: Response): Promise<any>;
/**
 * Innvalidate the session and logout user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function logout(req: Request, res: Response): Promise<any>;
/**
 * Generate forgot password token and send an email notification to reset
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function forgotPassword(req: Request, res: Response): Promise<any>;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function validateForgotPasswordToken(req: Request, res: Response): Promise<any>;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function verifyAccount(req: Request, res: Response): Promise<any>;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function resendToken(req: Request, res: Response): Promise<any>;
/**
 * Reset new Password
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export declare function resetPassword(req: Request, res: Response): Promise<any>;
/**
 * Generate New Token
 *
 * @param {Object} payload
 * @returns {String}
 */
export declare function generateToken(payload: {
    [Key: string]: any;
}): Promise<string>;
/**
 * Generate refresh token
 *
 * @param {Object} payload
 * @returns {String}
 */
export declare function refreshAccessToken(payload: {
    [Key: string]: any;
}): Promise<string>;
