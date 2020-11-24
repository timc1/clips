/** @jsx jsx */
import { css, jsx } from "@emotion/core";

type Props = {
  row?: boolean;
  justifyContent?: "space-between" | "center";
  alignItems?: "center";
  direction?: "row" | "column";
  children: React.ReactNode;
};

export default function Flex({
  direction,
  justifyContent,
  alignItems,
  ...rest
}: Props) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${direction};
        justify-content: ${justifyContent};
        align-items: ${alignItems};
      `}
      {...rest}
    />
  );
}
