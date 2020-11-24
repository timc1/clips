import { defaultMarkdownSerializer } from "prosemirror-markdown";

defaultMarkdownSerializer.marks.bold = defaultMarkdownSerializer.marks.strong;
defaultMarkdownSerializer.marks.italic = defaultMarkdownSerializer.marks.em;
// FIXME: No idea why this works for defaultMarkdownSerializer.marks.underline, but without it it throws 🙃
// defaultMarkdownSerializer.marks.underline =
//   defaultMarkdownSerializer.marks.strong;
defaultMarkdownSerializer.marks.autoLink = defaultMarkdownSerializer.marks.link;
defaultMarkdownSerializer.nodes.bulletList =
  defaultMarkdownSerializer.nodes.bullet_list;
defaultMarkdownSerializer.nodes.orderedList =
  defaultMarkdownSerializer.nodes.ordered_list;
defaultMarkdownSerializer.nodes.listItem =
  defaultMarkdownSerializer.nodes.list_item;
defaultMarkdownSerializer.nodes.horizontalRule =
  defaultMarkdownSerializer.nodes.horizontal_rule;

export default defaultMarkdownSerializer;
