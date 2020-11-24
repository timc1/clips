import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Command(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4 8.8h3.2V7.2a3.2 3.2 0 113.2 3.2h-1.6v3.2h1.6a3.2 3.2 0 11-3.2 3.2v-1.6h-3.2v1.6a3.2 3.2 0 11-3.2-3.2h1.6v-3.2H7.2a3.2 3.2 0 113.2-3.2v1.6zm0 1.6v3.2h3.2v-3.2h-3.2zm4.8 4.8v1.6a1.6 1.6 0 101.6-1.6h-1.6zm-6.4 0H7.2a1.6 1.6 0 101.6 1.6v-1.6zm6.4-6.4h1.6a1.6 1.6 0 10-1.6-1.6v1.6zm-6.4 0V7.2a1.6 1.6 0 10-1.6 1.6h1.6z"
        fill={fill}
      />
    </Svg>
  );
}
