import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function LightningBoltFilled(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M18.372 9.582a.692.692 0 00-.603-.351h-4.154V3.96c0-.263 0-.96-.692-.96a.693.693 0 00-.594.336L6.1 13.721a.692.692 0 00.593 1.048h4.154v5.539a.693.693 0 001.286.356l6.23-10.385a.691.691 0 00.01-.697z"
        fill={fill}
      />
    </Svg>
  );
}
