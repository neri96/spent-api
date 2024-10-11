import mongoose from "mongoose";

import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

import { getLocalDate } from "../utils/date";
import { CustomError } from "../utils/customError";

import { generateToken, TokenType } from "../utils/jwt";

export const meUserDataService = async (userId: string, date: string[]) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User doesn't exist", 404);
  }

  const total = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: getLocalDate(+date[0]), $lte: getLocalDate(+date[1]) },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $cond: [
              { $eq: ["$transactionType", "Income"] },
              "$amount",
              {
                $cond: [
                  { $eq: ["$transactionType", "Expense"] },
                  { $multiply: ["$amount", -1] },
                  {
                    $cond: [
                      { $eq: ["$transactionType", "Investment"] },
                      {
                        $add: [
                          { $multiply: ["$amount", -1] },
                          { $ifNull: ["$investmentReturn", 0] },
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
            ],
          },
        },
        expenses: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ["$transactionType", "Expense"] },
                  { $eq: ["$transactionType", "Investment"] },
                ],
              },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
        expenses: 1,
      },
    },
  ]);

  return {
    username: user.username,
    budget: user.budget,
    points: user.points,
    balance: total.length ? total[0].totalAmount : 0,
    expenses: total.length ? total[0].expenses : 0,
  };
};

export const registerService = async (
  username: string,
  password: string
): Promise<{ userId: string; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ username });

  if (user) {
    throw new CustomError("User already exists", 409);
  }

  const passHashed = await bcrypt.hash(password, 10);

  const newUser = await new User({ username, password: passHashed }).save();

  const accessToken = generateToken(
    { id: newUser.id, username },
    "15m",
    TokenType.Access
  );
  const refreshToken = generateToken(
    { id: newUser.id, username },
    "7d",
    TokenType.Refresh
  );

  return { userId: newUser.id, accessToken, refreshToken };
};

export const loginService = async (
  username: string,
  password: string
): Promise<{ userId: string; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    throw new CustomError("Invalid credentials", 400);
  }

  const accessToken = generateToken(
    { id: user.id, username },
    "15m",
    TokenType.Access
  );
  const refreshToken = generateToken(
    { id: user.id, username },
    "7d",
    TokenType.Refresh
  );

  return { userId: user.id, accessToken, refreshToken };
};

export const refreshTokenService = async (
  refreshUserData: JwtPayload
): Promise<{
  userId: string;
  newAccessToken: string;
  newRefreshToken: string;
}> => {
  const user = await User.findOne({ _id: refreshUserData.id }).select(
    "-password"
  );

  if (!user) {
    throw new CustomError("User doesn't exist", 400);
  }

  const { id, username } = user;

  const newAccessToken = generateToken(
    { id, username },
    "15m",
    TokenType.Access
  );
  const newRefreshToken = generateToken(
    { id, username },
    "7d",
    TokenType.Refresh
  );

  return { userId: user.id, newAccessToken, newRefreshToken };
};
