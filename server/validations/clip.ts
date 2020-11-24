import Joi from "@hapi/joi";

const markdown = Joi.string().min(1).required();
export const clipId = Joi.string().required();
const metadata = Joi.object().keys({
  author: Joi.string().allow(""),
  date: Joi.string().allow(""),
  description: Joi.string().allow(""),
  image: Joi.string().allow(""),
  logo: Joi.string().allow(""),
  publisher: Joi.string().allow(""),
  title: Joi.string().allow(""),
  url: Joi.string(),
});

export const pusherPOSTEventBodyValidation = Joi.object().keys({
  channel: Joi.string().required(),
  name: Joi.string().required(),
  data: Joi.object().required(),
  socketId: Joi.string().required(),
});

export const validateType = Joi.string()
  .required()
  .valid("text", "link", "image", "visibility");

export const validateSaveTextType = Joi.object().required().keys({
  markdown,
});

export const validateSaveLinkType = Joi.object()
  .required()
  .keys({
    metadata,
    markdown: Joi.string().allow(""),
  });

export const validateGetClipRequest = Joi.object().required().keys({
  clipId,
});

export const validateDeleteClipRequest = Joi.object().required().keys({
  clipId,
});

export const validateSaveImageType = Joi.object()
  .required()
  .keys({
    images: Joi.array().items({
      key: Joi.string().required(),
      height: Joi.number().required(),
      width: Joi.number().required(),
      description: Joi.string().allow(""),
    }),
  });

export const validateGetAllArticleClipsRequest = Joi.object().required().keys({
  articleId: Joi.string().required(),
});

export const validateGetClipCommentsRequest = Joi.object().required().keys({
  clipId: Joi.string().required(),
});

export const validateUpdateVisibilityRequest = Joi.object()
  .required()
  .keys({
    visibility: Joi.string().valid("public", "private"),
  });
