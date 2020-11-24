import { TLinkMetadata, TImage, TClipVisibility } from "lib/types";
import Router from "next/router";
import * as React from "react";
import { cache } from "swr";
import { useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import { updateClip, createClip } from "www/requests/clip";
import { mutateUpdateArticleClip } from "www/requests/hooks/useArticleClipsRequest";
import { mutateClip } from "www/requests/hooks/useClipRequest";
import { useHackyForceUpdate } from "../HackyForceUpdate";
import { P } from "../Typography";

type Props = {
  // `clipId` is the flag for determining whether we should update or create the clip.
  // We use stable clipId value instead of the entire clip object to prevent any
  // unnecessary rerenders.
  clipId?: string;
};

export default function useSaveClip(props: Props) {
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const session = useSession();
  const { addToast } = useToast();
  const { forceRefreshArticles } = useHackyForceUpdate();

  const username = session.user ? session.user.username : undefined;

  const submitClip = React.useCallback(
    async (
      params:
        | { type: "text"; markdown: string }
        | { type: "link"; linkMetadata: TLinkMetadata; markdown: string }
        | { type: "image"; images: TImage[] }
        | { type: "visibility"; visibility: TClipVisibility }
    ) => {
      try {
        if (!username) {
          return;
        }

        setSaving(true);

        const response = props.clipId
          ? await updateClip({ params: { ...params, id: props.clipId } })
          : await createClip({ params });

        const { clip } = response.data;

        if (clip) {
          // Update local cache for the following:
          // useArticleClipsRequest
          mutateUpdateArticleClip(clip);
          // useClipRequest
          mutateClip(clip.id, clip);

          const articleExistsInCache = !!cache.get(
            `/api/clips/${clip.articleId}`
          );

          if (!articleExistsInCache) {
            forceRefreshArticles();
          }

          setSaving(false);

          if (!props.clipId) {
            Router.back();
          }

          addToast({
            type: "self-destruct",
            children: (
              <P size="small" weight="medium">
                {props.clipId
                  ? "Clip successfully updated"
                  : "New clip successfully added"}
              </P>
            ),
          });
        }
      } catch (error) {
        setError("Something went wrong!");
        setSaving(false);
        // TODO: Add toast here
      }
    },

    [addToast, forceRefreshArticles, props.clipId, username]
  );

  return {
    saving,
    error,
    submitClip,
  };
}
