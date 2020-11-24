import getApiUrl from "lib/getApiUrl";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const getOrganizationFeatures = async (
  query: string | string[],
  req?: NextApiRequest
): Promise<any> => {
  return await client.get(`${getApiUrl(req)}/api/page/${query}`);
};
