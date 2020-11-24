/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { SMALL_CONTENT_WIDTH } from "lib/constants";
import { TClip, TUser } from "lib/types";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NotFound from "pages/404";
import * as React from "react";
import removeMarkdown from "remove-markdown";
import { useClipRequest } from "www/requests/hooks/useClipRequest";
import { useUserRequest } from "www/requests/hooks/useUserRequest";
import { useViewsRequest } from "www/requests/hooks/useViewsRequest";
import { useSession } from "../../hooks/useSession";
import TopBar from "../Layout/TopBar";
import LoginLink from "../LoginLink";
import { useMarkdownIt } from "../Markdown";
import Spacer from "../Spacer";
import { H1, H3 } from "../Typography";
import ClipComments from "./ClipComments";
import Clip from ".";

type Props = {
  id: string;
  hideTopBar?: boolean;
  clip?: TClip;
  currentUser?: TUser;
  author?: TUser;
};

export default function ClipPage(props: Props) {
  const clipRequest = useClipRequest(props.id, props.clip);

  const { count } = useViewsRequest(props.id);

  const clip = clipRequest && clipRequest.data && clipRequest.data.clip;

  const author = useUserRequest({
    userId: clip && clip.authorId,
    user: props.author,
  });

  const router = useRouter();

  const sessionOptions = React.useMemo(
    () =>
      props.currentUser
        ? { initialData: { data: props.currentUser } }
        : undefined,
    [props.currentUser]
  );

  const session = useSession(sessionOptions);

  const name = author?.user?.firstName;

  const type = clip?.type;
  const markdown = clip?.markdown || "";
  const images = clip?.images || [];
  const md = useMarkdownIt(markdown);

  const title = React.useMemo(() => {
    if (!name) {
      return undefined;
    }

    switch (type) {
      case "text":
        const text = removeMarkdown(md);
        return `${name}'s clip: ${text}`;
      case "image":
        return `${name} clipped ${
          images.length > 1 ? "some images" : "an image"
        }`;
      case "link":
        return `${name}'s link clip`;
      default:
        return undefined;
    }
  }, [name, type, md, images.length]);

  return (
    <>
      <Head>{title && <title>{title}</title>}</Head>
      {!props.hideTopBar && (
        <>
          <TopBar title="Clip" user={props.currentUser} sticky />
          <Spacer spaces={2} />
        </>
      )}

      <Container>
        {clip && (
          <>
            {author.loading ? (
              <Spacer spaces={1.5} />
            ) : (
              <H1 size="tiny" weight="bold">
                <Link href={`/${author.user?.username}`}>
                  <a href={`/${author.user?.username}`}>
                    {author.user?.username}
                  </a>
                </Link>
              </H1>
            )}
            <Spacer />
            <Clip
              id={clip.id}
              clip={clip}
              router={router}
              user={session.user}
              fullPage
              noLink
              noPadding
              viewCount={count}
            />

            <Hr />

            <H3>
              Notes{" "}
              {!session.user && (
                <>
                  –
                  <LoginLink>
                    Login to drop a note
                    <span
                      role="img"
                      aria-label="Wave emoji"
                      css={css`
                        margin-left: calc(var(--unit) * 0.5);
                      `}
                    >
                      👋
                    </span>
                  </LoginLink>
                </>
              )}
            </H3>

            <Spacer spaces={3} />

            <ClipComments
              clipId={clip.id}
              isOwner={session.user?.id === clip.authorId}
              user={session.user}
            />

            <Spacer spaces={24} />
          </>
        )}
      </Container>

      {!clip && !clipRequest.loading && <NotFound />}
    </>
  );
}

const Container = styled.div`
  position: relative;
  max-width: ${SMALL_CONTENT_WIDTH};
  margin: auto;
`;

const Hr = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  background: var(--dividerColor);
  margin: calc(var(--unit) * 4) 0;
`;
