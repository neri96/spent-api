import { check } from "express-validator";

const usernameValidation = check("username")
  .trim()
  .escape()
  .notEmpty()
  .withMessage("Username is required")
  .isLength({ min: 2, max: 15 })
  .withMessage("Username must be between 2 and 15 characters long");

const passwordValidation = check("password")
  .trim()
  .escape()
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6, max: 30 })
  .withMessage("Password must be between 6 and 30 characters long");

export const loginValidator = [usernameValidation, passwordValidation];

export const registerValidator = [
  usernameValidation,
  passwordValidation,
  check("confirmPassword")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Passwords don't match")
    .isLength({ min: 6, max: 30 })
    .withMessage("Passwords don't match")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }

      return true;
    }),
];
