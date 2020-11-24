import Joi from "@hapi/joi";

export const validateGetRequestParams = Joi.object().required().keys({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  username: Joi.string().required(),
});
