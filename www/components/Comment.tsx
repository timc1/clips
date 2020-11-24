/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { AVATAR_URL } from "lib/constants";
import { TComment } from "lib/types";
import { useRouter } from "next/router";
import * as React from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { mutate } from "swr";
import useClipboard from "www/hooks/useClipboard";
import useTimeFromNow from "www/hooks/useTimeFromNow";
import { deleteComment, updateComment } from "www/requests/comments";
import { useUserRequest } from "www/requests/hooks/useUserRequest";
import OverflowButton from "./Button/OverflowButton";
import CommentReplyForm from "./CommentReplyForm";
import Floating from "./Floating";
import FloatingMenu from "./FloatingMenu";
import Icon from "./Icon";
import Markdown from "./Markdown";
import Menu from "./Menu";
import MenuItem from "./Menu/MenuItem";
import Timestamp from "./Timestamp";
import Tooltip from "./Tooltip";
import UserImage from "./UserImage";

type Props = {
  comment: TComment;
  isFocused?: boolean;
  isAuthor?: boolean;
  isOwner?: boolean;
};

export default function Comment(props: Props) {
  const { user } = useUserRequest({ userId: props.comment.authorId });

  const ownRef = React.useRef(null);

  React.useEffect(() => {
    if (props.isFocused) {
      scrollIntoView(ownRef.current, {
        behavior: "smooth",
        scrollMode: "if-needed",
      });
    }
  }, [props.isFocused]);

  const [isBackgroundHighlighted, setBackgroundHighlighted] = React.useState(
    false
  );

  const handleSetBackgroundHighlighted = React.useCallback(() => {
    setBackgroundHighlighted(true);
  }, []);

  const [deleteState, setDeleteState] = React.useState("idle");

  const onFloatingMenuClose = React.useCallback(() => {
    setBackgroundHighlighted(false);
    setDeleteState("idle");
  }, []);

  const createDeleteClickHandler = React.useCallback(
    (onRequestClose) => async () => {
      if (deleteState === "idle") {
        setDeleteState("confirming");
      } else if (deleteState === "confirming") {
        // optimistic update
        mutate(
          `/api/comments?clipId=${props.comment.clipId}`,
          (cache) => {
            return {
              comments: cache
                ? cache.comments.filter(
                    (currentComment) => currentComment.id !== props.comment.id
                  )
                : [],
            };
          },
          false
        );
        deleteComment(props.comment.id);
      } else {
        onRequestClose();
      }
    },
    [deleteState, props.comment.clipId, props.comment.id]
  );

  const [editing, setEditing] = React.useState(false);

  const handleToggleEdit = React.useCallback(() => {
    setEditing((editing) => !editing);
    setBackgroundHighlighted(false);
    setDeleteState("idle");
  }, []);

  const { query } = useRouter();
  const { copy } = useClipboard();

  const handleCopyLink = React.useCallback(
    (onRequestClose) => () => {
      const { protocol, host } = window.location;
      copy(
        protocol +
          "//" +
          host +
          `/${query.page}/clip/${props.comment.clipId}?commentId=${props.comment.id}`
      );

      onRequestClose();
    },
    [copy, props.comment.clipId, props.comment.id, query.page]
  );

  const handleSubmit = React.useCallback(
    (value) => {
      // optimistic update
      mutate(
        `/api/comments?clipId=${props.comment.clipId}`,
        (cache) => {
          return {
            comments: cache
              ? cache.comments.map((currentComment) => {
                  if (currentComment.id === props.comment.id) {
                    currentComment.text = value;
                    currentComment.updatedAt = Date.now();
                  }

                  return currentComment;
                })
              : [],
          };
        },
        false
      );

      updateComment(props.comment.id, value);
      setEditing(false);
    },
    [props.comment.clipId, props.comment.id]
  );

  const lastUpdated = useTimeFromNow({
    date: new Date(props.comment.updatedAt),
  });

  if (editing) {
    return (
      <CommentReplyForm
        onSubmit={handleSubmit}
        autoFocus
        submitText="Update"
        onClickCancel={handleToggleEdit}
        defaultValue={props.comment.text}
      />
    );
  }

  return (
    <Container
      ref={ownRef}
      isFocused={props.isFocused}
      isBackgroundHighlighted={isBackgroundHighlighted}
    >
      <UserImage
        size="tiny"
        src={user?.profileImage && AVATAR_URL + user.profileImage}
        alt="User image"
      />
      <div
        css={
          props.isFocused &&
          css`
            &::before {
              content: "";
              position: absolute;
              top: calc(var(--unit) * -0.5);
              left: calc(var(--unit) * -0.5);
              right: calc(var(--unit) * -0.5);
              bottom: calc(var(--unit) * -0.5);
              box-shadow: 0 0 0px 2px var(--highlight);
              z-index: -1;
            }
          `
        }
      >
        <div>
          <UsernameContainer>
            <span>{user && `${user.firstName} ${user.lastName}`}</span>
            <Divider>·</Divider>
            <Timestamp time={props.comment.createdAt} />
            {props.comment.createdAt !== props.comment.updatedAt && (
              <>
                <Divider>·</Divider>
                <Tooltip label={lastUpdated} aria-label={lastUpdated}>
                  <span>[edited]</span>
                </Tooltip>
              </>
            )}
          </UsernameContainer>
        </div>
        <Markdown markdown={props.comment.text} />
      </div>
      <FloatingMenu
        placement="bottom-end"
        onRequestClose={onFloatingMenuClose}
        onShow={handleSetBackgroundHighlighted}
        body={({ onRequestClose }) => {
          return (
            <Floating>
              <Menu>
                <MenuItem
                  onClick={handleCopyLink(onRequestClose)}
                  text="Copy link"
                />
                {props.isAuthor && (
                  <MenuItem onClick={handleToggleEdit} text="Edit" />
                )}
                {(props.isAuthor || props.isOwner) && (
                  <MenuItem
                    shallow
                    text={deleteState === "confirming" ? "Confirm?" : "Delete"}
                    onClick={createDeleteClickHandler(onRequestClose)}
                    css={
                      deleteState === "confirming"
                        ? css`
                            background: rgb(255 8 8 / 75%) !important;
                          `
                        : null
                    }
                    icon={
                      deleteState === "confirming" ? (
                        <Icon icon="exclamation-mark-in-circle" size="small" />
                      ) : null
                    }
                  />
                )}
              </Menu>
            </Floating>
          );
        }}
      >
        {({ ref, onClick, isShowing, ...rest }) => (
          <OverflowButton
            ref={ref}
            onClick={onClick}
            css={css`
              ${isShowing &&
              css`
                background: var(--buttonBackgroundColorActive);
                opacity: 1 !important;
              `}
            `}
            {...rest}
          >
            <Icon icon="horizontal-overflow" fill="var(--textColor)" />
          </OverflowButton>
        )}
      </FloatingMenu>
    </Container>
  );
}

const Container = styled.div<{
  isFocused?: boolean;
  isBackgroundHighlighted?: boolean;
}>`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: var(--unit);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: var(--commentBackgroundTint);
    opacity: 0;
    z-index: -1;
  }

  ${(props) =>
    props.isBackgroundHighlighted &&
    css`
      &::before {
        opacity: 1;
      }
    `}

  @media (hover) {
    button {
      opacity: 0;
    }

    &:hover {
      &::before,
      button {
        opacity: 1;
      }
    }
  }

  :focus-within {
    button {
      opacity: 1;
    }
  }
`;

const UsernameContainer = styled.div`
  line-height: 0.6;
  margin-bottom: calc(var(--unit) * 0.5);

  * {
    font-size: var(--fontSizeSoTiny);
    color: var(--tertiaryTextColor);
    font-family: var(--primaryFont);
    cursor: default;
  }
`;

const Divider = styled.span`
  margin: 0 calc(var(--unit) * 0.5);
`;
