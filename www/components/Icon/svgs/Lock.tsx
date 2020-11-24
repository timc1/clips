import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Lock(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M16.45 9.895v-1.64a4.254 4.254 0 00-8.508 0v1.641A2.438 2.438 0 006 12.282v5.28A2.438 2.438 0 008.438 20h7.516a2.438 2.438 0 002.438-2.438v-5.28a2.439 2.439 0 00-1.942-2.387zm-4.254-4.46a2.844 2.844 0 012.861 2.82v1.59H9.335v-1.59a2.844 2.844 0 012.86-2.82zm4.803 12.127a1.045 1.045 0 01-1.045 1.045H8.438a1.045 1.045 0 01-1.045-1.045v-5.28a1.045 1.045 0 011.045-1.045h7.516a1.045 1.045 0 011.045 1.045v5.28z"
        fill={fill}
      />
    </Svg>
  );
}
