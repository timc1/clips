/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { fontWeights } from "lib/constants";
import * as React from "react";
import { Button as ReakitButton } from "reakit/Button";
import { accessibilityOutline } from "www/globalStyles";
import Icon from "../Icon";
import Loading from "../Loading";

type Props = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  showSuccess?: boolean;
  small?: boolean;
  flex?: boolean;
  noAnimation?: boolean;
  [k: string]: any;
};

export default function Button(props: Props) {
  const {
    onClick,
    type,
    children,
    isLoading,
    showSuccess,
    small,
    flex,
    noAnimation,
    ...rest
  } = props;

  return (
    <StyledButton
      onClick={onClick}
      css={css`
        ${props.small &&
        css`
          padding: calc(var(--unit) * 0.75);

          ${props.noAnimation &&
          css`
            transform: none !important;
          `}
        `}
      `}
      type={type || "button"}
      {...rest}
    >
      <Children flex={flex} shouldHide={isLoading || showSuccess}>
        {children}
      </Children>
      <Visibility shouldHide={!isLoading || showSuccess}>
        <Loading size="small" fill="var(--textColor)" />
      </Visibility>

      <Visibility shouldHide={!showSuccess}>
        <Icon icon="checkmark" fill="var(--textColor)" size="medium" />
      </Visibility>
    </StyledButton>
  );
}

const StyledButton = styled(ReakitButton)`
  position: relative;
  width: 100%;
  padding: calc(var(--unit) * 1.5);
  font-size: var(--fontSizeTiny);
  font-weight: ${fontWeights.medium};
  border: none;
  background: var(--contentBackground);
  color: var(--textColor);
  box-shadow: 0 0 0 1px var(--gridColor);
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  transform: translateY(0px) scale(1);
  transition: opacity 100ms linear, transition 250ms ease-out;

  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.98);
  }

  ${accessibilityOutline}

  &:disabled {
    opacity: 0.5;
  }
`;

const Children = styled.div<{ shouldHide: boolean; flex: boolean }>`
  color: inherit;
  opacity: ${(props) => (props.shouldHide ? 0 : 1)};
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;

  ${(props) =>
    props.flex &&
    css`
      display: flex;
      align-items: center;
    `}
`;

const Visibility = styled.div<{ shouldHide: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
    scale(${(props) => (props.shouldHide ? 0 : 1)});
  opacity: ${(props) => (props.shouldHide ? 0 : 1)};
  transition: transform 250ms var(--ease), opacity 100ms linear;
`;
