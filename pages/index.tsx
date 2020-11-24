/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { any } from "@hapi/joi";
import { TUser } from "lib/types";
import Router from "next/router";
import * as React from "react";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import Button from "www/components/Button";
import Flex from "www/components/Flex";
import LandingPageDemo from "www/components/LandingPage/Demo";
import PageLayout from "www/components/Layout/PageLayout";
import TopBar from "www/components/Layout/TopBar";
import Spacer from "www/components/Spacer";
import { useTheme } from "www/components/Theme";
import { H1, H2, P } from "www/components/Typography";
import useIsomorphicLayoutEffect from "www/hooks/useIsomorphicLayoutEffect";
import { useSession } from "www/hooks/useSession";
import { anyHover, isSSR } from "www/lib/helpers";

type Props = {
  user?: TUser;
};

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export default function Index(props: Props) {
  const session = useSession(
    props.user
      ? {
          initialData: { data: props.user },
        }
      : undefined
  );

  React.useEffect(() => {
    if (session.user) {
      Router.replace(`/${session.user.username}`);
    }
  }, [session.user]);

  const handleLoginClick = React.useCallback(() => {
    Router.push("/login");
  }, []);

  const theme = useTheme();

  const [systemTheme, setSystemTheme] = React.useState("");

  useIsomorphicLayoutEffect(() => {
    const theme = window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
      ? "dark"
      : "light";

    setSystemTheme(theme);

    const handleThemeChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);

    mediaQuery.addListener(handleThemeChange);

    return () => {
      mediaQuery.removeListener(handleThemeChange);
    };
  }, []);

  const actualTheme = theme.colorMode ? theme.colorMode : systemTheme;

  const assets =
    actualTheme === "light"
      ? {
          shareLinkImage:
            "https://user-images.githubusercontent.com/12195101/98875076-7ccdb280-2449-11eb-83bd-17417ca81541.jpg",
          notesImage:
            "https://user-images.githubusercontent.com/12195101/98875313-f36ab000-2449-11eb-9af2-d5f6754160e2.jpg",
          notificationsImage:
            "https://user-images.githubusercontent.com/12195101/98875789-ec906d00-244a-11eb-8537-eb0b956c3d1a.jpg",
          menubarApp:
            "https://shimmer-assets.s3-us-west-1.amazonaws.com/macapp-light.mp4",
        }
      : {
          shareLinkImage:
            "https://user-images.githubusercontent.com/12195101/98879312-3ed58c00-2453-11eb-8571-1e7542428ce7.jpg",
          notesImage:
            "https://user-images.githubusercontent.com/12195101/98879345-4dbc3e80-2453-11eb-9e9b-401e403ddc55.jpg",
          notificationsImage:
            "https://user-images.githubusercontent.com/12195101/98879361-5c0a5a80-2453-11eb-80fc-e7bf29fbb100.jpg",
          menubarApp:
            "https://shimmer-assets.s3-us-west-1.amazonaws.com/macapp-dark.mp4",
        };

  return (
    <>
      <TopBar title="" />
      <Wrapper>
        <H1 weight="bold">Clips</H1>
        <Spacer />
        <P size="medium" color="var(--secondaryTextColor)">
          Home for interesting thoughts, ideas, and discoveries.
        </P>
        <Spacer spaces={6} />
        <LandingPageDemo />
        <Section>
          <div>
            <H2 weight="bold">Shareable links</H2>
            <Spacer />
            <P size="tiny" color="var(--secondaryTextColor)">
              Keep clips as a reference for yourself, share with specific
              people, or share it with everyone.
            </P>
          </div>
          <div>
            <Img
              src={assets.shareLinkImage}
              height="954"
              width="1196"
              loading="lazy"
            />
          </div>
        </Section>
        <Section>
          <div>
            <H2 weight="bold">Notes</H2>
            <Spacer />
            <P size="tiny" color="var(--secondaryTextColor)">
              Drop a comment or two to add some more context and spark
              discussion.
            </P>
          </div>
          <div>
            <Img
              src={assets.notesImage}
              height="454"
              width="1306"
              loading="lazy"
            />
          </div>
        </Section>
        <Section>
          <div>
            <H2 weight="bold">Staying in touch</H2>
            <Spacer />
            <P size="tiny" color="var(--secondaryTextColor)">
              Keep up to date with a simple set of notifications – clip
              invitations, comments, and more.
            </P>
          </div>
          <div>
            <Img
              src={assets.notificationsImage}
              height="472"
              width="798"
              loading="lazy"
            />
          </div>
        </Section>
        <Section>
          <div
            css={css`
              grid-column: 1 / -1;
              text-align: center;
            `}
          >
            <H2 weight="bold">macOS menubar app</H2>
            <Spacer />
            <P size="tiny" color="var(--secondaryTextColor)">
              Coming soon, a beautiful macOS menubar app to pair alongside the
              site.
            </P>
            <Spacer spaces={2} />
            <video
              css={css`
                max-width: 400px;
                width: 100%;
              `}
              autoPlay={isSSR() ? true : anyHover()}
              loop
              muted
              key={assets.menubarApp}
            >
              <source src={assets.menubarApp} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </Section>
        <Flex justifyContent="center">
          <Button
            onClick={handleLoginClick}
            css={css`
              width: max-content;
            `}
          >
            Let's go{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </Button>
        </Flex>
        <Footer>
          <P size="tiny" color="var(--secondaryTextColor)">
            Made in NYC with{" "}
            <span role="img" aria-label="heart">
              {actualTheme === "light" ? "🖤" : "🤍"}
            </span>{" "}
            <a href="https://timcchang.com">@timcchang</a>
          </P>
        </Footer>
      </Wrapper>
    </>
  );
}

Index.Layout = PageLayout;

const Wrapper = styled.div`
  margin-top: 100px;

  @media (max-width: 600px) {
    margin-top: 40px;
  }
`;

const Section = styled.section`
  margin: calc(var(--unit) * 6) 0;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  gap: calc(var(--unit) * 2);
  box-shadow: 0 0 0 1px var(--gridColor);
  padding: calc(var(--unit) * 2);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
`;

const Footer = styled.footer`
  margin: 100px 0 40px 0;
`;

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = await getCurrentUser(req);

  if (user) {
    res.setHeader("location", `/${user.username}`);
    res.statusCode = 302;
  }

  return {
    props: {},
  };
});
