import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { fontWeights, fontSizes } from "lib/constants";
import { TFontWeight, TFontSize } from "lib/types";

type SharedProps = {
  size?: TFontSize;
  weight?: TFontWeight;
  color?: string;
  mono?: boolean;
  marginLeft?: string;
};

function sharedAttributes(props: SharedProps) {
  return css`
    ${props.size &&
    css`
      font-size: ${fontSizes[props.size]};
    `};

    ${props.color &&
    css`
      color: ${props.color};
    `};

    ${props.marginLeft &&
    css`
      margin-left: ${props.marginLeft};
    `};

    font-weight: ${props.weight
      ? `${fontWeights[props.weight]}`
      : "var(--fontWeightRegular)"};

    font-family: ${props.mono ? "mono" : `var(--primaryFont)`};
  `;
}

export const H1 = styled.h1<SharedProps>`
  font-size: var(--fontSizeLarge);
  ${sharedAttributes}
`;

export const H2 = styled.h2`
  font-size: var(--fontSizeMedium);
  ${sharedAttributes}
`;

export const H3 = styled.h3`
  font-size: var(--fontSizeSmall);
  ${sharedAttributes}
`;

export const P = styled.p`
  font-size: var(--fontSizeSmall);
  line-height: 1.4;
  ${sharedAttributes}
`;

export const Li = styled.li`
  font-size: var(--fontSizeSmall);
  ${sharedAttributes}
`;

export const Span = styled.span`
  font-size: var(--fontSizeSmall);
  ${sharedAttributes}
`;
