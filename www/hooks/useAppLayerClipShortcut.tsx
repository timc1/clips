import * as React from "react";
import { useKeyboardShortcuts } from "www/components/KeyboardShortcuts";
import { metaKey } from "www/lib/platform";
import NewClipModal from "../components/NewClipModal";

export default function useAppLayerClipShortcut() {
  const {
    isAppLayerClipShortcutShowing,
    toggleShowAppLayerClipboardShowing,
    toggleHideAppLayerClipboardShowing,
  } = useKeyboardShortcuts();

  const handleHideClipShortcutModal = React.useCallback(
    toggleHideAppLayerClipboardShowing,
    []
  );

  const closing = React.useRef(false);
  const handleShowClipShortcutModal = React.useCallback(() => {
    closing.current = false;
    toggleShowAppLayerClipboardShowing();
  }, [toggleShowAppLayerClipboardShowing]);

  const onRequestClose = React.useCallback(() => {
    if (closing.current) {
      return;
    }

    closing.current = true;
    toggleHideAppLayerClipboardShowing();
  }, [toggleHideAppLayerClipboardShowing]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (metaKey(event) && event.key === "k") {
        event.preventDefault();

        if (isAppLayerClipShortcutShowing) {
          toggleHideAppLayerClipboardShowing();
        } else {
          toggleShowAppLayerClipboardShowing();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      closing.current = false;
    };
  }, [
    handleHideClipShortcutModal,
    handleShowClipShortcutModal,
    isAppLayerClipShortcutShowing,
    toggleHideAppLayerClipboardShowing,
    toggleShowAppLayerClipboardShowing,
  ]);

  return (
    <NewClipModal
      isOpen={isAppLayerClipShortcutShowing}
      onRequestClose={onRequestClose}
      contentLabel="New clip"
    />
  );
}
