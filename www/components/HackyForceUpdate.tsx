/**
 * HackyForceUpdate
 *
 * This was added for <User />, where articles are loaded via useSWRInfinite.
 * If a user is on their own page, adds a new clip via the context modal, there
 * isn't a way for us to refetch the infinite loaded list.
 *
 * useSWRInfinite provides a `mutate` function but since the context modal is
 * called from a completely separate place, we can't access that function.
 *
 * So here's the hacky solution – provide a flag using context that we can toggle
 * from the context modal. Once toggled, the component that contains useSWRInfinite
 * can call `mutate`
 *
 */
import * as React from "react";
import { useSession } from "www/hooks/useSession";

type Props = {
  children: React.ReactNode;
};

type Context = {
  shouldRefetchArticles: boolean;
  forceRefreshArticles: () => void;
};

const HackyForceUpdateContext = React.createContext(undefined);

export function HackyForceUpdateProvider(props: Props) {
  const session = useSession();
  const [shouldRefetchArticles, setShouldRefetchArticles] = React.useState(
    false
  );

  const isLoggedIn = !!session?.user;

  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setShouldRefetchArticles(true);
  }, [isLoggedIn]);

  const forceRefreshArticles = React.useCallback(() => {
    setShouldRefetchArticles(true);
  }, []);

  const timeout = React.useRef(null);

  React.useEffect(() => {
    if (shouldRefetchArticles) {
      timeout.current = setTimeout(() => {
        setShouldRefetchArticles(false);
      }, 100);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [shouldRefetchArticles]);

  const value = React.useMemo(
    () => ({
      shouldRefetchArticles,
      forceRefreshArticles,
    }),
    [forceRefreshArticles, shouldRefetchArticles]
  );

  return (
    <HackyForceUpdateContext.Provider value={value}>
      {props.children}
    </HackyForceUpdateContext.Provider>
  );
}

export function useHackyForceUpdate(): Context {
  return React.useContext(HackyForceUpdateContext);
}
