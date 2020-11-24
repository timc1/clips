import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function ExclamationMark(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <defs />
      <path
        fill={fill}
        d="M13.265 18.628a1.372 1.372 0 11-2.745 0 1.372 1.372 0 012.745 0zM13.777 5.825a2.052 2.052 0 00-.413-1.059c-.35-.46-.884-.767-1.472-.766-.57 0-1.09.288-1.44.725-.247.309-.41.692-.445 1.1a2.03 2.03 0 000 .33l.78 8.94a1.108 1.108 0 002.21 0l.78-8.941a2.02 2.02 0 000-.33z"
      />
    </Svg>
  );
}
