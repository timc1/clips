import { TClip } from "lib/types";
import useSWR, { mutate } from "swr";
import { fetchClipsForArticle } from "www/requests/clips";

type Props = {
  articleId: string;
};

export function useArticleClipsRequest({ articleId }: Props) {
  const { data, error } = useSWR(
    `/api/clips/${articleId}`,
    async () => {
      const response = await fetchClipsForArticle({
        articleId,
      });

      return response.clips;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    loading: !data,
    error,
    clips: data,
  };
}

export function mutateUpdateArticleClip(clip: TClip) {
  mutate(`/api/clips/${clip.articleId}`, async (clipsCache) => {
    if (!clipsCache) {
      return [clip];
    }

    for (let i = 0; i < clipsCache.length; i++) {
      if (clipsCache[i] === clip.id) {
        clipsCache[i] = clip;
        break;
      }
    }

    return clipsCache;
  });
}
