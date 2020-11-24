import getApiUrl from "lib/getApiUrl";
import { TClip } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const clientFetchClip = async (
  clipId: string,
  req?: NextApiRequest
): Promise<{
  clip: TClip;
}> => {
  return await client.get(`${getApiUrl(req)}/api/clip?clipId=${clipId}`);
};

export const createClip = async (
  query: { params: Object },
  req?: NextApiRequest
): Promise<{
  ok: boolean;
  data: {
    clip: TClip;
  };
}> => {
  return await client.post(`${getApiUrl(req)}/api/clip`, query);
};

export const updateClip = async (
  query: { params: Object },
  req?: NextApiRequest
): Promise<{
  ok: boolean;
  data: {
    clip: TClip;
  };
}> => {
  return await client.put(`${getApiUrl(req)}/api/clip`, query);
};

export const deleteClip = async (
  clipId: string,
  req?: NextApiRequest
): Promise<{
  ok: boolean;
  data: {
    clip: TClip;
  };
}> => {
  return await client.delete(`${getApiUrl(req)}/api/clip`, {
    clipId,
  });
};
