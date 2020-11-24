import { css } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";

type Props = {
  horizontal?: number;
  vertical?: number;
  children: React.ReactNode;
};

export default function Displace(props: Props) {
  return (
    <Container horizontal={props.horizontal} vertical={props.vertical}>
      {props.children}
    </Container>
  );
}

const Container = styled.div<Props>`
  display: flex;
  ${(props) =>
    (props.horizontal || props.vertical) &&
    css`
      transform: translate(
        calc(${props.horizontal || 0} * var(--unit)),
        calc(${props.vertical || 0} * var(--unit))
      );
    `}
`;
