import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownStrikethrough(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M16.397 6.4l-1.063 1.084c-1.893-1.858-5.42-.913-5.42 1.712 0 .364.056.663.168.927.095.236.173.417.367.588H8.704a3.86 3.86 0 01-.307-1.515c0-4.112 5.23-5.514 8-2.795zM7.641 16.564l1.338-.714c1.397 2.616 5.924 1.965 5.924-1.033 0-.34-.05-.624-.118-.808a2.076 2.076 0 00-.132-.234l1.64-.003c.085.322.127.67.127 1.045 0 4.7-6.69 5.663-8.78 1.747zM4 12.987l.759-1.518H20.69l-.758 1.518H4z"
        fill={fill}
      />
    </Svg>
  );
}
