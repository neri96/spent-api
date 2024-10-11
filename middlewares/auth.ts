import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { CustomError } from "../utils/customError";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers["authorization"] as string;

    const token = header.split(" ")[1];

    if (!token) {
      return next(new CustomError("Invalid token", 403));
    }

    const userData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    res.locals.user = userData;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new CustomError("Token has expired", 403));
    } else if (error.name === "JsonWebTokenError") {
      return next(new CustomError("Invalid token", 403));
    } else {
      return next(new CustomError("Authentication failed", 403));
    }
  }
};
