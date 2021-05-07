import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const createFeedbackValidator = [
  /* Check Title */
  check("title")
    .trim()
    .escape(),
  check("description")
    .trim()
    .escape(),
  check("rating")
    .isNumeric()
    .withMessage("rating should be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("Rating must be between 0 to 5"),
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
