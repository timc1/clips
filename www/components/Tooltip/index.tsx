import * as React from "react";
import Portal from "../Portal";
import { useTooltip, TooltipPopup } from "./ReachTooltip";

// Center the tooltip, but collisions will win
const centered = (
  triggerRect,
  tooltipRect,
  verticalOffset,
  horizontalOffset,
  placement
) => {
  let actualPlacement = placement;

  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  let left = triggerCenter - tooltipRect.width / 2;
  let top =
    triggerRect.top - tooltipRect.height + window.scrollY - 6 + verticalOffset;
  const maxLeft = window.innerWidth - tooltipRect.width - 2;

  if (top - window.scrollY < 0) {
    actualPlacement = "bottom";
  }

  if (actualPlacement === "top-start") {
    left = triggerRect.left;
  }

  if (actualPlacement === "top-end") {
    left = triggerRect.left + triggerRect.width - tooltipRect.width;
  }

  if (actualPlacement === "bottom") {
    top =
      triggerRect.top +
      triggerRect.height +
      window.scrollY +
      6 +
      verticalOffset;
  }

  return {
    left:
      Math.min(Math.max(2, left), maxLeft) + window.scrollX + horizontalOffset,
    top,
  };
};

type Props = {
  children: any;
  label: string | React.ReactNode;
  "aria-label": string;
  hideCaret?: boolean;
  verticalOffset?: number;
  horizontalOffset?: number;
  placement?: "top-start" | "top-end" | "bottom";
};

export default function Tooltip({
  children,
  label,
  "aria-label": ariaLabel,
  hideCaret,
  verticalOffset = 0,
  horizontalOffset = 0,
  placement,
}: Props) {
  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();
  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip;

  const caretStyle: any = React.useMemo(() => {
    let actualPlacement = placement;

    const baseStyle = {
      position: "absolute",
      width: 0,
      height: 0,
      left: triggerRect && triggerRect.left - 6 + triggerRect.width / 2,
      top: triggerRect && triggerRect.top - 6 + verticalOffset + window.scrollY,
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid var(--tooltipColor)",
      // @ts-ignore
      zIndex: "var(--depth3)",
    };

    // 24 is the height of our tooltip
    if (baseStyle.top - window.scrollY < 24) {
      actualPlacement = "bottom";
    }

    if (actualPlacement === "bottom") {
      return {
        ...baseStyle,
        top:
          triggerRect && triggerRect.top + triggerRect.height + window.scrollY,
        borderBottom: "6px solid var(--tooltipColor)",
        borderTop: "none",
      };
    }

    return baseStyle;
  }, [placement, triggerRect, verticalOffset]);

  return (
    <React.Fragment>
      {React.cloneElement(children, trigger)}
      {isVisible && !hideCaret && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <div style={caretStyle} />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        aria-label={ariaLabel}
        style={{
          position: "absolute",
          background: "var(--tooltipColor)",
          color: "var(--tooltipTextColor)",
          border: "none",
          padding: "6px 8px 6px",
          fontSize: 11,
          zIndex: "var(--depth3)",
        }}
        position={(triggerRect, tooltipRect) =>
          centered(
            triggerRect,
            tooltipRect,
            verticalOffset,
            horizontalOffset,
            placement
          )
        }
      />
    </React.Fragment>
  );
}
