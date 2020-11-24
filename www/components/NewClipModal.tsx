import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";
import { fontWeights, SMALL_CONTENT_WIDTH } from "lib/constants";
import { TClipKind } from "lib/types";
import Router, { useRouter } from "next/router";
import * as React from "react";
import ReactModal from "react-modal";
import { useSession } from "www/hooks/useSession";
import UnstyledButton from "./Button/UnstyledButton";
import Icon from "./Icon";

ReactModal.setAppElement("#__next");

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
};

const defaultModalStyle: ReactModal.Styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "none",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    // @ts-ignore
    zIndex: "var(--depth3)",
  },
  content: {
    background: "none",
    padding: "var(--unit)",
    border: "none",
    outline: "none",
    maxWidth: "400px",
    width: "100%",
    height: "max-content",
    left: "50%",
    top: "20%",
    transform: "translateX(-50%)",
  },
};

export default function NewClipModal(props: Props) {
  const { pathname, query } = useRouter();
  const session = useSession();
  const { onRequestClose } = props;

  const handleClick = React.useCallback(
    (type: TClipKind) => {
      onRequestClose();
      Router.push(
        {
          pathname,
          query: { ...query, typeModal: type },
        },
        `/new/${type}`,
        { shallow: true }
      );
    },
    [onRequestClose, pathname, query]
  );

  const handleTextClick = React.useCallback(() => handleClick("text"), [
    handleClick,
  ]);
  const handleLinkClick = React.useCallback(() => handleClick("link"), [
    handleClick,
  ]);
  const handleImageClick = React.useCallback(() => handleClick("image"), [
    handleClick,
  ]);

  const createClickHandler = React.useCallback(
    (route: string) => () => {
      onRequestClose();
      Router.push(route);
    },
    [onRequestClose]
  );

  return (
    <>
      {props.isOpen && (
        <Global
          styles={css`
            body {
              overflow: hidden;
            }
          `}
        />
      )}
      <ReactModal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        contentLabel={props.contentLabel}
        overlayClassName="clipOverlay"
        style={defaultModalStyle}
      >
        <ModalContainer>
          {session.user ? (
            <ModalInner>
              <Button onClick={handleTextClick}>
                <span>
                  <Icon icon="text" />
                </span>
                Text
              </Button>
              <Button onClick={handleLinkClick}>
                <span>
                  <Icon icon="markdown-link" />
                </span>
                Link
              </Button>
              <Button onClick={handleImageClick}>
                <span>
                  <Icon icon="text" />
                </span>
                Image
              </Button>
            </ModalInner>
          ) : (
            <div>
              <Button onClick={createClickHandler("/login")}>Log in</Button>
              <Button onClick={createClickHandler("/register")}>
                Create account
              </Button>
            </div>
          )}
        </ModalContainer>
      </ReactModal>
    </>
  );
}

const ModalContainer = styled.div`
  max-width: calc(${SMALL_CONTENT_WIDTH} - calc(var(--unit) * 4));
  width: 100%;
  padding: var(--unit);
  background: var(--contentBackground);
  border: 1px solid var(--newClipBoxShadow);
  border-radius: calc(var(--unit) * 0.5);
  padding: calc(var(--unit) * 2);
`;

const ModalInner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  gap: var(--unit);
`;

const Button = styled(UnstyledButton)`
  position: relative;
  display: grid;
  justify-content: center;
  padding: var(--unit);
  font-weight: ${fontWeights.bold};
  border-radius: calc(var(--unit) * 0.5);

  @media (hover) {
    &:hover {
      background: var(--buttonBackgroundColorHover);
    }
  }

  &:active {
    background: var(--buttonBackgroundColorActive);
  }
`;
