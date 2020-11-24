import * as React from "react";
import { SvgProps, Svg } from "./shared";

export default function ExclamationMarkInCircle(props: SvgProps) {
  const fill = props.fill || "#000";

  return (
    <Svg fill={fill} size={props.size} style={props.style} viewBox="0 0 24 24">
      <path
        d="M12 4C7.59111 4 4 7.59111 4 12C4 16.4089 7.59111 20 12 20C16.4089 20 20 16.4089 20 12C20 7.59111 16.4089 4 12 4ZM12 18.4C8.46222 18.4 5.6 15.5378 5.6 12C5.6 8.46222 8.46222 5.6 12 5.6C15.5378 5.6 18.4 8.46222 18.4 12C18.4 15.5378 15.5378 18.4 12 18.4Z"
        fill={fill}
      />
      <path
        d="M12 4C7.59111 4 4 7.59111 4 12C4 16.4089 7.59111 20 12 20C16.4089 20 20 16.4089 20 12C20 7.59111 16.4089 4 12 4ZM12 18.4C8.46222 18.4 5.6 15.5378 5.6 12C5.6 8.46222 8.46222 5.6 12 5.6C15.5378 5.6 18.4 8.46222 18.4 12C18.4 15.5378 15.5378 18.4 12 18.4Z"
        fill={fill}
      />
      <path
        d="M12 16.8C12.4418 16.8 12.8 16.4418 12.8 16C12.8 15.5582 12.4418 15.2 12 15.2C11.5582 15.2 11.2 15.5582 11.2 16C11.2 16.4418 11.5582 16.8 12 16.8Z"
        fill={fill}
      />
      <path
        d="M12 16.8C12.4418 16.8 12.8 16.4418 12.8 16C12.8 15.5582 12.4418 15.2 12 15.2C11.5582 15.2 11.2 15.5582 11.2 16C11.2 16.4418 11.5582 16.8 12 16.8Z"
        fill={fill}
      />
      <path
        d="M11.8933 7.50222C11.2356 7.55555 10.7378 8.14222 10.7911 8.8L11.2 13.6C11.2356 13.9911 11.5378 14.2933 11.9289 14.3289C12.3733 14.3644 12.7645 14.0444 12.8 13.6L13.2089 8.8C13.2089 8.72889 13.2089 8.65778 13.2089 8.60444C13.1378 7.92889 12.5689 7.44889 11.8933 7.50222Z"
        fill={fill}
      />
      <path
        d="M11.8933 7.50222C11.2356 7.55555 10.7378 8.14222 10.7911 8.8L11.2 13.6C11.2356 13.9911 11.5378 14.2933 11.9289 14.3289C12.3733 14.3644 12.7645 14.0444 12.8 13.6L13.2089 8.8C13.2089 8.72889 13.2089 8.65778 13.2089 8.60444C13.1378 7.92889 12.5689 7.44889 11.8933 7.50222Z"
        fill={fill}
      />
    </Svg>
  );
}