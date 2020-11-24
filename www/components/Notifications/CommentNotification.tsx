import styled from "@emotion/styled";
import * as React from "react";
import Icon from "../Icon";
import { P } from "../Typography";

export default function CommentNotification({ actor }: { actor: string }) {
  return (
    <CommentComponentWrapper>
      <Icon icon="comment" size="small" />
      <P size="tiny">{actor} commented on a clip</P>
    </CommentComponentWrapper>
  );
}

const CommentComponentWrapper = styled.div`
  display: grid;
  align-items: start;
  gap: var(--unit);
  grid-template-columns: max-content 1fr;
  margin-right: var(--unit);
`;
