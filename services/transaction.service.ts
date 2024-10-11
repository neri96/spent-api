import { startSession } from "mongoose";

import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

import { getLocalDate } from "../utils/date";
import { CustomError } from "../utils/customError";

import { TransactionType, CategoryType } from "../ts/types";

interface ITransactionData {
  id?: string;
  title: string;
  transactionType: TransactionType;
  amount: number;
  category: CategoryType;
  description?: string;
  investmentReturn?: number;
  date: Date;
  user: string;
}

export const getTransactionService = async (
  userId: string,
  { page = 1, searchQuery = "", transactionType, category, date }
) => {
  const limit = 10;
  const startIndex = (page - 1) * limit;

  const options: Partial<Record<keyof ITransactionData, unknown>> = {
    user: userId,
    date: {
      $gte: getLocalDate(+date[0]),
      $lte: getLocalDate(+date[1]),
    },
  };

  if (transactionType !== "All") {
    options.transactionType = { $in: transactionType };
  }

  if (category !== "All") {
    options.category = { $in: category };
  }

  if (searchQuery) {
    options.title = { $regex: searchQuery, $options: "i" };
  }

  const transactions = await Transaction.find(options)
    .skip(startIndex)
    .limit(limit);

  const totalTransactions = await Transaction.countDocuments();

  return {
    transactions,
    hasNextPage: startIndex + transactions.length < totalTransactions,
  };
};

export const getOneTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  return transaction;
};

export const createTransactionService = async (
  userId: string,
  transactionData: ITransactionData
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new CustomError("User doesn't exist", 404);
    }

    let nowDate: Date;

    if (!transactionData.date) {
      nowDate = new Date();
      nowDate.setMinutes(nowDate.getMinutes() - nowDate.getTimezoneOffset());
    } else {
      nowDate = transactionData.date;
    }

    const newTransaction = new Transaction({
      ...transactionData,
      date: nowDate,
      user: user._id,
    });

    await newTransaction.save({ session });

    await User.updateOne(
      { _id: user._id },
      { $push: { transactions: newTransaction._id } },
      { session }
    );

    await session.commitTransaction();

    return newTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTransactionService = async (
  userId: string,
  transactionData: ITransactionData
) => {
  const session = await startSession();

  const { id: transactionId, ...updatedTransactionData } = transactionData;

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new CustomError("User doesn't exist", 404);
    }

    if (!updatedTransactionData.date) {
      delete updatedTransactionData["date" as keyof ITransactionData];
    }

    updatedTransactionData.amount = +updatedTransactionData.amount;

    const updateTransaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        user: user._id,
      },
      updatedTransactionData,
      { new: true, session }
    );

    if (!updateTransaction) {
      throw new CustomError("Transaction doesn't exist", 404);
    }

    await session.commitTransaction();

    return updateTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new CustomError("User doesn't exist", 404);
    }

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: user._id,
    });

    if (!deletedTransaction) {
      throw new CustomError("Transaction doesn't exist", 404);
    }

    await session.commitTransaction();

    return deletedTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
