/** @jsx jsx */
import { jsx } from "@emotion/core";
import MarkdownIt from "markdown-it";
import * as React from "react";

const md = new MarkdownIt("default", {
  linkify: true,
  breaks: true,
}).enable(["emphasis", "paragraph", "list", "link"]);

export function useMarkdownIt(markdown = "") {
  return React.useMemo(() => {
    return md.render(markdown);
  }, [markdown]);
}

export default function Markdown({ markdown = "" }: { markdown?: string }) {
  const renderedMarkdown = useMarkdownIt(markdown);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
    />
  );
}
