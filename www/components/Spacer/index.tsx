import styled from "@emotion/styled";
import * as React from "react";

type Props = {
  spaces?: number;
};

export default function Spacer(props: Props) {
  return <Container spaces={props.spaces}></Container>;
}

const Container = styled.div<{ spaces: number }>`
  height: ${(props) =>
    props.spaces > 0 ? `calc(${props.spaces} * var(--unit))` : "var(--unit)"};
`;
