import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function EyeVisible(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 12.1765C16.4444 5.27451 7.55556 5.27451 4 12.1765C7.55556 19.0784 16.4444 19.0784 20 12.1765ZM12 15.4706C13.8193 15.4706 15.2941 13.9958 15.2941 12.1765C15.2941 10.3572 13.8193 8.88235 12 8.88235C10.1807 8.88235 8.70588 10.3572 8.70588 12.1765C8.70588 13.9958 10.1807 15.4706 12 15.4706ZM12 14.0588C10.9604 14.0588 10.1176 13.2161 10.1176 12.1765C10.1176 11.1369 10.9604 10.2941 12 10.2941C13.0396 10.2941 13.8824 11.1369 13.8824 12.1765C13.8824 13.2161 13.0396 14.0588 12 14.0588Z"
        fill={fill}
      />
    </Svg>
  );
}
