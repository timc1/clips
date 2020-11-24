import { TClip } from "lib/types";
import useSWR, { mutate } from "swr";
import { clientFetchClip } from "../clip";

export function useClipRequest(clipId?: string, clip?: TClip) {
  const { data, error } = useSWR(
    clipId ? `/api/clip/${clipId}` : null,
    clipId ? () => clientFetchClip(clipId) : null,
    {
      initialData: clip ? { clip } : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  const loading = !data;

  return {
    data: data,
    loading,
    error,
  };
}

export function mutateClip(clipId: string, clip: TClip) {
  mutate(`/api/clip/${clipId}`, (cache) => {
    return { clip };
  });
}
