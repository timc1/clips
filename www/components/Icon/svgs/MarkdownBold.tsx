import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function MarkdownBold(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M14.452 11.52a3.93 3.93 0 00.946-2.563A3.961 3.961 0 0011.442 5H6.913a.914.914 0 000 1.826h.609v10.348h-.609a.914.914 0 000 1.826h5.746a3.961 3.961 0 003.957-3.957c0-1.536-.881-2.87-2.164-3.524zM9.348 6.825h2.094c1.173 0 2.13.956 2.13 2.13 0 1.175-.957 2.131-2.13 2.131H9.348v-4.26zm3.311 10.348H9.348v-4.261h3.311c1.173 0 2.13.956 2.13 2.13 0 1.175-.957 2.13-2.13 2.13z"
        fill={fill}
      />
    </Svg>
  );
}
