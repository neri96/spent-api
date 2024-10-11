import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";

import { getAnalyticsService } from "../services/analytics.service";

export const get = async (_req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.user;

  try {
    const groupedData = await getAnalyticsService(id);

    const analytics = groupedData.map((analyticsElement) => ({
      id: new mongoose.Types.ObjectId(),
      ...analyticsElement,
    }));

    return res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};
