import * as React from "react";

type Props = {
  children;
};

type Context = {
  isAppLayerClipShortcutShowing: boolean;
  toggleShowAppLayerClipboardShowing: () => void;
  toggleHideAppLayerClipboardShowing: () => void;
};

const KeyboardShortcutContext = React.createContext<Context>({
  isAppLayerClipShortcutShowing: false,
  toggleShowAppLayerClipboardShowing: () => {},
  toggleHideAppLayerClipboardShowing: () => {},
});

export function KeyboardShortcutsProvider(props: Props) {
  const [
    isAppLayerClipShortcutShowing,
    setAppLayerClipboardShowing,
  ] = React.useState(false);

  const value = React.useMemo(() => {
    function createClickHandler(showing: boolean) {
      return () => {
        setAppLayerClipboardShowing(showing);
      };
    }

    return {
      isAppLayerClipShortcutShowing,
      toggleShowAppLayerClipboardShowing: createClickHandler(true),
      toggleHideAppLayerClipboardShowing: createClickHandler(false),
    };
  }, [isAppLayerClipShortcutShowing]);

  return (
    <KeyboardShortcutContext.Provider value={value}>
      {props.children}
    </KeyboardShortcutContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  return React.useContext(KeyboardShortcutContext);
}
