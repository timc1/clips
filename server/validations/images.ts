import Joi from "@hapi/joi";

export const validateImageContent = Joi.array().items({
  md5: Joi.string().required(),
  contentType: Joi.string().required(),
  height: Joi.number().required(),
  width: Joi.number().required(),
  description: Joi.string().allow(""),
});
