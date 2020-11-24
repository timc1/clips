import styled from "@emotion/styled";
import * as React from "react";
import { Button as ReakitButton } from "reakit/Button";
import { accessibilityOutline } from "www/globalStyles";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  [k: string]: any;
};

const UnstyledButton = React.forwardRef((props: Props, ref: any) => {
  return (
    <Button ref={ref} {...props}>
      {props.children}
    </Button>
  );
});

export default UnstyledButton;

const Button = styled(ReakitButton)`
  position: relative;
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  padding: 0;

  ${accessibilityOutline};
`;
