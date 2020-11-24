import { css } from "@emotion/core";

// Referenced from https://github.com/sindresorhus/github-markdown-css/blob/gh-pages/github-markdown.css
const styles = css`
  .markdown-body {
    display: inline-block;
    fill: currentColor;
    vertical-align: text-bottom;
    cursor: default;
  }

  .markdown-body .anchor {
    float: left;
    line-height: 1;
    margin-left: -20px;
    padding-right: 4px;
  }

  .markdown-body .anchor:focus {
    outline: none;
  }

  .markdown-body {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    line-height: 1.5;
    color: #24292e;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
    font-size: var(--fontSizeTiny);
    line-height: 1.5;
    word-wrap: break-word;
  }

  .markdown-body strong {
    font-weight: inherit;
    font-weight: bolder;
    font-size: inherit;
  }

  .markdown-body img {
    border-style: none;
  }

  .markdown-body * {
    box-sizing: border-box;
    font-size: var(--fontSizeTiny);
  }

  .markdown-body--large * {
    font-size: var(--fontSizeSmall);
  }

  .markdown-body input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .markdown-body p {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .markdown-body blockquote {
    margin: 0 0 8px 0;
  }

  .markdown-body ol,
  .markdown-body ul {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .markdown-body ol ol,
  .markdown-body ul ol {
    list-style-type: lower-roman;
  }

  .markdown-body ol ol ol,
  .markdown-body ol ul ol,
  .markdown-body ul ol ol,
  .markdown-body ul ul ol {
    list-style-type: lower-alpha;
  }

  .markdown-body blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  .markdown-body blockquote > :first-of-type {
    margin-top: 0;
  }

  .markdown-body blockquote > :last-child {
    margin-bottom: 0;
  }

  .markdown-body ol,
  .markdown-body ul {
    padding-left: 2em;
    list-style: disc;
  }

  .markdown-body ol ol,
  .markdown-body ol ul,
  .markdown-body ul ol,
  .markdown-body ul ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  .markdown-body li {
    word-wrap: break-all;
  }

  .markdown-body li > p {
    margin-top: 16px;
  }

  .markdown-body li + li {
    margin-top: 0.25em;
  }

  .markdown-body img {
    max-width: 100%;
    box-sizing: initial;
    background-color: #fff;
  }

  .markdown-body em,
  .markdown-body u,
  .markdown-body a,
  .markdown-body s {
    font-weight: inherit;
    font-size: inherit;
  }

  .remirror-is-empty {
    cursor: text;

    &::before {
      content: attr(data-placeholder);
      position: absolute;
      color: var(--inputPlaceholderColor);
    }
  }

  .ProseMirror {
    outline: none;
  }

  .markdown-body *:last-child {
    margin-bottom: 0 !important;
  }
`;

export default styles;
