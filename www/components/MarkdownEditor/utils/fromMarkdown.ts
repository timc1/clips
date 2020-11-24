import { EditorSchema } from "@remirror/core";
import md from "markdown-it";
import { MarkdownParser } from "prosemirror-markdown";

/**
 * Reference: https://github.com/remirror/remirror/blob/master/%40remirror/editor-markdown/src/from-markdown.ts
 * Parses markdown content into a ProsemirrorNode compatible with the provided schema.
 */
const fromMarkdown = (markdown: string = "", schema: EditorSchema) =>
  new MarkdownParser(schema, md("commonmark", { html: false }), {
    blockquote: { block: "blockquote" },
    paragraph: { block: "paragraph" },
    list_item: { block: "listItem" },
    bullet_list: { block: "bulletList" },
    ordered_list: {
      block: "orderedList",
      getAttrs: (tok) => ({ order: parseInt(tok.attrGet("order") ?? "1", 10) }),
    },
    // heading: {
    //   block: "heading",
    //   getAttrs: (tok) => ({ level: +tok.tag.slice(1) }),
    // },
    // code_block: { block: "codeBlock" },
    // fence: { block: "codeBlock", getAttrs: (tok) => ({ language: tok.info }) },
    // hr: { node: "horizontalRule" },
    // image: {
    //   node: "image",
    //   getAttrs: (tok) => ({
    //     src: tok.attrGet("src"),
    //     title: tok.attrGet("title") ?? null,
    //     alt: tok.children[0]?.content || null,
    //   }),
    // },
    // hardbreak: { node: "hardBreak" },
    u: { mark: "underline" },
    em: { mark: "italic" },
    strong: { mark: "bold" },
    // link: {
    //   mark: "link",
    //   getAttrs: (tok) => ({
    //     href: tok.attrGet("href"),
    //     title: tok.attrGet("title") ?? null,
    //   }),
    // },
    // code_inline: { mark: "code" },
  }).parse(markdown);

export default fromMarkdown;
