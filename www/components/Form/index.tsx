import styled from "@emotion/styled";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  onSubmit: (values: { [k: string]: any }) => void;
};

export default function Form(props: Props) {
  return <StyledForm onSubmit={props.onSubmit}>{props.children}</StyledForm>;
}

const StyledForm = styled.form`
  display: grid;
  grid-gap: var(--unit);
`;
