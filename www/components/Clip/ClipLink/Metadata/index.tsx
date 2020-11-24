/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { TLinkMetadata } from "lib/types";
import Icon from "../../../Icon";

type Props = {
  metadata: TLinkMetadata;
};

export default function Metadata(props: Props) {
  const { metadata } = props;

  return (
    <LinkContainer>
      <A href={metadata.url} target="_blank" rel="noopener noreferrer">
        <Icon icon="markdown-link" size="small" />
        <span
          css={css`
            margin-left: var(--unit);
          `}
        >
          {metadata.title}
        </span>
      </A>
    </LinkContainer>
  );
}

const LinkContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const A = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  padding: var(--unit);
  padding-right: calc(var(--unit) * 4);
  width: 100%;
  box-shadow: 0 0 0 1px var(--textColor);
`;
