import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownH1(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <g clipPath="url(#clip0)" fill={fill}>
        <path d="M19.866 6.182h-1.692l-2.44 1.567v1.63l2.296-1.467h.057V16h1.779V6.182zM4.22 18h2.24v-5.252h5.728V18h2.246V5.636h-2.246v5.234H6.46V5.636H4.22V18zm0 21h2.24v-5.252h5.728V39h2.246V26.636h-2.246v5.234H6.46v-5.234H4.22V39z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </Svg>
  );
}
