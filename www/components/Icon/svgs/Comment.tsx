import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Comment(props: SvgProps) {
  const fill = props.fill || "var(--iconColor)";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path d="M7.47 5A2.484 2.484 0 005 7.47v5.765a2.484 2.484 0 002.47 2.47h.824v2.471a.824.824 0 001.36.626l3.61-3.096h4.089a2.484 2.484 0 002.47-2.47V7.47A2.483 2.483 0 0017.354 5H7.47zm0 1.647h9.883c.47 0 .823.353.823.824v5.764c0 .47-.353.824-.823.824H12.96a.824.824 0 00-.535.198l-2.484 2.13v-1.505a.824.824 0 00-.823-.823H7.47a.804.804 0 01-.824-.824V7.471c0-.47.353-.824.824-.824z" />
    </Svg>
  );
}
