export type TUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  organizations: string[];
  comments: string[];
  hasOnboarded: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TArticle = {
  id: string;
  clips: TClip[];
  createdAt: Date;
  updatedAt: Date;
};

export type TClipKind = "text" | "link" | "image";

export type TClipVisibility = "private" | "public";

export type TInvitation = {
  id: string;
  email: string;
  status: "accepted" | "pending";
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TClip = {
  id: string;
  articleId: string;
  type: TClipKind;
  title?: string;
  markdown?: string;
  authorId?: string;
  linkMetadata?: TLinkMetadata;
  images: TImage[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  visibility: TClipVisibility;
  invitations: string[];
};

export type TNotificationType =
  | "COMMENT_CREATED"
  | "COMMENT_CREATED_SUBSCRIPTION"
  | "CLIP_INVITE";

export type TNotification = {
  id: string;
  type: TNotificationType;
  sender: string;
  receiver: string[];
  readAt: Date;
  payload: any;
  createdAt: Date;
  updatedAt: Date;
};

export type TComment = {
  id: string;
  clipId: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TLinkMetadata = {
  author?: string;
  date?: string;
  description?: string;
  image?: string;
  logo?: string;
  publisher?: string;
  title?: string;
  url?: string;
};

export type TImage = {
  key: string;
  height: number;
  width: number;
  description?: string;
};

export type TIcon =
  | "exclamation-mark"
  | "exclamation-mark-in-circle"
  | "eye-visible"
  | "eye-invisible"
  | "checkmark"
  | "caret-left"
  | "caret-right"
  | "search"
  | "vertical-overflow"
  | "horizontal-overflow"
  | "menu"
  | "caret-filled-up"
  | "plus"
  | "markdown-bold"
  | "markdown-italic"
  | "markdown-link"
  | "markdown-h1"
  | "markdown-h2"
  | "markdown-bullet-list"
  | "markdown-ordered-list"
  | "markdown-underline"
  | "markdown-strikethrough"
  | "exit"
  | "text-draft"
  | "text"
  | "comment"
  | "lightning-bolt"
  | "lightning-bolt-filled"
  | "lock"
  | "command"
  | "logo";

export type TFontWeight = "regular" | "medium" | "bold";

export type TFontSize = "soTiny" | "tiny" | "small" | "medium" | "large";

export type TIconSize = "default" | "small" | "medium" | "large";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
