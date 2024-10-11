import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  meUserDataService,
  registerService,
  loginService,
  refreshTokenService,
} from "../services/user.service";

import { CustomError } from "../utils/customError";
import { setTokenCookie } from "../utils/cookie";

export const me = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.user;
  const date = req.query.date;

  try {
    const userData = await meUserDataService(id, date as string[]);

    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, accessToken, refreshToken } = await registerService(
      username,
      password
    );

    setTokenCookie(res, refreshToken);

    return res.status(200).json({ userId, accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, accessToken, refreshToken } = await loginService(
      username,
      password
    );

    setTokenCookie(res, refreshToken);

    return res.status(200).json({ userId, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.token;

    if (!refreshToken) {
      return next(new CustomError("Invalid refresh token", 403));
    }

    const refreshUserData = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    const { userId, newAccessToken, newRefreshToken } =
      await refreshTokenService(refreshUserData);

    setTokenCookie(res, newRefreshToken);

    return res.status(200).json({ userId, accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new CustomError("Refresh token has expired", 403));
    }
    return next(new CustomError("Failed to refresh token", 403));
  }
};

export const logout = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json("Logged out successfully");
  } catch (error) {
    return next(error);
  }
};
