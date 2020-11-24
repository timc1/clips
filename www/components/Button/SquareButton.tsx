import styled from "@emotion/styled";
import { Button as ReakitButton } from "reakit/Button";
import { accessibilityOutline } from "www/globalStyles";

const SquareButton = styled(ReakitButton)`
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  background: var(--buttonBackgroundColorIdle);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1px var(--gridColor);
  cursor: pointer;

  &:active {
    background: var(--buttonBackgroundColorActive);
  }

  ${accessibilityOutline};
`;

export default SquareButton;
