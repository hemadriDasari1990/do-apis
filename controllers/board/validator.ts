import { NextFunction, Request, Response } from "express";
import { check, param, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const updateBoardValidator = [
  /* Check Name */
  check("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name can't be more than 50 characters"),
  check("description").trim(),
  check("noOfSections")
    .isNumeric()
    .withMessage("No of sections should be a number")
    .isLength({ min: 1, max: 10 })
    .withMessage("No of sections must be between 1 and 10"),
  check("isAnonymous").custom((value) => {
    if (value == false && !check("teams").isArray()) {
      throw new Error("Team must be an array");
    }
    if (value == false && !check("teams")?.length) {
      throw new Error("Team is required");
    }

    return true;
  }),
  check("projectTitle").trim(),
  check("projectDescription").trim(),
  check("boardId").trim(),
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

export const createInstantBordValidator = [
  /* Check Name */
  check("name").trim(),
  check("description").trim(),
  check("noOfSections")
    .isNumeric()
    .withMessage("No of sections should be a number")
    .isLength({ min: 1, max: 10 })
    .withMessage("No of sections must be between 1 and 10"),
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

export const getBoardDetailsValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Board id is required"),
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

export const getBoardsByUserValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User id is required"),
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

export const deleteBoardValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Board id is required"),
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

export const downloadBoardReportValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Board id is required"),
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
