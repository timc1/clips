/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import Router from "next/router";
import NProgress from "nprogress";
import * as React from "react";

const DELAY = 200;

export default function RouteLoader() {
  const [isLoading, setLoading] = React.useState(false);

  const timeout = React.useRef(null);

  React.useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      NProgress.start();
      timeout.current = setTimeout(() => {
        setLoading(true);
      }, DELAY);
    });
    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
      clearTimeout(timeout.current);
      setLoading(false);
    });
    Router.events.on("routeChangeError", () => {
      NProgress.done();
      clearTimeout(timeout.current);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <span
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        display: block;
        height: 2px;
        width: 100%;
        background: var(--loaderColor);
        transform: ${isLoading ? "scaleX(1)" : "scaleX(0)"};
        opacity: ${isLoading ? 1 : 0};
        box-shadow: 0 0 8px #fff;
        transform-origin: 0 0;
        transition: ${isLoading
          ? "transform 600ms ease-out"
          : "opacity 100ms ease-out, transform 0ms linear 100ms"};
        z-index: var(--depth3);
      `}
    />
  );
}
