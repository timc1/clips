import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function TextDraft(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M13.854 5H7.436A1.436 1.436 0 006 6.436v11.128A1.436 1.436 0 007.436 19h8.974a1.436 1.436 0 001.436-1.436V8.992a1.436 1.436 0 00-.42-1.016L14.87 5.42A1.437 1.437 0 0013.854 5zm.402 2.692c0-.197.115-.247.255-.107l.718.718c.14.14.09.254-.107.254h-.507a.359.359 0 01-.359-.359v-.506zm-6.102 9.513a.359.359 0 01-.36-.359V7.154a.359.359 0 01.36-.36h3.949a.359.359 0 01.358.36v1.795a1.436 1.436 0 001.436 1.436h1.795a.359.359 0 01.36.359v6.102a.359.359 0 01-.36.36H8.154z"
        fill={fill}
      />
    </Svg>
  );
}
