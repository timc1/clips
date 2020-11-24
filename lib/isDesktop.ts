export default function isDesktop() {
  return "matchMedia" in window
    ? window.matchMedia("(any-hover)").matches
    : true;
}
