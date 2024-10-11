import { Schema, model, Document, Types } from "mongoose";

import { modelTransform } from "../plugins/modelTransform";

export interface IUser extends Document {
  username: string;
  password: string;
  transactions: Types.ObjectId[];
  budget: number;
  points: number;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    budget: { type: Number, required: true, default: 5000 },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

userSchema.plugin(modelTransform);

export const User = model<IUser>("User", userSchema);
