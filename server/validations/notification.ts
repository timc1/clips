import Joi from "@hapi/joi";

export const getNotifications = Joi.object().keys({
  page: Joi.number(),
  limit: Joi.number(),
});

export const markNotificationAsRead = Joi.object().keys({
  markAsRead: Joi.string().required(),
});
