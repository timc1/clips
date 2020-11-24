/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { P } from "../Typography";

type Props = {
  text: string;
};

export default function ClipHeader(props: Props) {
  return (
    <P
      color="var(--tertiaryTextColor)"
      weight="medium"
      size="tiny"
      css={css`
        cursor: default;
        display: inline-block;
      `}
    >
      {props.text}
    </P>
  );
}
