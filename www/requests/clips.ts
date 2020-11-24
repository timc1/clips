import getApiUrl from "lib/getApiUrl";
import { TClip } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const fetchClipsForArticle = async (
  query: {
    articleId;
  },
  req?: NextApiRequest
): Promise<{
  clips: TClip[];
}> => {
  return await client.get(`${getApiUrl(req)}/api/clips`, query);
};
