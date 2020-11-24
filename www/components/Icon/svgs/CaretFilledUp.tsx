import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function CaretFilledUp(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M13.356 7.353a1.214 1.214 0 00-1.712 0l-7.285 7.285a1.214 1.214 0 00.85 2.076h14.57a1.214 1.214 0 00.862-2.076l-7.285-7.285z"
        fill={props.fill}
      />
    </Svg>
  );
}
