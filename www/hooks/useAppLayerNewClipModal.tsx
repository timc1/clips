import styled from "@emotion/styled";
import { useRouter } from "next/router";
import * as React from "react";
import Spacer from "www/components/Spacer";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

const ClipTextEditor = React.lazy(() =>
  import("www/components/Clip/ClipText/Editor")
);

const ClipLinkEditor = React.lazy(() =>
  import("www/components/Clip/ClipLink/Editor")
);

const ClipImagesEditor = React.lazy(() =>
  import("www/components/Clip/ClipImages/Editor")
);

export default function useAppLayerNewClipModal() {
  const { query, back } = useRouter();

  return (
    <>
      <Modal
        isOpen={!!query.typeModal}
        onRequestClose={back}
        overlayClassName="newClipOverlay"
        style={modalStyles}
      >
        <ModalContent className="newClipOverlay__modal">
          <React.Suspense fallback={<Loading flex size="small" />}>
            {query.typeModal === "text" && <ClipTextEditor />}
            {query.typeModal === "link" && <ClipLinkEditor />}
            {query.typeModal === "image" && <ClipImagesEditor />}
            <Spacer spaces={24} />
          </React.Suspense>
        </ModalContent>
      </Modal>
    </>
  );
}

const modalStyles: ReactModal.Styles = {
  overlay: {
    // @ts-ignore depth3 resolves to a number
    zIndex: "var(--depth3)",
  },
};

const ModalContent = styled.div`
  background: var(--contentBackground);
  border-radius: calc(var(--unit) * 2);
  padding: calc(var(--unit) * 4);
`;
