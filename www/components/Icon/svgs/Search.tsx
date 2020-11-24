import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function Search(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M18.764 17.657l-3.432-3.433a5.717 5.717 0 00-.518-7.536A5.705 5.705 0 0010.748 5a5.705 5.705 0 00-4.065 1.688 5.752 5.752 0 000 8.13 5.705 5.705 0 004.065 1.688 5.657 5.657 0 003.471-1.17l3.452 3.414c.154.153.345.23.556.23a.8.8 0 00.556-.23c.288-.288.288-.786-.019-1.093zm-7.996-2.704a4.21 4.21 0 01-2.973-1.227c-1.63-1.63-1.63-4.296 0-5.945a4.176 4.176 0 012.973-1.228 4.21 4.21 0 012.972 1.228c.805.786 1.227 1.84 1.227 2.972a4.21 4.21 0 01-1.227 2.973c-.786.805-1.86 1.227-2.973 1.227z"
        fill={fill}
      />
    </Svg>
  );
}