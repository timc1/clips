import { isSSR } from "./helpers";

export function isMac() {
  return isSSR() ? false : window.navigator.platform === "MacIntel";
}

// ⌘ for Mac, Ctrl for Windows
export function metaKey(event: KeyboardEvent | React.KeyboardEvent<any>) {
  return isMac() ? event.metaKey : event.ctrlKey;
}
