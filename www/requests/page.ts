import getApiUrl from "lib/getApiUrl";
import { TUser } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const fetchPage = async (
  query: string | string[],
  req?: NextApiRequest
): Promise<{ user?: TUser }> => {
  return await client.get(`${getApiUrl(req)}/api/page/${query}`);
};
