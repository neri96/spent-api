import { Schema, model, Document, Types } from "mongoose";

import { modelTransform } from "../plugins/modelTransform";

import {
  TransactionType,
  IncomeType,
  ExpenseType,
  InvestmentType,
} from "../ts/types";

export interface ITransaction extends Document {
  title: string;
  user: Types.ObjectId;
  transactionType: TransactionType;
  category: IncomeType | ExpenseType | InvestmentType;
  amount: number;
  description?: string;
  investmentReturn?: number;
  date: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
    },
    description: { type: String },
    investmentReturn: { type: Number, required: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

transactionSchema.plugin(modelTransform);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
