import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownH2(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <g clipPath="url(#clip0)" fill={fill}>
        <path d="M15.582 13h4.487v-.99h-2.851v-.046l1.128-1.147c1.272-1.22 1.624-1.815 1.624-2.554 0-1.096-.892-1.898-2.209-1.898-1.297 0-2.218.805-2.218 2.049h1.129c0-.668.421-1.087 1.073-1.087.624 0 1.087.38 1.087.997 0 .547-.332.937-.978 1.592l-2.272 2.227V13zM4.22 18h2.24v-5.252h5.728V18h2.246V5.636h-2.246v5.234H6.46V5.636H4.22V18zm0 21h2.24v-5.252h5.728V39h2.246V26.636h-2.246v5.234H6.46v-5.234H4.22V39z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </Svg>
  );
}
