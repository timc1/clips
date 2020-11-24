import * as React from "react";
import { isSSR } from "www/lib/helpers";

const useIsomorphicLayoutEffect = isSSR()
  ? React.useEffect
  : React.useLayoutEffect;

export default useIsomorphicLayoutEffect;
