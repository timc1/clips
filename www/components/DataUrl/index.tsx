import { useRouter } from "next/router";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export default function DataUrl(props: Props) {
  const { asPath } = useRouter();

  React.useEffect(() => {
    document.body.setAttribute("data-url", window.location.pathname);
  }, [asPath]);

  return <>{props.children}</>;
}
