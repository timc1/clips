import { TComment } from "lib/types";

export default function CommentFactory(args: { [k: string]: any }): TComment {
  return {
    id: args._id || "",
    clipId: args.clipId || "",
    text: args.text || undefined,
    authorId: args.authorId || "",
    createdAt: args.createdAt || "",
    updatedAt: args.updatedAt || "",
  };
}
