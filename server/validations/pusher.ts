import Joi from "@hapi/joi";

export const pusherPOSTEventBodyValidation = Joi.object().keys({
  channel: Joi.string().required(),
  name: Joi.string().required(),
  data: Joi.object().required(),
  socketId: Joi.string().required(),
});
