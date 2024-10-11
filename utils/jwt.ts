import jwt from "jsonwebtoken";

export enum TokenType {
  Access,
  Refresh,
}

interface IUserData {
  [key: string]: string;
}

export const generateToken = (
  data: IUserData,
  expiresIn: string,
  tokenType: TokenType
) => {
  const token = jwt.sign(
    data,
    process.env[
      tokenType === TokenType.Access
        ? "ACCESS_TOKEN_SECRET"
        : "REFRESH_TOKEN_SECRET"
    ] as string,
    {
      expiresIn,
    }
  );

  return token;
};
