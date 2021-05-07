import { NextFunction, Request, Response } from "express";
import { check, param, query, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const updateTeamValidator = [
  /* Check name */
  check("name")
    .notEmpty()
    .withMessage("Team name is required")
    .isString()
    .withMessage("Team name must be string")
    .isLength({ min: 3 })
    .withMessage("Team name must have minimum length of 3")
    .trim()
    .escape(),
  check("description")
    .trim()
    .escape(),
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

export const getTeamsByUserValidator = [
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

export const deleteTeamValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Project id is required")
    .isString()
    .withMessage("Project id must be string")
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

export const addOrRemoveMemberFromTeamValidator = [
  check("teamId")
    .notEmpty()
    .withMessage("Team id is required")
    .isString()
    .withMessage("Team id must be string")
    .trim()
    .escape(),
  check("memberId")
    .notEmpty()
    .withMessage("Member id is required")
    .isString()
    .withMessage("Member id must be string")
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

export const sendInvitationToTeamsValidator = [
  check("boardId")
    .notEmpty()
    .withMessage("Board id is required")
    .isString()
    .withMessage("Board id must be string")
    .trim()
    .escape(),
  check("teamIds")
    .not()
    .isEmpty()
    .withMessage("Team ids should be in an array"),
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

export const getTeamsByMemberValidator = [
  param("memberId")
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
