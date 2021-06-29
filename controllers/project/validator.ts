import { NextFunction, Request, Response } from "express";
import { check, param, query, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const updateProjectValidator = [
  /* Check Name */
  check("name")
    .notEmpty()
    .withMessage("Project name is required")
    .isString()
    .withMessage("Project name must be string")
    .isLength({ min: 3 })
    .withMessage("Project name must have minimum length of 3")
    .trim()
    .escape(),
  check("description").trim(),
  check("status").trim(),
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

export const getProjectsValidator = [
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

export const deleteProjectValidator = [
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
