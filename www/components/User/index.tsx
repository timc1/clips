import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { TUser } from "lib/types";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import { Waypoint } from "react-waypoint";
import { useSWRInfinite } from "swr";
import { shimmerAnimation } from "www/globalStyles";
import { client } from "www/lib/ApiClient";
import Article from "../Article";
import Flex from "../Flex";
import { useHackyForceUpdate } from "../HackyForceUpdate";
import Icon from "../Icon";
import TopBar from "../Layout/TopBar";
import OnboardingWelcome from "../Onboarding/Welcome";
import Portal from "../Portal";
import ScrollToTopPill from "../ScrollToTopPill";
import Spacer from "../Spacer";
import { P } from "../Typography";

type Props = {
  sessionUser?: TUser;
  user: TUser;
};

const PAGE_SIZE = 5;

export default function User(props: Props) {
  const { shouldRefetchArticles } = useHackyForceUpdate();

  const { data, error, size, setSize, mutate } = useSWRInfinite(
    (index) =>
      `/api/articles?username=${props.user.username}&page=${
        index + 1
      }&limit=${PAGE_SIZE}`,
    client.get,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  React.useEffect(() => {
    if (shouldRefetchArticles) {
      mutate();
    }
  }, [mutate, shouldRefetchArticles]);

  const articles = React.useMemo(
    () => (data ? data.map((data) => data.articles).flat() : []),
    [data]
  );
  const meta = data ? data[0].meta : {};
  // Logic from https://swr.vercel.app/examples/infinite-loading
  const isLoadingInitialData = !data && !error;
  const isFinished = articles.length >= meta.total;

  const router = useRouter();

  const scrollRef = React.useRef(null);

  return (
    <>
      <Head>
        {props.user && (
          <title>
            {props.user.firstName} ({props.user.username}) · Clips
          </title>
        )}
      </Head>
      <Wrapper>
        <div ref={scrollRef} />
        <Portal>
          <ScrollToTopPill scrollRef={scrollRef} />
        </Portal>
        <TopBarWrapper>
          <TopBar
            user={props.sessionUser}
            title={`${props.user.username}`}
            sticky
          />
        </TopBarWrapper>
        {articles.length ? (
          <ul>
            {articles.map((article) => {
              return (
                <li key={article.id}>
                  <Article
                    article={article}
                    router={router}
                    user={props.sessionUser}
                  />
                </li>
              );
            })}
          </ul>
        ) : null}
        {isLoadingInitialData ? null : (
          <>
            {isFinished ? null : (
              <Waypoint onEnter={() => setSize(size + 1)}>
                <div>
                  <Loading />
                </div>
              </Waypoint>
            )}
          </>
        )}
      </Wrapper>
      {!articles.length && !isLoadingInitialData ? (
        <Wrapper noShadow>
          {props.user?.username === props.sessionUser?.username ? (
            <>
              <Spacer spaces={10} />
              <OnboardingWelcome name={props.sessionUser.firstName} />
            </>
          ) : (
            <EmptyWrapper
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <Icon icon="lightning-bolt" size="large" />
              <Spacer />
              <P>No clips</P>
            </EmptyWrapper>
          )}
        </Wrapper>
      ) : null}
    </>
  );
}

function Loading() {
  return (
    <Loader>
      <Shimmer />
    </Loader>
  );
}

const Wrapper = styled.div<{ noShadow?: boolean }>`
  max-width: 100ch;
  width: 100%;
  margin: auto;
  ${(props) =>
    !props.noShadow &&
    css`
      box-shadow: 0 0 0 1px var(--gridColor);
    `}
`;

const TopBarWrapper = styled.div`
  padding: 0 var(--unit);
  position: sticky;
  top: 0;
  background: var(--contentBackground);
  box-shadow: 0 0 0 1px var(--gridColor);
  z-index: var(--depth1);
`;

const Shimmer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${shimmerAnimation};
  position: absolute;
`;

const Loader = styled.div`
  display: inline-block;
  width: 100%;
  padding-top: 25%;
  position: relative;
`;

const EmptyWrapper = styled(Flex)`
  min-height: calc(100vh - 40px); // 100 viewport height - 40px top bar
`;
