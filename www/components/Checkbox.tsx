import styled from "@emotion/styled";
import * as React from "react";
import { Checkbox as ReakitCheckbox, CheckboxProps } from "reakit/Checkbox";

type Props = { label: string };

export default function Checkbox(props: CheckboxProps & Props) {
  return (
    <Container>
      <StyledCheckbox {...props} />
      <Label htmlFor={props.id}>{props.label}</Label>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled(ReakitCheckbox)`
  margin: 0 var(--unit) 0 0;
`;

const Label = styled.label`
  font-family: var(--primaryFont);
  font-size: var(--fontSizeTiny);
`;
