import { NextFunction, Request, Response } from "express";
import { check, param, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const updateBoardValidator = [
  /* Check Name */
  check("name")
    .trim()
    .escape(),
  check("description")
    .trim()
    .escape(),
  // check("projectId")
  //   .notEmpty()
  //   .withMessage("Project id is required")
  //   .trim(),
  check("noOfSections")
    .isNumeric()
    .withMessage("No of sections should be a number")
    .isLength({ min: 1, max: 10 })
    .withMessage("No of sections must be between 1 and 10"),
  // check("isDefaultBoard").custom((value) => {
  //   if (typeof value != "boolean") {
  //     throw new Error("Default board flag must be a boolean value");
  //   }
  //   return true;
  // }),
  check("teams")
    .not()
    .isEmpty()
    .withMessage("Team is required"),
  check("projectTitle")
    .trim()
    .escape(),
  check("projectDescription")
    .trim()
    .escape(),
  check("boardId")
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
