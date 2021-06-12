import { NextFunction, Request, Response } from "express";
import { check, param, validationResult } from "express-validator";

import { VALIDATION_FAILED } from "../../util/constants";

export const signupValidator = [
  /* Check Username */
  check("name")
    .notEmpty()
    .withMessage("Your Name is required")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3 })
    .withMessage("Name must have minimum length of 3")
    .trim()
    .escape(),
  /* Check Email */
  check("email", "Invalid Email Address")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail({ gmail_remove_dots: false }),
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
    .withMessage("Confirm password  Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Confirm password  Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "your confirm password  should have at least one sepcial character"
    )
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match");
      }
      return true;
    }),
  check("isAgreed")
    .notEmpty()
    .withMessage("isAgreed is required")
    .custom((value) => {
      if (typeof value != "boolean") {
        throw new Error("isAgreed must contain boolean value");
      }
      if (value != true) {
        throw new Error("You must agree to terms and conditions");
      }
      return true;
    }),
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

export const updateAvatarValidator = [
  check("avatarId")
    .notEmpty()
    .withMessage("Avatar id is required")
    .isInt()
    .withMessage("Avatar id must be a number"),
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

export const deleteUserValidator = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User id is required")
    .isString()
    .withMessage("User id must be string"),
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

export const updateEmailValidator = [
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
    .normalizeEmail({ gmail_remove_dots: false }),
  /* Check current Email */
  check("currentEmail")
    .notEmpty()
    .withMessage("Current Email is required")
    .isString()
    .withMessage("Current Email must be string")
    .isEmail()
    .withMessage("Invalid Current Email Address")
    .trim()
    .escape()
    .normalizeEmail({ gmail_remove_dots: false }),
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

export const updatePasswordValidator = [
  /* Check new Password */
  check("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isString()
    .withMessage("New password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("New Password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("New Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("New Password Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Your new password should have at least one sepcial character")
    .trim()
    .escape(),
  /* Check new confirm Password */
  check("newConfirmPassword")
    .notEmpty()
    .withMessage("New confirm password is required")
    .isString()
    .withMessage("New confirm password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("New confirm password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("New confirm password  Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("New confirm password  Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "your new confirm password  should have at least one sepcial character"
    )
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Your new password does not match");
      }
      return true;
    }),
  /* Check current Password */
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Confirm password must be string")
    .isLength({ min: 8, max: 15 })
    .withMessage("Current password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("Current password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Current password Must Contain an Uppercase Letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "your current password should have at least one sepcial character"
    )
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

export const updateNameValidator = [
  /* Check Username */
  check("name")
    .notEmpty()
    .withMessage("Your Name is required")
    .isString()
    .withMessage("Your name must be string")
    .isLength({ min: 3 })
    .withMessage("Name must have minimum length of 3")
    .trim()
    .escape(),
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
