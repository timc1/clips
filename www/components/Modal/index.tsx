/** @jsx jsx */
import { jsx, Global, css } from "@emotion/core";
import styled from "@emotion/styled";
import { SMALL_CONTENT_WIDTH } from "lib/constants";
import * as React from "react";
import ReactModal from "react-modal";
import SquareButton from "../Button/SquareButton";
import Icon from "../Icon";

ReactModal.setAppElement("#__next");

const defaultModalStyle: ReactModal.Styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "var(--modalOverlayColor)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    // @ts-ignore
    zIndex: "var(--depth2)",
  },
  content: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "unset",
    background: "var(--contentBackground)",
    padding: "0",
    borderLeft: "1px solid var(--gridColor)",
    borderRight: "none",
    borderTop: "0",
    borderBottom: "0",
    borderRadius: "0",
    boxShadow: "none",
    outline: "none",
    maxWidth: SMALL_CONTENT_WIDTH,
    height: "auto",
    minHeight: "100%",
    margin: "0 0 0 auto",
    width: "calc(100% - 32px + var(--unit) * -2)", // Always show exit button
    overflow: "initial",
  },
};

export default function Modal(
  props: ReactModal.Props & {
    children: React.ReactNode;
  }
) {
  const style = React.useMemo(
    () => ({
      overlay: {
        ...defaultModalStyle.overlay,
        ...props.style?.overlay,
      },
      content: {
        ...defaultModalStyle.content,
        ...props.style?.content,
      },
    }),
    [props.style]
  );

  return (
    <>
      {props.isOpen && (
        <Global
          styles={css`
            body {
              overflow: hidden;
            }

            .ReactModal__Overlay,
            .ReactModal__Content {
              @media not all and (hover) {
                transition: none !important;
              }
            }
          `}
        />
      )}
      <ReactModal
        shouldReturnFocusAfterClose={props.shouldReturnFocusAfterClose || true}
        overlayRef={props.overlayRef}
        contentRef={props.contentRef}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        contentLabel={props.contentLabel}
        style={style}
        shouldCloseOnEsc={props.shouldCloseOnEsc}
        shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
        overlayClassName={props.overlayClassName}
        closeTimeoutMS={props.closeTimeoutMS || 100}
      >
        <Button onClick={props.onRequestClose}>
          <Icon icon="exit" size="medium" fill="var(--buttonIconColor)" />
        </Button>
        <div
          css={css`
            margin-top: calc(var(--unit) * -3.75);
          `}
        >
          {props.children}
        </div>
      </ReactModal>
    </>
  );
}

const Button = styled(SquareButton)`
  position: sticky;
  top: 1px;
  transform: translateX(calc(-29px));
`;
