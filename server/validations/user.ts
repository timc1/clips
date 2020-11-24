import Joi from "@hapi/joi";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MIN_FIRST_NAME_LENGTH,
  MIN_LAST_NAME_LENGTH,
} from "lib/constants";

// @ts-ignore
Joi.objectId = require("joi-objectid")(Joi);

const email = Joi.string().email().required();
const username = Joi.string()
  .alphanum()
  .min(MIN_USERNAME_LENGTH)
  .max(MAX_USERNAME_LENGTH)
  .required();
const firstName = Joi.string()
  .min(MIN_FIRST_NAME_LENGTH)
  .max(MAX_FIRST_NAME_LENGTH)
  .required();
const lastName = Joi.string()
  .min(MIN_LAST_NAME_LENGTH)
  .max(MAX_LAST_NAME_LENGTH)
  .required();
const password = Joi.string()
  .min(8)
  .error(new Error("Password must be at least 8 characters."));
const passwordConfirmation = Joi.string()
  .required()
  .valid(Joi.ref("password"))
  .error(new Error("Passwords must match."));
// https://github.com/timc1/shimmer/blob/6d287941e565d0a055eac9e2081b6a46d8a43b5f/server/utils/helpers.ts#L26
const TOKEN_LENGTH = 40; // DO NOT CHANGE unless you're changing the token length returned from generateRandomToken().
const token = Joi.string().min(TOKEN_LENGTH).max(TOKEN_LENGTH).required();

export const signUp = Joi.object().keys({
  email,
  username,
  firstName,
  lastName,
  password,
  passwordConfirmation,
});

export const signIn = Joi.object().keys({
  email,
  password,
});

export const signInWithEmail = Joi.object().keys({
  email,
});

export const signInWithEmailQueryParams = Joi.object().keys({
  email,
  token,
});

export const resetPasswordRequest = Joi.object().keys({
  email,
});

export const resetPasswordSubmission = Joi.object().keys({
  password,
  passwordConfirmation,
});

export const getUserRequest = Joi.object().keys({
  // @ts-ignore
  userId: Joi.objectId().required(),
});

export const validateUpdateUser = Joi.object().keys({
  firstName,
  lastName,
});

export const validateUpdateProfilePhoto = Joi.object().keys({
  key: Joi.string().required(),
});
