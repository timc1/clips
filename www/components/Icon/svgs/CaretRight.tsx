import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function CaretRight(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M8.329 17.225L13.75 12 8.33 6.775a1.008 1.008 0 01-.313-.723c0-.28.099-.543.296-.74.197-.197.444-.312.723-.312h.017c.263 0 .525.099.723.296l6.194 5.965c.198.197.313.46.313.739 0 .28-.115.559-.313.74l-6.21 5.964c-.198.181-.444.296-.724.296-.28 0-.542-.115-.74-.312a1.03 1.03 0 01-.295-.74c0-.279.115-.542.329-.723z"
        fill={fill}
      />
    </Svg>
  );
}
