import styled from "@emotion/styled";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Floating(props: Props) {
  return <Container {...props} />;
}

const Container = styled.div`
  padding: var(--unit);
  box-shadow: 0 0 0 1px var(--gridColor);
  max-width: 200px;
  width: 100%;
  background: var(--contentBackground);
`;
