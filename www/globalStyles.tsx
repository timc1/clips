import { css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";

const lightTheme = css`
  :root {
    --inputPlaceholderColor: #9a9a9a;
    --linkBackgroundColorHover: #efeff5;
    --linkBackgroundColorActive: #e7e7ef;
    --textColor: rgba(0, 0, 0, 0.95);
    --secondaryTextColor: rgba(0, 0, 0, 0.75);
    --tertiaryTextColor: rgba(0, 0, 0, 0.5);
    --errorColor: #bd1e59;
    --accessibilityOutline: rgb(107, 107, 107, 0.7);
    --buttonIconColor: rgba(0, 0, 0, 0.75);
    --buttonBackgroundColorIdle: rgb(255 255 255 / 95%);
    --buttonBackgroundColorHover: rgb(224 224 224 / 95%);
    --buttonBackgroundColorActive: rgb(224 224 224 / 50%);
    --gridColor: #080808;
    --iconColor: rgba(0, 0, 0, 0.5);
    --dividerColor: rgba(0, 0, 0, 0.15);
    --highlight: hsl(52deg 100% 50% / 80%);
    --lighterShimmerColor: #f6f7f8;
    --darkerShimmerColor: #edeef1;
    --loaderColor: #080808;
    --inputBackgroundColorIdle: rgb(239 239 239 / 90%);
    --inputBackgroundColorActive: rgb(216 216 216 / 90%);
    --contentBackground: rgb(255, 255, 255);
    --contentBackgroundTint: rgba(0, 0, 0, 0.08);
    --tooltipColor: rgba(0, 0, 0, 0.95);
    --tooltipTextColor: #fff;
    --modalOverlayColor: rgba(0, 0, 0, 0.1);
    --topBarBackground: rgba(255, 255, 255, 0.9);
    --commentBackgroundTint: rgba(0, 0, 0, 0.05);
    --newClipBoxShadow: rgba(0, 0, 0, 0.95);
  }
`;

const darkTheme = css`
  :root {
    --inputPlaceholderColor: #9a9a9a;
    --linkBackgroundColorHover: #252527;
    --linkBackgroundColorActive: #323235;
    --textColor: rgb(239 239 239 / 95%);
    --secondaryTextColor: rgb(222 222 222 / 75%);
    --tertiaryTextColor: rgb(220 220 220 / 50%);
    --errorColor: #bd1e59;
    --accessibilityOutline: rgb(107, 107, 107, 0.7);
    --buttonIconColor: rgb(230 230 230 / 75%);
    --buttonBackgroundColorIdle: rgb(19 19 19 / 95%);
    --buttonBackgroundColorHover: rgb(43 43 43 / 95%);
    --buttonBackgroundColorActive: rgb(84 84 84 / 95%);
    --gridColor: #2b2b2b;
    --iconColor: rgb(234 234 234 / 50%);
    --dividerColor: rgb(226 226 226 / 15%);
    --highlight: hsl(52deg 100% 50% / 80%);
    --lighterShimmerColor: #151515;
    --darkerShimmerColor: #0e0e0e;
    --loaderColor: #84cef3;
    --inputBackgroundColorIdle: rgb(37 36 36 / 90%);
    --inputBackgroundColorActive: rgb(53 52 52 / 90%);
    --contentBackground: rgb(16 16 16);
    --contentBackgroundTint: rgb(255 255 255 / 0.02);
    --tooltipColor: rgba(255, 255, 255, 0.95);
    --tooltipTextColor: rgba(0, 0, 0, 0.95);
    --modalOverlayColor: rgba(255, 255, 255, 0.05);
    --topBarBackground: rgba(16, 16, 16, 0.75);
    --commentBackgroundTint: rgba(255, 255, 255, 0.05);
    --newClipBoxShadow: rgba(255, 255, 255, 0.25);
  }
`;

const globalStyles = css`
  @font-face {
    font-family: "sohne";
    src: url(/assets/fonts/soehne-buch.woff) format("woff");
    font-weight: 400;
  }

  @font-face {
    font-family: "sohne";
    src: url(/assets/fonts/soehne-buch-kursiv.woff) format("woff");
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: "sohne";
    src: url(/assets/fonts/soehne-halbfett.woff) format("woff");
    font-weight: 600;
  }

  :root {
    --primaryFont: Arial, Helvetica, sans-serif;
    --fontSizeSoTiny: 11px;
    --fontSizeTiny: 12px;
    --fontSizeSmall: 16px;
    --fontSizeMedium: 21.33px;
    --fontSizeLarge: 28.43px;
    --fontWeightRegular: 400;
    --fontWeightMedium: 600;
    --fontWeightBold: 800;

    --unit: 8px;
    --ease: cubic-bezier(0.215, 0.61, 0.355, 1);

    --depth1: 80;
    --depth2: 81;
    --depth3: 82;
  }

  ${lightTheme};

  @media (prefers-color-scheme: dark) {
    ${darkTheme};
  }

  [data-theme="light"] {
    ${lightTheme};
  }

  [data-theme="dark"] {
    ${darkTheme};
  }

  html {
    background: var(--contentBackground);
  }

  .grecaptcha-badge {
    visibility: hidden;
  }

  body[data-url*="/login"],
  body[data-url*="/register"],
  body[data-url*="/reset-password"] {
    .grecaptcha-badge {
      visibility: initial;
    }
  }

  * {
    box-sizing: border-box;
    word-wrap: break-word;
    color: var(--textColor);
    line-height: normal;
    font-family: var(--primaryFont);
    touch-action: pan-x pan-y;
    -webkit-font-smoothing: antialiased;
  }

  @media (prefers-reduced-motion) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      transition-duration: 0 !important;
    }
  }

  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 100ms var(--ease);
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }

  .ReactModal__Content {
    transform: translateX(20px);
    opacity: 0;
    transition: transform 150ms var(--ease), opacity 150ms var(--ease);
  }

  .ReactModal__Content--after-open {
    opacity: 1;
    transform: translateX(0px);
  }

  .ReactModal__Content--before-close {
    transform: translateX(8px);
    transition-delay: 0;
    opacity: 0;
  }
`;

export const accessibilityOutline = css`
  outline: none;

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    box-shadow: 0 0 0 3px var(--accessibilityOutline);
    border-radius: inherit;
    pointer-events: none;
    touch-action: none;
    visibility: hidden;
    z-index: 1;
  }

  &:focus[data-focus-visible-added]::after {
    visibility: initial;
  }
`;

const shimmerKeyframes = keyframes`
  0% {
    background-position: -468px 0;
  }
  
  100% {
    background-position: 468px 0; 
  }
`;

export const shimmerAnimation = css`
  display: inline-block;
  border-radius: inherit;
  animation: ${shimmerKeyframes} 1000ms linear infinite;
  animation-fill-mode: forwards;
  background: var(--lighterShimmerColor);
  background-image: linear-gradient(
    to right,
    var(--lighterShimmerColor) 0%,
    var(--darkerShimmerColor) 20%,
    var(--lighterShimmerColor) 40%,
    var(--lighterShimmerColor) 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 100%;
  position: relative;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
`;

export const FadeInWrapper = styled.div`
  opacity: 0;
  animation: ${fadeIn} 1000ms var(--ease);
  animation-fill-mode: forwards;
  animation-delay: 150ms;
`;

export default globalStyles;
