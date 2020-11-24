import styled from "@emotion/styled";
import { TIconSize } from "lib/types";

export type SvgProps = {
  fill?: string;
  size?: TIconSize;
  style?: Object;
};

export const Svg = styled.svg<{ size: TIconSize }>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  flex-shrink: 0;
`;
