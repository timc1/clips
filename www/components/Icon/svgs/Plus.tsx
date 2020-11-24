import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Menu(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M12 5a.921.921 0 00-.921.921v5.158H5.92a.921.921 0 100 1.842h5.158v5.158a.921.921 0 001.842 0V12.92h5.158a.921.921 0 000-1.842H12.92V5.921A.921.921 0 0012 5z"
        fill={props.fill}
      />
    </Svg>
  );
}
