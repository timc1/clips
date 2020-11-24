import { TFontWeight, TFontSize, TNotificationType } from "./types";

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 16;
export const MIN_FIRST_NAME_LENGTH = 2;
export const MAX_FIRST_NAME_LENGTH = 30;
export const MIN_LAST_NAME_LENGTH = 2;
export const MAX_LAST_NAME_LENGTH = 40;

export const fontWeights: { [key in TFontWeight]: string } = {
  regular: "var(--fontWeightRegular)",
  medium: "var(--fontWeightMedium)",
  bold: "var(--fontWeightBold)",
};

export const fontSizes: { [key in TFontSize]: string } = {
  soTiny: "var(--fontSizeSoTiny)",
  tiny: "var(--fontSizeTiny)",
  small: "var(--fontSizeSmall)",
  medium: "var(--fontSizeMedium)",
  large: "var(--fontSizeLarge)",
};

export const MEDIUM_CONTENT_WIDTH = "1150px";
export const SMALL_CONTENT_WIDTH = "75ch";

export const NOTIFICATIONS: { [k: string]: TNotificationType } = {
  commentCreated: "COMMENT_CREATED",
  clipInvite: "CLIP_INVITE",
  commentCreatedSubscription: "COMMENT_CREATED_SUBSCRIPTION",
};

export const AVATAR_URL = "https://shimmer-avatars.s3-us-west-1.amazonaws.com/";
export const AVATAR_BUCKET = "shimmerapp";
