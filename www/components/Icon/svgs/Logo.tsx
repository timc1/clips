import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Logo(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg
      fill="transparent"
      size={props.size}
      style={props.style}
      viewBox="0 0 24 24"
    >
      <defs />
      <path
        stroke={fill}
        strokeWidth="2"
        d="M4 4h16v16H4zM8 19V9M7 9h10M16 9v7M15 15h-4M12 14v-2"
      />
    </Svg>
  );
}
