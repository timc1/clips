import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function CaretLeft(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <defs />
      <path
        fill={fill}
        d="M15.953 17.225L10.531 12l5.422-5.225a1.03 1.03 0 00.016-1.462A1.008 1.008 0 0015.246 5h-.016a1.02 1.02 0 00-.723.296L8.312 11.26C8.115 11.458 8 11.72 8 12c0 .28.115.559.312.74l6.212 5.964c.197.181.443.296.723.296.279 0 .542-.115.739-.312a1.03 1.03 0 00.296-.74.938.938 0 00-.329-.723z"
      />
    </Svg>
  );
}
