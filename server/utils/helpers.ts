import { ValidationError, SuspiciousRequestError } from "lib/errors";
import { TUser } from "lib/types";
import UserFactory from "models/user";
import mongoose from "mongoose";
import { NextApiResponse } from "next";

export const parseError = (error) => {
  const validationError =
    error instanceof mongoose.Error || error instanceof ValidationError;
  const suspiciousRequestError = error instanceof SuspiciousRequestError;

  if (error.isJoi) {
    return {
      ok: false,
      stack: error.details[0],
      code: error.code || 400,
      validationError,
      suspiciousRequestError,
      error,
    };
  }

  return {
    ok: false,
    message: error.message,
    stack: error.stack,
    code: error.code || 400,
    validationError,
    suspiciousRequestError,
    error,
  };
};

export const sessionizeUser = (user) => UserFactory(user);

export const generateRandomToken = (length = 40) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function redirectHome(res: NextApiResponse, user: TUser) {
  res.setHeader("location", "/");
  res.statusCode = 302;
  return { props: { user } };
}
