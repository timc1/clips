import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownUnderline(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M20 17H4v2h16v-2zM7 5v6c0 2.8 2.2 5 5 5s5-2.2 5-5V5h-2v6c0 1.6-1.3 3-3 3-1.6 0-3-1.4-3-3V5H7z"
        fill={fill}
      />
    </Svg>
  );
}
