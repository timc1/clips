import useSWR from "swr";
import { client } from "www/lib/ApiClient";

export function useViewsRequest(clipId?: string) {
  const { data, error } = useSWR(
    clipId ? `/api/views?clipId=${clipId}` : null,
    client.get,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  return {
    count: data?.count,
    loading: !data,
    error,
  };
}
