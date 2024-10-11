import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

export const errorHandler = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
