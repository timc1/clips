/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { AVATAR_URL } from "lib/constants";
import { TUser } from "lib/types";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { REDIRECT_TO_POST_AUTH, useSession } from "www/hooks/useSession";
import { isSSR } from "www/lib/helpers";
import { logout } from "www/requests/session";
import Floating from "../Floating";
import FloatingMenu from "../FloatingMenu";
import Icon from "../Icon";
import { useKeyboardShortcuts } from "../KeyboardShortcuts";
import Menu from "../Menu";
import MenuItem from "../Menu/MenuItem";
import Notifications from "../Notifications";
import { TColorTheme, useTheme } from "../Theme";
import { H1 } from "../Typography";
import UserImage from "../UserImage";

type Props = {
  title: string;
  user?: TUser;
  sticky?: boolean;
};

function Checkmark() {
  return <Icon icon="checkmark" size="small" />;
}

export default function TopBar(props: Props) {
  const session = useSession(
    props.user
      ? {
          initialData: { data: props.user },
        }
      : undefined
  );

  const [isLoggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = React.useCallback(async () => {
    setLoggingOut(true);
    await logout();
    window.location.reload();
  }, []);

  const router = useRouter();

  const createThemeClickHandler = React.useCallback(
    (onClick) => () => {
      onClick();
    },
    []
  );

  const { colorMode, setColorMode } = useTheme();

  const handleClickTheme = React.useCallback(
    (theme: TColorTheme, onRequestClose) => () => {
      setColorMode(theme);
      onRequestClose();
    },
    [setColorMode]
  );

  const ThemeMenuItem = (
    <FloatingMenu
      placement="bottom-end"
      body={({ onRequestClose }) => {
        return (
          <Floating>
            <Menu>
              <MenuItem
                onClick={handleClickTheme(undefined, onRequestClose)}
                text="System"
                isLoading={isLoggingOut}
                icon={!colorMode && <Checkmark />}
              />
              <MenuItem
                onClick={handleClickTheme("light", onRequestClose)}
                text="Light"
                isLoading={isLoggingOut}
                icon={colorMode === "light" && <Checkmark />}
              />
              <MenuItem
                onClick={handleClickTheme("dark", onRequestClose)}
                text="Dark"
                isLoading={isLoggingOut}
                icon={colorMode === "dark" && <Checkmark />}
              />
            </Menu>
          </Floating>
        );
      }}
    >
      {({ ref, onClick, isShowing, ...rest }) => (
        <div ref={ref}>
          <MenuItem
            text="Theme"
            onClick={createThemeClickHandler(onClick)}
            icon={<Icon icon="caret-right" size="small" />}
          />
        </div>
      )}
    </FloatingMenu>
  );

  const onClickSignIn = React.useCallback(() => {
    window.localStorage.setItem(
      REDIRECT_TO_POST_AUTH,
      window.location.pathname
    );
  }, []);

  const { toggleShowAppLayerClipboardShowing } = useKeyboardShortcuts();

  const homeLink = session.user ? `/${session.user.username}` : "/";

  return (
    <StyledTopBar isSticky={props.sticky}>
      <TopLeftWrapper>
        <LogoWrapper>
          <Link href={homeLink}>
            <StyledLink href={homeLink} />
          </Link>
          <Icon icon="logo" />
        </LogoWrapper>
        <H1 size="small" weight="bold">
          {props.title}
        </H1>
      </TopLeftWrapper>
      <nav>
        <ul
          css={css`
            display: grid;
            grid-auto-flow: column;
            align-items: center;
            gap: var(--unit);
          `}
        >
          <>
            {session.user && (
              <>
                <Li>
                  <Icon
                    icon="command"
                    onClick={toggleShowAppLayerClipboardShowing}
                    fill="var(--secondaryTextColor)"
                  />
                </Li>
                <Li>
                  <Notifications
                    userId={session.user.id}
                    username={session.user.username}
                    router={router}
                  />
                </Li>
              </>
            )}
            {isSSR() ? null : (
              <Li>
                <FloatingMenu
                  placement="bottom-end"
                  body={({ onRequestClose }) => {
                    return (
                      <Floating>
                        <Menu>
                          {session.user ? (
                            <>
                              <MenuItem
                                href={`/${session.user.username}`}
                                text={session.user.username}
                                onClick={onRequestClose}
                              />
                              <Divider />
                            </>
                          ) : (
                            // not using LoginLink because we want the style of a MenuItem
                            <MenuItem
                              href={`/login`}
                              text="Login"
                              onClick={onClickSignIn}
                            />
                          )}

                          {ThemeMenuItem}
                          {session.user && (
                            <>
                              <MenuItem
                                href={`/settings`}
                                text="Settings"
                                onClick={onRequestClose}
                              />
                              <Divider />
                              <MenuItem
                                onClick={handleLogout}
                                text="Log out"
                                isLoading={isLoggingOut}
                              />
                            </>
                          )}
                        </Menu>
                      </Floating>
                    );
                  }}
                >
                  {({ ref, onClick, isShowing, ...rest }) => (
                    <UserImage
                      ref={ref}
                      onClick={onClick}
                      size="tiny"
                      src={
                        session.user?.profileImage &&
                        AVATAR_URL + session.user.profileImage
                      }
                      alt="User image"
                    />
                  )}
                </FloatingMenu>
              </Li>
            )}
          </>
        </ul>
      </nav>
    </StyledTopBar>
  );
}

const TopLeftWrapper = styled.div`
  display: grid;
  align-items: center;
  gap: var(--unit);
  grid-auto-flow: column;
  grid-auto-column: max-content;
`;

const StyledTopBar = styled.header<{ isSticky: boolean }>`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${(props) =>
    props.isSticky &&
    css`
      position: sticky;
      top: 0;
      background: var(--topBarBackground);
      backdrop-filter: blur(8px);
      z-index: 1;
    `}
`;

const Li = styled.li`
  display: inherit;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  background: var(--dividerColor);
`;

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
`;

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
