import { css } from "@emotion/core";
import styled from "@emotion/styled";
import Link, { LinkProps } from "next/link";
import * as React from "react";
import { ButtonProps } from "reakit/ts";
import { accessibilityOutline } from "www/globalStyles";
import UnstyledButton from "../Button/UnstyledButton";
import Loading from "../Loading";

type TMenuLink = LinkProps & {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

type TButtonLink = ButtonProps & {
  text: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

type Props = TMenuLink | TButtonLink;

export default function MenuItem(props: Props) {
  if ((props as TMenuLink).href) {
    const {
      href,
      onClick,
      text,
      isLoading,
      icon,
      ...rest
    } = props as TMenuLink;
    return (
      <Wrapper onClick={onClick}>
        <Link href={href} {...rest}>
          <MenuLink href={href as string}>
            {text}
            {isLoading ? <Loading size="xsmall" /> : icon ? icon : null}
          </MenuLink>
        </Link>
      </Wrapper>
    );
  }

  if ((props as TButtonLink).onClick) {
    const { onClick, text, isLoading, icon, ...rest } = props as TButtonLink;
    return (
      <Wrapper>
        <MenuButton onClick={onClick} {...rest}>
          {text}
          {isLoading ? <Loading size="xsmall" /> : icon ? icon : null}
        </MenuButton>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  min-width: 120px;
`;

const shared = css`
  position: relative;
  height: 28px;
  padding: 0 calc(var(--unit) * 2);
  font-size: var(--fontSizeTiny);
  font-family: var(--primaryFont);
  text-decoration: none;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: start;
  line-height: 1;

  @media (hover) {
    &:hover {
      background: var(--buttonBackgroundColorHover);
    }
  }

  &:active {
    background: var(--buttonBackgroundColorActive);
  }

  ${accessibilityOutline};
`;

const MenuLink = styled.a`
  text-decoration: none;
  ${shared};
`;

const MenuButton = styled(UnstyledButton)`
  ${shared};
`;
