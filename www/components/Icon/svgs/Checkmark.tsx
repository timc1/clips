import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function ExclamationMark(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <defs />
      <path
        fill={fill}
        d="M9.994 18a1 1 0 01-.707-.293l-4-4A1 1 0 016.7 12.293l3.255 3.255L18.25 6.33a1 1 0 011.487 1.338l-9 10a1.002 1.002 0 01-.717.331h-.026z"
      />
    </Svg>
  );
}
