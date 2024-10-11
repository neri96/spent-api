import { check, body } from "express-validator";

import {
  TransactionType,
  IncomeType,
  ExpenseType,
  InvestmentType,
} from "../../ts/types";

const stringValidation = (fieldName: string, minLength = 0, maxLength = 0) => {
  const validation = check(fieldName).trim().escape();

  if (minLength > 0 || maxLength > 0) {
    return validation
      .isLength({ min: minLength, max: maxLength })
      .withMessage(
        `${fieldName} must be between ${minLength} and ${maxLength} characters long`
      );
  }

  return validation;
};

const conditionalEnumValidation = (
  fieldName: string,
  enumMap: Record<string, any>
) =>
  body(fieldName)
    .custom((value, { req }) => {
      const transactionType = req.body.transactionType as keyof typeof enumMap;
      const enumValues = enumMap[transactionType];

      if (enumValues && enumValues.includes(value)) {
        return true;
      } else {
        throw new Error("Invalid value");
      }
    })
    .withMessage(`Invalid ${fieldName}`);

const enumMap = {
  [TransactionType.Income]: Object.values(IncomeType),
  [TransactionType.Expense]: Object.values(ExpenseType),
  [TransactionType.Investment]: Object.values(InvestmentType),
};

const titleValidation = stringValidation("title", 3, 150)
  .notEmpty()
  .withMessage(`Title is required`);

const transactionTypeValidation = check("transactionType")
  .trim()
  .escape()
  .notEmpty()
  .withMessage("Transaction Type is required")
  .isIn(Object.values(TransactionType))
  .withMessage("Invalid value");

const categoryValidation = conditionalEnumValidation("category", enumMap);

const amountValidation = check("amount")
  .notEmpty()
  .escape()
  .withMessage("Amount is required")
  .isFloat({ min: 0.01 })
  .withMessage("Amount must be at least 0.1");

const descrValidation = stringValidation("description");

export const createTransactionValidator = [
  titleValidation,
  transactionTypeValidation,
  categoryValidation,
  amountValidation,
  descrValidation,
];

export const updateransactionValidator = [
  titleValidation,
  amountValidation,
  descrValidation,
];
