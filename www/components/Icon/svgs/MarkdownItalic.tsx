import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownItalic(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M17.063 5.913c0 .504-.41.913-.913.913h-1.198l-4.825 10.348h.954a.913.913 0 110 1.826H6.913a.914.914 0 010-1.826h1.198l4.825-10.348h-.954a.913.913 0 110-1.826h4.168c.504 0 .913.41.913.913z"
        fill={fill}
      />
    </Svg>
  );
}
