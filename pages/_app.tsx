import { Global } from "@emotion/core";
import { useRouter } from "next/router";
import * as React from "react";
import { AccessibilityProvider } from "www/components/Accessibility";
import ClipEditor from "www/components/Clip/ClipEditor";
import ClipPage from "www/components/Clip/ClipPage";
import DataUrl from "www/components/DataUrl";
import { HackyForceUpdateProvider } from "www/components/HackyForceUpdate";
import { KeyboardShortcutsProvider } from "www/components/KeyboardShortcuts";
import markdownStyles from "www/components/MarkdownEditor/styles";
import Modal from "www/components/Modal";
import Padding from "www/components/Padding";
import ReCAPTCHA from "www/components/ReCAPTCHA";
import RouteLoader from "www/components/RouteTransition";
import { ThemeProvider } from "www/components/Theme";
import globalCssReset from "www/globalCssReset";
import globalStyles from "www/globalStyles";
import * as gtag from "www/gtag";
import useAppLayerClipShortcut from "www/hooks/useAppLayerClipShortcut";
import useAppLayerNewClipModal from "www/hooks/useAppLayerNewClipModal";
import { ToastProvider } from "www/hooks/useToast";
import "focus-visible";

export default function App({ Component, pageProps }) {
  const props = React.useMemo(() => {
    return pageProps;
    // eslint-disable-next-line
  }, []);

  const Layout = Component.Layout || React.Fragment;

  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };

    if (process.env.NODE_ENV === "production") {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      if (process.env.NODE_ENV === "production") {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [router.events]);

  return (
    <>
      <Global styles={globalCssReset} />
      <Global styles={globalStyles} />
      <Global styles={markdownStyles} />
      <RouteLoader />
      <ReCAPTCHA.Provider>
        <AccessibilityProvider>
          <DataUrl>
            <ThemeProvider>
              <ToastProvider>
                <KeyboardShortcutsProvider>
                  <HackyForceUpdateProvider>
                    <Shortcuts />
                    <ShallowModals />
                    <Layout>
                      <Component {...props} />
                    </Layout>
                  </HackyForceUpdateProvider>
                </KeyboardShortcutsProvider>
              </ToastProvider>
            </ThemeProvider>
          </DataUrl>
        </AccessibilityProvider>
      </ReCAPTCHA.Provider>
    </>
  );
}

function Shortcuts() {
  const clipShortcut = useAppLayerClipShortcut();
  const newClipModal = useAppLayerNewClipModal();

  return (
    <>
      {clipShortcut}
      {newClipModal}
    </>
  );
}

function ShallowModals() {
  const ref = React.useRef(null);
  const router = useRouter();

  return (
    <>
      <Modal
        shouldReturnFocusAfterClose={!router.query.edit ? false : true}
        contentRef={(node) => (ref.current = node)}
        isOpen={!!router.query.clipModal}
        onRequestClose={router.back}
        contentLabel="Clip modal"
      >
        <Padding top={2} left={2} right={2} bottom={2}>
          {router.query.edit ? (
            <ClipEditor id={router.query.clipModal as string} />
          ) : (
            <ClipPage id={router.query.clipModal as string} hideTopBar />
          )}
        </Padding>
      </Modal>
    </>
  );
}
