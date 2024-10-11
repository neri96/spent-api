import { Schema, model, Document, Types } from "mongoose";

import { modelTransform } from "../plugins/modelTransform";

export interface IBudget extends Document {
  user: Types.ObjectId;
  category: string;
  limit: number;
  startDate: Date;
  endDate: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: false }
);

budgetSchema.plugin(modelTransform);

export const Budget = model<IBudget>("Budget", budgetSchema);
