import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const loginValidator = [
  /* Check Email */
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .withMessage("Invalid Email Address")
    .trim()
    .escape()
    .normalizeEmail(),
  /* Check Password */
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("Password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("your password should have at least one sepcial character")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const refreshTokenValidator = [
  /* Check refresh token */
  check("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isString()
    .withMessage("Refresh token must be string")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const forgotPasswordValidator = [
  /* Check refresh token */
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .withMessage("Invalid Email Address")
    .trim()
    .escape()
    .normalizeEmail(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const validateForgotPasswordValidator = [
  /* Check refresh token */
  check("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be string")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const verifyAccountValidator = [
  /* Check refresh token */
  check("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be string")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const resendTokenValidator = [
  /* Check refresh token */
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .withMessage("Invalid Email Address")
    .trim()
    .escape()
    .normalizeEmail(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];

export const resetPasswordValidator = [
  /* Check Password */
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("Password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("your password should have at least one sepcial character")
    .trim()
    .escape(),
  /* Check confirm password */
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isString()
    .withMessage("Confirm password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("Confirm password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("Confirm password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Confirm password Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "your confirm password should have at least one sepcial character"
    )
    .trim()
    .escape(),
  check("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("User id must be string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(", \n"),
      });
    } else {
      next();
    }
  },
];
