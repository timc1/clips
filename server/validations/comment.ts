import Joi from "@hapi/joi";

const text = Joi.string().required();
const clipId = Joi.string().required();
const authorId = Joi.string().required();

export const create = Joi.object().keys({
  text,
  clipId,
  authorId,
});
