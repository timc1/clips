import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Menu(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M5.273 5a1.273 1.273 0 100 2.545h14.424a1.273 1.273 0 000-2.545H5.273zm0 5.727a1.273 1.273 0 100 2.546h14.424a1.273 1.273 0 100-2.546H5.273zm0 5.727a1.273 1.273 0 000 2.546h14.424a1.273 1.273 0 100-2.546H5.273z"
        fill={props.fill}
      />
    </Svg>
  );
}
