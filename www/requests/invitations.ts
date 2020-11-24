import getApiUrl from "lib/getApiUrl";
import { TInvitation } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const removeInvitation = async (
  params: {
    invitationId;
  },
  req?: NextApiRequest
): Promise<{
  invitation: TInvitation;
}> => {
  return await client.delete(`${getApiUrl(req)}/api/invitations`, params);
};

export const createInvitation = async (
  params: {
    clipId: string;
    email: string;
    type: "viewClip";
  },
  req?: NextApiRequest
): Promise<{
  invitation: TInvitation;
}> => {
  return await client.post(`${getApiUrl(req)}/api/invitations`, params);
};
