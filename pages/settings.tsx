import { useRouter } from "next/router";
import * as React from "react";
import PageLayout from "www/components/Layout/PageLayout";
import SettingsGeneral from "www/components/Settings/General";
import NavigationLayout from "www/components/Settings/Layout";

export default function Settings() {
  const router = useRouter();

  const Component = React.useMemo(() => {
    if (router.asPath === "/settings") {
      return <SettingsGeneral />;
    }

    return null;
  }, [router.asPath]);

  return <NavigationLayout content={Component} />;
}

Settings.Layout = PageLayout;
