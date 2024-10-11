import { Response } from "express";

export const setTokenCookie = (
  res: Response,
  token: string,
  cookieName: string = "token",
  maxAge: number = 24 * 60 * 60 * 1000
) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
};
