import Joi from "@hapi/joi";
import { clipId } from "./clip";

export const getViews = Joi.object().keys({
  clipId,
});
