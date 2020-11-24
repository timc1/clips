import styled from "@emotion/styled";
import getMongoObjectId from "lib/getMongoObjectId";
import { TUser } from "lib/types";
import CommentFactory from "models/comment";
import { useRouter } from "next/router";
import * as React from "react";
import { mutate } from "swr";
import Comment from "www/components/Comment";
import { FadeInWrapper } from "www/globalStyles";
import { isSSR } from "www/lib/helpers";
import { createComment } from "www/requests/comments";
import { useClipCommentsRequest } from "www/requests/hooks/useClipCommentsRequest";
import CommentReplyForm from "../CommentReplyForm";

type Props = {
  clipId: string;
  user: TUser;
  isOwner: boolean;
};

export default function ClipComments(props: Props) {
  const { comments } = useClipCommentsRequest(props.clipId);
  const {
    query: { commentId },
  } = useRouter();
  const [replyFormStatus, setReplyFormStatus] = React.useState("idle");

  const userId = props.user && props.user.id;

  const handleSubmit = React.useCallback(
    async (value: string) => {
      setReplyFormStatus("submitting");

      try {
        // Optimistic update
        const date = new Date().toISOString();
        const comment = CommentFactory({
          id: getMongoObjectId(),
          clipId: props.clipId,
          text: value,
          authorId: userId,
          createdAt: date,
          updatedAt: date,
        });

        mutate(
          `/api/comments?clipId=${props.clipId}`,
          { comments: [comment, ...comments] },
          false
        );

        await createComment(props.clipId, value);

        mutate(`/api/comments?clipId=${props.clipId}`);

        setReplyFormStatus("submitted");
      } catch {
        console.log("error");
      }
    },
    [comments, props.clipId, userId]
  );

  return (
    <FadeInWrapper>
      {props.user && !isSSR() ? (
        <>
          <CommentReplyForm
            onSubmit={handleSubmit}
            isSubmitting={replyFormStatus === "submitting"}
            hasError={replyFormStatus === "error"}
          />
        </>
      ) : null}
      {!!comments ? (
        <Ul>
          {comments.map((comment) => {
            const isCommentAuthor = props.user?.id === comment.authorId;
            return (
              <li key={comment.id}>
                <Comment
                  comment={comment}
                  isFocused={commentId === comment.id}
                  // if article owner is current user or if current user is comment author
                  isAuthor={isCommentAuthor}
                  isOwner={props.isOwner || isCommentAuthor}
                />
              </li>
            );
          })}
        </Ul>
      ) : null}
    </FadeInWrapper>
  );
}

const Ul = styled.ul`
  display: grid;
  gap: var(--unit);
`;
