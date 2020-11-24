/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { TClip, TUser } from "lib/types";
import Router, { NextRouter } from "next/router";
import * as React from "react";
import { mutate } from "swr";
import Icon from "www/components/Icon";
import useClipboard from "www/hooks/useClipboard";
import useDateLabel from "www/hooks/useDateLabel";
import useTimeFromNow from "www/hooks/useTimeFromNow";
import { formatAMPM } from "www/lib/helpers";
import { deleteClip } from "www/requests/clip";
import OverflowButton from "../Button/OverflowButton";
import Floating from "../Floating";
import FloatingMenu from "../FloatingMenu";
import Link from "../Link";
import Menu from "../Menu";
import MenuItem from "../Menu/MenuItem";
import Modal from "../Modal";
import Spacer from "../Spacer";
import Tooltip from "../Tooltip";
import { H2, P } from "../Typography";
import ClipHeader from "./ClipHeader";
import ClipImages from "./ClipImages";
import ClipLink from "./ClipLink";
import ClipShare from "./ClipShare";
import ClipText from "./ClipText";

type Props = {
  id: string | string[];
  clip: TClip;
  router: NextRouter;
  user?: TUser;
  noLink?: boolean;
  fullPage?: boolean;
  showTimestamp?: boolean;
  noPadding?: boolean;
  viewCount?: number;
};

export default function Clip(props: Props) {
  const { pathname, query } = props.router;

  const { clip } = props;

  const type = clip && clip.type;
  const time = clip && clip.createdAt;
  const timestamp = React.useMemo(() => time && formatAMPM(new Date(time)), [
    time,
  ]);

  let Component = React.useMemo(() => {
    let Component = null;

    switch (type) {
      case "text":
        Component = (
          <ClipText
            title={clip.title}
            markdown={clip.markdown}
            timestamp={timestamp}
          />
        );
        break;
      case "link":
        Component = (
          <ClipLink markdown={clip.markdown} linkMetadata={clip.linkMetadata} />
        );
        break;
      case "image":
        Component = <ClipImages images={clip.images} />;
        break;
    }

    return Component;
  }, [clip, timestamp, type]);

  const id = clip && clip.id;

  const page = query.page;

  const link = React.useMemo(
    () => ({
      pathname,
      query: { page, clipModal: id },
    }),
    [id, page, pathname]
  );

  const editLink = React.useMemo(
    () => ({
      pathname,
      query: { page, clipId: id, clipModal: id, edit: true },
    }),
    [id, page, pathname]
  );

  const timeFromNow = useTimeFromNow({
    date: clip ? new Date(clip.updatedAt) : undefined,
  });

  let label = useDateLabel(clip.createdAt);

  if (clip.createdAt !== clip.updatedAt) {
    label += ` · [edited]`;
  }

  const [isShareModalShowing, setIsShareModalShowing] = React.useState<boolean>(
    false
  );

  const onRequestClose = React.useCallback(
    () => setIsShareModalShowing(false),
    []
  );

  const isOwner = (props.user && props.user.id) === (clip && clip.authorId);

  const { copy } = useClipboard();

  const createShareClickHandler = React.useCallback(
    (callback) => () => {
      const { protocol, host } = window.location;
      callback();
      if (isOwner) {
        setIsShareModalShowing(true);
      } else {
        copy(protocol + host + `/${query.page}/clip/${clip.id}`);
      }
    },
    [isOwner, copy, query.page, clip.id]
  );

  const [deleteState, setDeleteState] = React.useState("idle");
  const createDeleteClickHandler = React.useCallback(
    (onRequestClose) => async () => {
      if (deleteState === "idle") {
        setDeleteState("confirming");
      } else if (deleteState === "confirming") {
        // optimistic removal
        mutate(
          `/api/clips/${clip.articleId}`,
          (cache) =>
            cache
              ? cache.filter((currentClip) => currentClip.id !== clip.id)
              : undefined,
          false
        );

        // if in a modal exit out of it
        if (query.clipModal) {
          Router.back();
        } else {
          Router.push(`/${page}`);
        }

        await deleteClip(clip.id);
        // update and revalidate clip cache
        mutate(`/api/clip/${clip.id}`);
      } else {
        onRequestClose();
      }
    },
    [clip.articleId, clip.id, deleteState, page, query.clipModal]
  );

  const handleResetDeleteState = React.useCallback(() => {
    setDeleteState("idle");
  }, []);

  return (
    <>
      {isShareModalShowing && (
        <Modal onRequestClose={onRequestClose} isOpen={isShareModalShowing}>
          <ClipShare clipId={clip.id} visibility={clip.visibility} />
        </Modal>
      )}
      <Container
        css={
          props.noPadding &&
          css`
            padding: 0;
          `
        }
      >
        {props.noLink ? null : (
          <StyledLink
            shallow
            href={link}
            as={`/${query.page}/clip/${clip.id}`}
            fullWidth
          />
        )}

        {props.showTimestamp && !props.fullPage && (
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
            <Spacer spaces={3} />
          </>
        )}

        {props.fullPage && (
          <>
            <div
              css={css`
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: max-content;
                justify-content: space-between;
                gap: var(--unit);
                align-items: center;
                cursor: default;
              `}
            >
              <H2 size="tiny">{label}</H2>
              {props.viewCount ? (
                <>
                  <P
                    size="tiny"
                    css={css`
                      line-height: 1;
                    `}
                  >
                    {props.viewCount} {props.viewCount > 1 ? "views" : "view"}
                  </P>
                </>
              ) : null}
            </div>

            <Spacer spaces={3} />
          </>
        )}

        <FloatingMenu
          placement="bottom-end"
          onRequestClose={handleResetDeleteState}
          body={({ onRequestClose }) => {
            return (
              <Floating>
                <Menu>
                  <MenuItem
                    onClick={createShareClickHandler(onRequestClose)}
                    text={isOwner ? "Share" : "Copy link"}
                  />
                  {isOwner && (
                    <>
                      <MenuItem
                        shallow
                        href={editLink}
                        as={`/${query.page}/clip/${clip.id}/edit`}
                        text="Edit"
                        onClick={onRequestClose}
                        scroll={false}
                      />
                      <MenuItem
                        shallow
                        text={
                          deleteState === "confirming" ? "Confirm?" : "Delete"
                        }
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
                            <Icon
                              icon="exclamation-mark-in-circle"
                              size="small"
                            />
                          ) : null
                        }
                      />
                    </>
                  )}
                </Menu>
              </Floating>
            );
          }}
        >
          {({ ref, onClick, isShowing, ...rest }) => (
            <StyledOverflowButton
              ref={ref}
              onClick={onClick}
              css={css`
                ${
                  isShowing &&
                  css`
                    background: var(--buttonBackgroundColorActive);
                  `
                }
                ${
                  (props.fullPage || isShowing) &&
                  css`
                    opacity: 1 !important;
                  `
                }
                ${
                  props.fullPage &&
                  css`
                    top: -10px;
                    right: -4px;
                    box-shadow: none;
                  `
                }
              `}
              {...rest}
            >
              <Icon icon="horizontal-overflow" fill="var(--textColor)" />
            </StyledOverflowButton>
          )}
        </FloatingMenu>
        {Component}
      </Container>
    </>
  );
}

const StyledOverflowButton = styled(OverflowButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;

const Container = styled.div`
  padding: calc(var(--unit) * 2);
  height: 100%;
  background: var(--contentBackground);

  @media (hover) {
    ${StyledOverflowButton} {
      opacity: 0;
    }
  }

  &:focus-within {
    ${StyledOverflowButton} {
      opacity: 1;
    }
  }

  &:hover {
    ${StyledOverflowButton} {
      opacity: 1;
    }
  }
`;

const StyledLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  z-index: 1;
`;
