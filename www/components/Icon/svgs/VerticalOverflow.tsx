import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function VerticalOverflow(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M11.628 8.256a1.628 1.628 0 100-3.256 1.628 1.628 0 000 3.256zM11.628 13.465a1.628 1.628 0 100-3.256 1.628 1.628 0 000 3.256zM11.628 19a1.628 1.628 0 100-3.256 1.628 1.628 0 000 3.256z"
        fill={props.fill}
      />
    </Svg>
  );
}
