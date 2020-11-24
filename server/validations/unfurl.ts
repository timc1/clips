import Joi from "@hapi/joi";

export const url = Joi.string().uri().required();
