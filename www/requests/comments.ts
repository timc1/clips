import getApiUrl from "lib/getApiUrl";
import { TComment } from "lib/types";
import { NextApiRequest } from "next";
import { client } from "../lib/ApiClient";

export const fetchComments = async (
  clipId: string,
  req?: NextApiRequest
): Promise<{
  comments: TComment[];
}> => {
  return await client.get(`${getApiUrl(req)}/api/comments?clipId=${clipId}`);
};

export const createComment = async (clipId: string, text: string) => {
  return await client.post(`${getApiUrl()}/api/comment`, {
    clipId,
    text,
  });
};

export const deleteComment = async (commentId: string) => {
  return await client.delete(`${getApiUrl()}/api/comment`, {
    commentId,
  });
};

export const updateComment = async (commentId: string, text: string) => {
  return await client.put(`${getApiUrl()}/api/comment`, {
    commentId,
    text,
  });
};
