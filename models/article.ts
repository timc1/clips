import { TArticle } from "lib/types";

export default function ArticleFactory(args: { [k: string]: any }): TArticle {
  return {
    id: args._id || "",
    clips: args.clips || [], // ? args.clips.map((clip) => ClipFactory(clip)) : [],
    createdAt: args.createdAt || "",
    updatedAt: args.updatedAt || "",
  };
}
