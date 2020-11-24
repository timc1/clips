import getApiUrl from "lib/getApiUrl";
import { TArticle } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const fetchArticles = async (
  query: {
    username: string;
    page: number;
    limit: number;
  },
  req?: NextApiRequest
): Promise<{
  ok: boolean;
  data: {
    articles: TArticle[];
    meta: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
}> => {
  return await client.get(`${getApiUrl(req)}/api/articles`, query);
};
