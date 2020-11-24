import useSWR from "swr";
import { fetchComments } from "../comments";

export function useClipCommentsRequest(clipId?: string) {
  const { data, error } = useSWR(
    clipId ? `/api/comments?clipId=${clipId}` : null,
    clipId ? () => fetchComments(clipId) : null,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // 30 seconds for now
      dedupingInterval: 30000,
    }
  );

  const loading = !data;

  return {
    comments: data?.comments,
    loading,
    error,
  };
}
