import { css } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";

export type Props = {
  children: React.ReactNode;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  inline?: boolean;
};

export default function Padding(props: Props) {
  const { children, ...rest } = props;
  return <StyledPadding {...rest}>{children}</StyledPadding>;
}

const defaultPadding = "var(--unit)";
const StyledPadding = styled.div<Props>`
  position: relative;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;

  ${(props) =>
    props.inline &&
    css`
      display: inline;
    `}

  ${(props) =>
    props.top &&
    css`
      padding-top: calc(${props.top} * ${defaultPadding});
    `}

  ${(props) =>
    props.left &&
    css`
      padding-left: calc(${props.left} * ${defaultPadding});
    `}

  ${(props) =>
    props.right &&
    css`
      padding-right: calc(${props.right} * ${defaultPadding});
    `}


  ${(props) =>
    props.bottom &&
    css`
      padding-bottom: calc(${props.bottom} * ${defaultPadding});
    `}
`;
