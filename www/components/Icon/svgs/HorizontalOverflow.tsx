import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function HorizontalOverflow(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M8.256 12.372a1.628 1.628 0 10-3.256 0 1.628 1.628 0 003.256 0zM13.465 12.372a1.628 1.628 0 10-3.256 0 1.628 1.628 0 003.256 0zM19 12.372a1.628 1.628 0 10-3.256 0 1.628 1.628 0 003.256 0z"
        fill={fill}
      />
    </Svg>
  );
}
