import { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import {
  getTransactionService,
  getOneTransactionService,
  createTransactionService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transaction.service";

import { AllorStringArray } from "../ts/types";

interface FilterOptions {
  transactionType: AllorStringArray;
  category: AllorStringArray;
  date: string;
}

interface QueryParams extends FilterOptions {
  page?: number;
  searchQuery?: string;
}

export const get = async (
  req: Request<{}, {}, {}, any>,
  res: Response,
  next: NextFunction
) => {
  const { id } = res.locals.user;
  const queryData: QueryParams = req.query;

  try {
    const transactions = await getTransactionService(id, queryData);

    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request<{}, {}, {}, any>,
  res: Response,
  next: NextFunction
) => {
  const { id } = res.locals.user;
  const { transactionId }: { transactionId: string } = req.query;

  try {
    const transaction = await getOneTransactionService(id, transactionId);

    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = res.locals.user;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await createTransactionService(id, req.body);

    return res
      .status(201)
      .json("New transaction has been successfully created");
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = res.locals.user;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await updateTransactionService(userId, req.body);

    return res
      .status(200)
      .json("The transaction has been successfully updated");
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = res.locals.user;
  const transactionId = req.body.transactionId;

  try {
    await deleteTransactionService(userId, transactionId);

    return res
      .status(200)
      .json("The transaction has been successfully deleted");
  } catch (error) {
    next(error);
  }
};
