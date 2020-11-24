/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { REDIRECT_TO_POST_AUTH } from "www/hooks/useSession";
import Link from "./Link";

export default function LoginLink({
  children,
}: {
  children?: React.ReactNode;
}) {
  const onClickSignIn = React.useCallback(() => {
    window.localStorage.setItem(
      REDIRECT_TO_POST_AUTH,
      window.location.pathname
    );
  }, []);

  return (
    // Click will propagate up to this div from Link.
    <div
      onClick={onClickSignIn}
      css={css`
        display: inline-block;
      `}
    >
      <Link href="/login" as="/login">
        {children || "Log in"}
      </Link>
    </div>
  );
}
