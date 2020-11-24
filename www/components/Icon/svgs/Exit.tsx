import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Exit(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M16.543 16.995a.454.454 0 01-.323-.131L7.135 7.779a.456.456 0 11.645-.645l9.085 9.085a.455.455 0 01-.322.776z"
        fill={fill}
        stroke={fill}
        strokeWidth=".5"
      />
      <path
        d="M7.457 16.995a.453.453 0 01-.323-.776l9.085-9.085a.456.456 0 11.645.645L7.78 16.864a.454.454 0 01-.322.131z"
        fill={fill}
        stroke={fill}
        strokeWidth=".5"
      />
    </Svg>
  );
}
