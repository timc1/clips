import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";

type Size = "xsmall" | "small" | "medium" | "large";

type Props = {
  size?: Size;
  flex?: boolean;
  fullPage?: boolean;
  delay?: number;
  fill?: string;
};

const sizes = {
  xsmall: "14px",
  small: "16px",
  medium: "20px",
  large: "28px",
  default: "24px",
};

export default function Loading(props: Props) {
  const { delay } = props;
  const [isShowing, setShowing] = React.useState(!delay);
  const timeout = React.useRef(null);

  React.useEffect(() => {
    if (delay > 0) {
      timeout.current = setTimeout(() => {
        setShowing(true);
      }, delay);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [delay]);

  const size = props.size || "default";

  const Wrapper = props.fullPage
    ? FullPage
    : props.flex
    ? Flex
    : React.Fragment;

  if (!isShowing) {
    return null;
  }

  return (
    <Wrapper>
      <Container size={size} fill={props.fill} />
    </Wrapper>
  );
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div<{ size: string; fill?: string }>`
  --color: ${(props) => props.fill || "var(--tertiaryTextColor)"};
  border-radius: 50%;
  height: ${(props) => (props.size ? sizes[props.size] : sizes.default)};
  width: ${(props) => (props.size ? sizes[props.size] : sizes.default)};
  font-size: ${(props) =>
    props.size ? `calc(${sizes[props.size]} / 8)` : "3.5px"};
  position: relative;
  text-indent: -9999em;
  border-top: 1em solid var(--color);
  border-right: 1em solid var(--color);
  border-bottom: 1em solid var(--color);
  border-left: 1em solid rgba(0, 0, 0, 0);
  transform: translateZ(0);
  animation: ${spin} 0.6s infinite linear;

  &::after {
    content: "";
    border-radius: 50%;
    height: inherit;
    width: inherit;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const FullPage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
