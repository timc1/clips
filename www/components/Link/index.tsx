/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { fontWeights, fontSizes } from "lib/constants";
import type { TIcon, TFontWeight, TFontSize } from "lib/types";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import { accessibilityOutline } from "www/globalStyles";
import Icon from "../Icon";

type Shared = {
  fullWidth?: boolean;
  withBackgroundDimOnHover?: boolean;
  round?: boolean;
  noTint?: boolean;
  icon?: TIcon;
  weight?: TFontWeight;
  size?: TFontSize;
  title?: string;
  styles?: Object;
  replace?: boolean;
};

export type LinkProps =
  | ({
      children?: React.ReactNode;
    } & NextLinkProps &
      Shared)
  | ({
      children?: React.ReactNode;
      onClick: () => void;
      disabled?: boolean;
    } & Shared);

const Link = React.forwardRef((props: LinkProps, ref) => {
  // @ts-ignore
  const { href, as, onClick, disabled, icon, replace, ...rest } = props;

  const IconComponent = icon && <Icon icon={icon} />;

  if (href) {
    return (
      <NextLink href={href} as={as || href} scroll={false} replace={replace}>
        {/* 
        We explicity use href={as} because Next.js's `href` is the route
        that is specified under /pages. So the `href` would be /user/[id].tsx
        but the `as` would be /user/sharky – so in the actual <a> tag, we want
        the `href` to be the `as` 🙃 

        // @ts-ignore */}
        <A ref={ref} href={as || href} hasIcon={!!icon} css={props.styles} {...rest}>
          {IconComponent}
          <LinkChildren>{props.children}</LinkChildren>
        </A>
      </NextLink>
    );
  } else if (onClick) {
    return (
      <Button
        // @ts-ignore
        ref={ref}
        onClick={onClick}
        type="button"
        disabled={disabled}
        hasIcon={!!icon}
        // @ts-ignore
        css={props.styles}
        {...rest}
      >
        {IconComponent}
        <LinkChildren>{props.children}</LinkChildren>
      </Button>
    );
  }

  return null;
});

export default Link;

const shared = (props: {
  fullWidth?: boolean;
  withBackgroundDimOnHover?: boolean;
  round?: boolean;
  noTint?: boolean;
  weight?: TFontWeight;
  hasIcon: boolean;
  size?: TFontSize;
  padding?: string;
}) => css`
  display: inline-flex;
  align-items: center;
  color: var(--textColor);
  transition: color 100ms linear;
  font-size: var(--fontSizeTiny);
  font-weight: ${fontWeights.regular};
  cursor: pointer;
  padding: calc(var(--unit) * 0.5);
  transition: background 200ms var(--ease);

  ${
    props.size &&
    css`
      font-size: ${fontSizes[props.size]};
    `
  }

  ${
    props.hasIcon &&
    css`
      padding-right: var(--unit);
    `
  }

  ${
    props.fullWidth &&
    css`
      width: 100%;
      display: block;
      text-align: start;
    `
  }

  @media (hover) {
    &:hover {
      color: var(--tertiaryTextColor);

      ${
        props.withBackgroundDimOnHover &&
        css`
          background: var(--linkBackgroundColorHover);
        `
      }
    }
  }

  ${
    props.withBackgroundDimOnHover &&
    css`
      &:active {
        background: var(--linkBackgroundColorActive);
      }
    `
  }

  ${
    props.round &&
    css`
      border-radius: 50%;

      // accessibilityHighlight border-radius override
      &::after {
        border-radius: 50% !important;
      }
    `
  }

  ${
    props.noTint &&
    css`
      color: unset;
    `
  }

  ${
    props.weight &&
    css`
      font-weight: ${fontWeights[props.weight]};
    `
  }

  ${
    props.padding &&
    css`
      padding: ${props.padding};
    `
  }
`;

const A = styled.a`
  position: relative;
  text-decoration: none;
  font-family: var(--primaryFont);
  ${shared};
  ${accessibilityOutline};
`;

const Button = styled.button`
  position: relative;
  padding: none;
  border: none;
  background: none;
  line-height: 1;
  ${shared}
  ${accessibilityOutline}
`;

const LinkChildren = styled.span`
  color: inherit;
  display: inline-flex;
  vertical-align: middle;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  width: inherit;
`;
