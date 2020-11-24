import { css, Global } from "@emotion/core";
import * as React from "react";
import { debounce } from "throttle-debounce";
import Portal from "./Portal";

type Placement = "bottom-end";

type Props = {
  placement: Placement;
  children: (props: {
    ref: React.MutableRefObject<any>;
    onClick: () => void;
    "aria-expanded": boolean;
    isShowing: boolean;
  }) => React.ReactNode;
  // additional callback if you want to do something when the menu hides
  onRequestClose?: () => void;
  // additional callback if you want to do something when the menu shows
  onShow?: () => void;
  body:
    | ((props: { onRequestClose: () => void }) => React.ReactNode)
    | React.ReactNode;
};

export default function FloatingMenu(props: Props) {
  const ref = React.useRef<React.MutableRefObject<any>>(null);

  const [state, setState] = React.useState("hidden");

  const { onRequestClose, onShow } = props;

  const handleClick = React.useCallback(() => {
    setState((prevState) => {
      if (prevState === "hidden") {
        if (onShow) {
          onShow();
        }
        return "showing";
      } else {
        return "hidden";
      }
    });
  }, [onShow]);

  const handleClose = React.useCallback(() => {
    if (onRequestClose) {
      onRequestClose();
    }
    setState("hidden");
  }, [onRequestClose]);

  const values = React.useMemo(
    () => ({
      ref,
      onClick: handleClick,
      "aria-expanded": state === "showing",
      isShowing: state === "showing",
    }),
    [handleClick, state]
  );

  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const debouncedResize = debounce(500, () => {
      setCount((prev) => prev + 1);
    });

    if (state === "showing") {
      window.addEventListener("resize", debouncedResize);
    }

    return () => {
      return window.removeEventListener("resize", debouncedResize);
    };
  }, [state]);

  return (
    <>
      {state === "showing" && (
        <Portal key={count}>
          <FloatingContent
            triggerRef={ref}
            placement={props.placement}
            onRequestClose={handleClose}
          >
            {props.body}
          </FloatingContent>
        </Portal>
      )}
      {props.children(values)}
    </>
  );
}

function FloatingContent(props: {
  triggerRef: React.MutableRefObject<any>;
  children: React.ReactNode;
  placement: Placement;
  onRequestClose: () => void;
}) {
  const ownRef = React.useRef<any>(null);
  const [position, setPosition] = React.useState(undefined);

  React.useEffect(() => {
    const trigger = props.triggerRef.current;
    const body = ownRef.current;

    if (trigger && body) {
      const triggerRect = trigger.getBoundingClientRect();
      const bodyRect = body.getBoundingClientRect();

      const triggerCenter = triggerRect.left + triggerRect.width / 2;
      let x = triggerCenter - bodyRect.width / 2;
      let y = triggerRect.top - bodyRect.height + window.scrollY - 6;
      const maxLeft = window.innerWidth - bodyRect.width - 2;

      if (props.placement === "bottom-end") {
        y = triggerRect.top + triggerRect.height + window.scrollY;
        x = triggerRect.left + triggerRect.width - bodyRect.width;
      }

      const left = Math.min(Math.max(2, x), maxLeft) + window.scrollX;
      const top = y;

      setPosition({ left, top });
    }
  }, [props.placement, props.triggerRef]);

  const { onRequestClose } = props;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onRequestClose();
      }
    },
    [onRequestClose]
  );

  return (
    <>
      <Global
        styles={css`
          body {
            overflow: hidden;
          }
        `}
      />
      <div
        onMouseDown={onRequestClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "transparent",
          zIndex: "var(--depth2)" as any,
        }}
      />
      <div
        ref={ownRef}
        style={{
          position: "absolute",
          top: position ? position.top : 0,
          left: position ? position.left : 0,
          zIndex: "var(--depth2)" as any,
          visibility: !position ? "hidden" : "initial",
        }}
        onKeyDown={handleKeyDown}
      >
        {typeof props.children === "function"
          ? props.children({
              onRequestClose,
            })
          : props.children}
      </div>
    </>
  );
}
