import * as React from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion)";

type Props = {
  children: React.ReactNode;
};

type Context = {
  isReducedMotion: boolean;
};

const AccessibilityContext = React.createContext<Context>(undefined);

function AccessibilityProvider(props: Props) {
  const [isReducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    reducedMotionMediaQuery.addListener(handleMediaChange);

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      setReducedMotion(true);
    }

    return () => {
      reducedMotionMediaQuery.removeListener(handleMediaChange);
    };
  }, []);

  const value = React.useMemo(
    () => ({
      isReducedMotion,
    }),
    [isReducedMotion]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {props.children}
    </AccessibilityContext.Provider>
  );
}

const useAccessibility = () => React.useContext(AccessibilityContext);

export { AccessibilityProvider, useAccessibility };
