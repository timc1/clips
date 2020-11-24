import styled from "@emotion/styled";
import { TArticle, TUser } from "lib/types";
import { NextRouter } from "next/router";
import * as React from "react";
import { shimmerAnimation } from "www/globalStyles";
import { useArticleClipsRequest } from "www/requests/hooks/useArticleClipsRequest";
import Clip from "../Clip";
import { P } from "../Typography";

type Props = {
  article: TArticle;
  router: NextRouter;
  user?: TUser;
};

const dateOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

function Article(props: Props) {
  const date = React.useMemo(
    () =>
      new Date(props.article.createdAt).toLocaleDateString(
        "en-US",
        dateOptions
      ),
    [props.article.createdAt]
  );

  const { loading, clips } = useArticleClipsRequest({
    articleId: props.article.id,
  });

  if (!loading && !clips.length) {
    return null;
  }

  return (
    <>
      <DateWrapper>
        <DateText>{date}</DateText>
      </DateWrapper>
      {loading ? (
        <Ul>
          {Array.from(Array(props.article.clips.length)).map((_, index) => (
            <Li key={index}>
              <ClipWrapper>
                <Loader />
              </ClipWrapper>
            </Li>
          ))}
        </Ul>
      ) : null}
      {clips && (
        <Ul>
          {clips.map((clip) => {
            return (
              <Li key={clip.id}>
                <ClipWrapper>
                  <Clip
                    id={clip.id}
                    clip={clip}
                    router={props.router}
                    user={props.user}
                  />
                </ClipWrapper>
              </Li>
            );
          })}
        </Ul>
      )}
    </>
  );
}

export default React.memo(Article, (prevProps, nextProps) => {
  if (
    prevProps.router.query.page === nextProps.router.query.page &&
    (prevProps.user && prevProps.user.id) ===
      (nextProps.user && nextProps.user.id)
  ) {
    return true;
  }

  return false;
});

const DateText = styled(P)`
  font-size: var(--fontSizeSoTiny);
  line-height: 1;
  font-weight: var(--fontWeightMedium);
  text-transform: uppercase;
`;

const DateWrapper = styled.div`
  padding: calc(var(--unit) * 1.5) var(--unit);
  border-top: 1px solid var(--gridColor);
  border-bottom: 1px solid var(--gridColor);
  position: relative;
  z-index: 1;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--gridColor);
  }

  &::before {
    top: 4px;
  }

  &::after {
    bottom: 4px;
  }
`;

const Li = styled.li`
  position: relative;
  display: inline-block;
  padding-top: 100%;
  max-height: 500px;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--gridColor);
`;

const ClipWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Ul = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--contentBackgroundTint);

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Loader = styled.div`
  ${shimmerAnimation};
  display: flex;
  padding-top: 100%;
`;
