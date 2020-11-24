import styled from "@emotion/styled";
import * as React from "react";
import { ButtonProps } from "reakit/ts";
import Icon from "../Icon";
import SquareButton from "./SquareButton";

const OverflowButton = React.forwardRef(
  (props: ButtonProps, ref: React.MutableRefObject<any>) => (
    <StyledButton ref={ref} {...props}>
      <Icon icon="horizontal-overflow" fill="var(--textColor)" />
    </StyledButton>
  )
);

export default OverflowButton;

const StyledButton = styled(SquareButton)``;
