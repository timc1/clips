import * as React from "react";
import useIsomorphicLayoutEffect from "www/hooks/useIsomorphicLayoutEffect";

export type TColorTheme = "light" | "dark";

const KEY = "theme-setting";

export const ThemeContext = React.createContext(undefined);

function isValidStorage(storage: string) {
  return ["light", "dark"].includes(storage);
}

export const ThemeProvider = ({ children }) => {
  const [colorMode, rawSetColorMode] = React.useState<TColorTheme>(undefined);

  useIsomorphicLayoutEffect(() => {
    const storage = localStorage.getItem(KEY);

    if (storage && isValidStorage(storage)) {
      const root = window.document.documentElement;
      root.setAttribute("data-theme", storage);
      rawSetColorMode(storage as TColorTheme);
    }
  }, []);

  const contextValue = React.useMemo(() => {
    function setColorMode(newValue?: TColorTheme) {
      const root = window.document.documentElement;
      if (newValue) {
        root.setAttribute("data-theme", newValue);
      } else {
        root.removeAttribute("data-theme");
      }
      localStorage.setItem(KEY, newValue);
      rawSetColorMode(newValue);
    }

    return {
      colorMode,
      setColorMode,
    };
  }, [colorMode, rawSetColorMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return React.useContext(ThemeContext);
}
