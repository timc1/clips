import Router from "next/router";
import NotFound from "pages/404";
import * as React from "react";
import ClipHeader from "www/components/Clip/ClipHeader";
import ClipLinkEditor from "www/components/Clip/ClipLink/Editor";
import ClipTextEditor from "www/components/Clip/ClipText/Editor";
import useDateLabel from "www/hooks/useDateLabel";
import { useSession } from "www/hooks/useSession";
import useTimeFromNow from "www/hooks/useTimeFromNow";
import useToast from "www/hooks/useToast";
import { useClipRequest } from "www/requests/hooks/useClipRequest";
import Spacer from "../Spacer";
import Tooltip from "../Tooltip";
import ClipImagesEditor from "./ClipImages/Editor";

type Props = {
  id?: string;
};

const sessionOptions = {
  redirectToIfNoValidSession: "/login",
};

export default function ClipEditor(props: Props) {
  const session = useSession(sessionOptions);

  const clipId = props.id;

  const clipRequest = useClipRequest(clipId);
  const { addToast } = useToast();

  const clip = clipRequest && clipRequest.data && clipRequest.data.clip;

  const timeFromNow = useTimeFromNow({
    date: clip ? new Date(clip.updatedAt) : undefined,
  });

  const sessionId = session.user?.id;
  const authorId = clip && clip.authorId;

  React.useEffect(() => {
    if (sessionId && authorId) {
      if (sessionId !== authorId) {
        Router.replace("/");

        addToast({
          type: "self-destruct",
          children: <div>wee woo not yours</div>,
        });

        return;
      }
    }
  }, [addToast, authorId, sessionId]);

  React.useEffect(() => {
    if (clipRequest.error) {
      addToast({
        type: "self-destruct",
        children: <div>Something went wrong</div>,
      });
    }
  }, [addToast, clipRequest.error]);

  const updatedAt = clip && clip.updatedAt;

  const label = useDateLabel(updatedAt);

  if (
    clipRequest.loading ||
    session.loading ||
    (!session.loading && !session.user) ||
    authorId !== sessionId ||
    clipRequest.error
  ) {
    return null;
  }

  if (!clip) {
    return <NotFound />;
  }

  let Component = null;

  if (clip.type === "text") {
    Component = <ClipTextEditor key={clip.id} clip={clip} />;
  }

  if (clip.type === "link") {
    Component = <ClipLinkEditor key={clip.id} clip={clip} />;
  }

  if (clip.type === "image") {
    Component = <ClipImagesEditor key={clip.id} clip={clip} />;
  }

  return (
    <>
      <Tooltip label={label} aria-label={label}>
        <span>
          <ClipHeader
            text={`${
              clip.createdAt === clip.updatedAt ? "Created" : "Edited"
            } ${timeFromNow}`}
          />
        </span>
      </Tooltip>
      <Spacer />
      {Component}
      <Spacer spaces={24} />
    </>
  );
}
