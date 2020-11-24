import { TClip } from "lib/types";

export default function ClipFactory(args: { [k: string]: any }): TClip {
  return {
    id: args.id || "",
    articleId: args.articleId || "",
    type: args.type || "",
    title: args.title || undefined,
    linkMetadata: args.linkMetadata || undefined,
    markdown: args.markdown || undefined,
    images: args.images || undefined,
    comments: args.comments || [],
    authorId: args.authorId || "",
    createdAt: args.createdAt || "",
    updatedAt: args.updatedAt || "",
    visibility: args.visibility || false,
    invitations: args.invitations || [],
  };
}
