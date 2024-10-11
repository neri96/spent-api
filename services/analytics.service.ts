import { ITransaction, Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

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
}

export const getAnalyticsService = async (userId: string) => {
  const user = await User.findById(userId).select("budget points");

  if (!user) {
    throw new CustomError("User doesn't exist", 404);
  }

  const groupedData = await Transaction.aggregate([
    {
      $group: {
        _id: {
          transactionType: "$transactionType",
          category: "$category",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.transactionType",
        categories: {
          $push: {
            category: "$_id.category",
            totalAmount: "$totalAmount",
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        transactionType: "$_id",
        categories: 1,
      },
    },
  ]);

  return groupedData;
};
