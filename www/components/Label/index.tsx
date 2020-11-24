import styled from "@emotion/styled";
import { fontWeights } from "lib/constants";
import * as React from "react";

type Props = {
  htmlFor: string;
  children: React.ReactNode;
};

export default function Label(props: Props) {
  return <StyledLabel htmlFor={props.htmlFor}>{props.children}</StyledLabel>;
}

const StyledLabel = styled.label`
  font-weight: ${fontWeights.regular};
  font-family: var(--primaryFont);
`;
