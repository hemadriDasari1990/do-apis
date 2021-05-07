import { NextFunction, Request, Response } from "express";
import { check, param, query, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const updateMemberValidator = [
  /* Check name */
  check("name")
    .notEmpty()
    .withMessage(" Name is required")
    .isString()
    .withMessage(" Name must be string")
    .isLength({ min: 3 })
    .withMessage(" Name must have minimum length of 3")
    .trim()
    .escape(),
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
  check("status")
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

export const getMemberDetailsValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Member id is required")
    .isString()
    .withMessage("Member id must be string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(""),
      });
    } else {
      next();
    }
  },
];

export const getMembersByUserValidator = [
  query("userId")
    .exists()
    .notEmpty()
    .withMessage("User id is required")
    .isString()
    .withMessage("User id must be string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(""),
      });
    } else {
      next();
    }
  },
];

export const getMembersByTeamValidator = [
  query("teamId")
    .exists()
    .notEmpty()
    .withMessage("Team id is required")
    .isString()
    .withMessage("Team id must be string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(""),
      });
    } else {
      next();
    }
  },
];

export const deleteMemberValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Member id is required")
    .isString()
    .withMessage("Member id must be string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({
        errorId: VALIDATION_FAILED,
        message: error.array().join(""),
      });
    } else {
      next();
    }
  },
];
