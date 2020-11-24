/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { NOTIFICATIONS } from "lib/constants";
import { clipLocation } from "lib/location";
import { TNotification } from "lib/types";
import Link from "next/link";
import { NextRouter } from "next/router";
import * as React from "react";
import { useVirtual } from "react-virtual";
import { Waypoint } from "react-waypoint";
import { useSWRInfinite } from "swr";
import { accessibilityOutline, shimmerAnimation } from "www/globalStyles";
import { client } from "www/lib/ApiClient";
import { useUserRequest } from "www/requests/hooks/useUserRequest";
import { markNotificationAsRead } from "www/requests/notifications";
import Flex from "../Flex";
import Floating from "../Floating";
import FloatingMenu from "../FloatingMenu";
import Icon, { IconWithRef } from "../Icon";
import Menu from "../Menu";
import Padding from "../Padding";
import Spacer from "../Spacer";
import Timestamp from "../Timestamp";
import { H3, P } from "../Typography";
import ClipInviteNotification from "./ClipInviteNotification";
import CommentCreatedSubscription from "./CommentCreatedSubscription";
import CommentNotification from "./CommentNotification";

type Props = {
  userId: string;
  username: string;
  router: NextRouter;
};

const PAGE_SIZE = 30;

export default function Notifications(props: Props) {
  const { data, error, setSize, mutate } = useSWRInfinite(
    (index) => `/api/notifications?page=${index + 1}&limit=${PAGE_SIZE}`,
    client.get,
    { revalidateOnFocus: false }
  );

  const notifications: TNotification[] = React.useMemo(
    () => (data ? data.map((data) => data.notifications).flat() : []),
    [data]
  );
  const meta = data ? data[0].meta : {};
  const isLoadingInitialData = !data && !error;
  const isFinished = notifications.length >= meta.total;

  const { unread, read } = React.useMemo(
    () =>
      notifications.reduce(
        (acc, notification) => {
          if (!!notification.readAt) {
            acc.read.push(notification);
          } else {
            acc.unread.push(notification);
          }

          return acc;
        },
        { unread: [], read: [] }
      ),
    [notifications]
  );

  const items = React.useMemo(() => {
    const items = [];

    if (unread.length) {
      items.push(
        <>
          <H3 weight="bold" size="tiny">
            Unread
          </H3>
          <Spacer />
        </>
      );

      unread.forEach((notification) => {
        items.push(
          <NotificationItem
            notification={notification}
            username={props.username}
            router={props.router}
            revalidate={mutate}
          />
        );
      });
    }

    if (read.length) {
      items.push(
        <>
          {unread.length ? <Spacer /> : null}
          <H3 weight="bold" size="tiny">
            Read
          </H3>
          <Spacer />
        </>
      );

      read.forEach((notification) => {
        items.push(
          <NotificationItem
            notification={notification}
            username={props.username}
            router={props.router}
            revalidate={mutate}
          />
        );
      });
    }

    return items;
  }, [mutate, props.router, props.username, read, unread]);

  const parentRef = React.useRef(null);

  const handleLoadMore = React.useCallback(
    () => setSize((prevSize) => prevSize + 1),
    [setSize]
  );

  const renderList = React.useCallback(
    (onRequestClose) => {
      if (isLoadingInitialData) {
        return (
          <Loader>
            <div />
            <div />
            <div />
          </Loader>
        );
      }

      if (!items.length) {
        return (
          <Padding top={2} left={2} right={2} bottom={2}>
            <Flex alignItems="center" direction="column">
              <Icon icon="lightning-bolt" />
              <Spacer />
              <P size="tiny">No notifications</P>
            </Flex>
          </Padding>
        );
      }

      return (
        <VirtualizedList
          items={items}
          parentRef={parentRef}
          onRequestClose={onRequestClose}
          isFinished={isFinished}
          loadMore={handleLoadMore}
        />
      );
    },
    [handleLoadMore, isFinished, isLoadingInitialData, items]
  );

  return (
    <FloatingMenu
      placement="bottom-end"
      body={({ onRequestClose }) => {
        return (
          <Floating
            css={css`
              max-width: 320px;
              width: 320px;
              padding: 0;
            `}
          >
            {renderList(onRequestClose)}
          </Floating>
        );
      }}
    >
      {({ ref, onClick, isShowing, ...rest }) => (
        <IconWithRef
          ref={ref}
          icon={unread.length ? "lightning-bolt-filled" : "lightning-bolt"}
          onClick={onClick}
          {...rest}
        />
      )}
    </FloatingMenu>
  );
}

function NotificationItem({
  notification,
  username,
  router,
  revalidate,
}: {
  notification: TNotification;
  username: string;
  router: NextRouter;
  revalidate: () => void;
}) {
  const sender = useUserRequest({ userId: notification.sender });

  const name = sender?.user?.firstName;
  const senderUsername = sender?.user?.username;

  const { Component, link } = React.useMemo(() => {
    let Component = null;
    let link = undefined;

    switch (notification.type) {
      case NOTIFICATIONS.commentCreated:
        Component = <CommentNotification actor={name} />;

        link = clipLocation({
          username,
          clipId: notification.payload.clipId,
          options: {
            commentId: notification.payload.commentId,
          },
        });
        break;
      case NOTIFICATIONS.commentCreatedSubscription:
        Component = <CommentCreatedSubscription actor={name} />;

        link = clipLocation({
          username,
          clipId: notification.payload.clipId,
          options: {
            commentId: notification.payload.commentId,
          },
        });
        break;
      case NOTIFICATIONS.clipInvite:
        Component = <ClipInviteNotification actor={name} />;

        link = clipLocation({
          username: senderUsername,
          clipId: notification.payload.clipId,
        });
        break;
    }

    return { Component, link };
  }, [
    name,
    notification.payload.clipId,
    notification.payload.commentId,
    notification.type,
    senderUsername,
    username,
  ]);

  const handleMarkNotificationAsRead = React.useCallback(async () => {
    if (!notification.readAt) {
      await markNotificationAsRead(notification.id);
      revalidate();
    }
  }, [notification.id, notification.readAt, revalidate]);

  // Mark notifications as read if the user is currently on the route for that notification
  React.useEffect(() => {
    if (!notification.readAt) {
      switch (notification.type) {
        case NOTIFICATIONS.commentCreated:
          const { clipId } = notification.payload;

          if (
            clipLocation({
              username,
              clipId,
            }) ===
            clipLocation({
              username: router.query.page as string,
              clipId: router.query.clipId as string,
            })
          ) {
            handleMarkNotificationAsRead();
          }
          break;
      }
    }
  }, [
    handleMarkNotificationAsRead,
    link,
    notification.payload,
    notification.readAt,
    notification.type,
    router,
    username,
  ]);

  if (!Component) {
    return null;
  }

  return (
    <NotificationItemWrapper onClick={handleMarkNotificationAsRead}>
      <Link href={link}>
        <StyledLink href={link} />
      </Link>
      <NotificationItemInnerWrapper>
        {Component}
        <Timestamp time={notification.createdAt} />
      </NotificationItemInnerWrapper>
    </NotificationItemWrapper>
  );
}

function VirtualizedList({
  items,
  parentRef,
  onRequestClose,
  isFinished,
  loadMore,
}: {
  items: React.ReactNode[];
  parentRef: React.MutableRefObject<HTMLDivElement>;
  onRequestClose: () => void;
  isFinished: boolean;
  loadMore: () => void;
}) {
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
  });

  return (
    <Menu>
      <div
        ref={parentRef}
        css={css`
          padding: var(--unit);
          max-height: 450px;
          overflow: auto;
        `}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const Component = items[virtualRow.index];
            const isLoaderRow = virtualRow.index + 1 === items.length;

            return (
              <React.Fragment key={virtualRow.index}>
                <div
                  ref={virtualRow.measureRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={onRequestClose}
                >
                  {Component}
                  {isLoaderRow && !isFinished ? (
                    <Waypoint onEnter={loadMore}>
                      <Loader>
                        <div />
                        <div />
                      </Loader>
                    </Waypoint>
                  ) : null}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Menu>
  );
}

const Loader = styled.div`
  display: grid;
  gap: var(--unit);
  padding: var(--unit);

  div {
    height: 20px;
    width: 100%;
    ${shimmerAnimation}
  }
`;

const NotificationItemWrapper = styled.div`
  position: relative;
  padding: var(--unit);

  @media (hover) {
    &:hover {
      background: var(--contentBackgroundTint);
    }
  }
`;

const NotificationItemInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--fontSizeTiny);
  font-family: var(--primaryFont);
  color: var(--tertiaryTextColor);
`;

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${accessibilityOutline};
`;
