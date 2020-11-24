import Joi from "@hapi/joi";

const type = Joi.string().required().valid("viewClip");
const clipId = Joi.string().required();
const email = Joi.string().email().required();
const token = Joi.string().required();

export const create = Joi.object().keys({
  type,
  clipId,
  email,
});

export const getInvitation = Joi.string().required();

export const removeInvitation = Joi.string().required();

export const acceptInvitation = Joi.object().keys({
  email,
  clipId,
  token,
});
