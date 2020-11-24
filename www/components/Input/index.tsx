/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";
import { Input as ReakitInput, InputProps } from "reakit/Input";
import { shimmerAnimation } from "www/globalStyles";
import Icon from "../Icon";
import Tooltip from "../Tooltip";

type Props = InputProps & {
  error?: any;
  isPasswordShowing?: boolean;
  setPasswordShowing?: () => void;
  noBackground?: boolean;
  isLoading?: boolean;
};

export default function Input(props: Props) {
  // camelCase prevents error from getting spread onto the <input /> rendered.
  const {
    error: hasError,
    type,
    isPasswordShowing,
    setPasswordShowing,
    autoFocus,
    noBackground,
    isLoading,
    ...rest
  } = props;

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const input = inputRef.current;
    if (autoFocus) {
      input.focus();
    }
  }, [autoFocus]);

  const paddingRight = React.useMemo(() => {
    const pr = [type === "password", !!hasError].filter((i) => i).length * 24;
    return pr ? `calc(${pr}px + var(--unit))` : undefined;
  }, [hasError, type]);

  return (
    <StyledInputContainer>
      <StyledInput
        ref={inputRef}
        {...rest}
        type={isPasswordShowing && type === "password" ? "text" : type}
        noBackground={noBackground}
        css={css`
          padding-right: ${paddingRight};
          ${isLoading && !noBackground && shimmerAnimation}
        `}
      ></StyledInput>
      <span />
      <IconsContainer>
        {!!hasError && (
          <Tooltip label={hasError} aria-label={hasError}>
            <span
              css={css`
                display: flex;
              `}
            >
              <Icon
                icon="exclamation-mark-in-circle"
                fill="var(--errorColor)"
                title={hasError}
              />
            </span>
          </Tooltip>
        )}
        {props.type === "password" && (
          <Icon
            icon={props.isPasswordShowing ? "eye-visible" : "eye-invisible"}
            fill="var(--iconColor)"
            onClick={setPasswordShowing}
            tabIndex={-1}
          />
        )}
      </IconsContainer>
    </StyledInputContainer>
  );
}

Input.displayName = "Input";

const StyledInputContainer = styled.div`
  position: relative;
`;

const StyledInput = styled(ReakitInput)<{ noBackground: boolean }>`
  font-family: var(--primaryFont);
  width: 100%;
  font-size: var(--fontSizeSmall);
  padding: calc(var(--unit) * 1.5);
  position: relative;
  background: none;
  border: none;
  border-radius: inherit;
  line-height: 1.1;
  z-index: 1;
  transition: background 100ms var(--ease);
  outline: none;

  &::placeholder {
    color: var(--inputPlaceholderColor);
  }

  + span {
    &::before {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: ${(props) =>
        props.noBackground ? "transparent" : "var(--inputBackgroundColorIdle)"};
      backdrop-filter: ${(props) =>
        props.noBackground ? "none" : "blur(8px)"};
    }
  }

  ${(props) =>
    !props.noBackground &&
    css`
      &:focus {
        + span::before {
          background: var(--inputBackgroundColorActive);
        }
      }
    `}
`;

const IconsContainer = styled.div`
  position: absolute;
  top: 0;
  right: var(--unit);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1;
`;
