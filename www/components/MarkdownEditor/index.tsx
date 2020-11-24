/** @jsx jsx */
import { jsx, Global, css } from "@emotion/core";
import { StrikeExtension } from "@remirror/extension-strike";
import { ListPreset } from "@remirror/preset-list";
import * as React from "react";
import { BlockquoteExtension } from "remirror/extension/blockquote";
import { BoldExtension } from "remirror/extension/bold";
import { ItalicExtension } from "remirror/extension/italic";
import { PlaceholderExtension } from "remirror/extension/placeholder";
import { ReactSsrExtension } from "remirror/extension/react-ssr";
import { TrailingNodeExtension } from "remirror/extension/trailing-node";
import { UnderlineExtension } from "remirror/extension/underline";
import { useManager, RemirrorProvider } from "remirror/react";
import Editor from "./Editor";
import styles from "./styles";
import defaultMarkdownSerializer from "./utils/defaultMarkdownSerializer";
import fromMarkdown from "./utils/fromMarkdown";

type RichTextEditorActions =
  | "bold"
  | "italic"
  | "underline"
  | "blockquote"
  | "strikethrough"
  | "list";

type Props = {
  readOnly?: boolean;
  defaultValue?: string;
  isFocused?: boolean;
  onChange?: (markdown: string, event: any) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  enabledActions?: RichTextEditorActions[];
  placeholder?: string;
  large?: boolean;
};

const enabledActions: RichTextEditorActions[] = [
  "bold",
  "italic",
  "list",
  "strikethrough",
  "blockquote",
];

function getExtensions(enabledActions: RichTextEditorActions[]) {
  let extensions = [];

  if (enabledActions.includes("bold")) {
    extensions.push(new BoldExtension({ weight: 800 }));
  }

  if (enabledActions.includes("italic")) {
    extensions.push(new ItalicExtension());
  }

  if (enabledActions.includes("underline")) {
    extensions.push(new UnderlineExtension());
  }

  if (enabledActions.includes("blockquote")) {
    extensions.push(new BlockquoteExtension());
  }

  if (enabledActions.includes("strikethrough")) {
    extensions.push(new StrikeExtension());
  }

  if (enabledActions.includes("list")) {
    extensions.push(new ListPreset());
  }

  extensions.push(new TrailingNodeExtension());
  extensions.push(new ReactSsrExtension("DEFAULT_TRANSFORMATIONS"));

  return extensions;
}

export default function MarkdownEditor(props: Props) {
  const manager = useManager([
    ...getExtensions(props.enabledActions || enabledActions),
    new PlaceholderExtension({
      placeholder: props.placeholder || "Write something…",
    }),
  ]);

  const [value, setValue] = React.useState(() => {
    const state = manager.createState({
      content: fromMarkdown(props.defaultValue || "", manager.schema),
    });

    return state;
  });

  const { onChange } = props;
  const handleChange = React.useCallback(
    (event: any) => {
      if (event.tr && event.tr.docChanged && onChange) {
        const markdown = defaultMarkdownSerializer.serialize(event.state.doc);
        onChange(markdown, event);
      }

      setValue(event.state);
    },
    [onChange]
  );

  const markdownBodyClassName = props.large
    ? "markdown-body markdown-body--large"
    : "markdown-body";

  return (
    <>
      <Global styles={styles} />
      <RemirrorProvider
        manager={manager}
        onChange={handleChange}
        value={value}
        editable={!props.readOnly}
      >
        <>
          <div
            className={markdownBodyClassName}
            css={css`
              margin-bottom: 12px;
            `}
          >
            <Editor isFocused={props.isFocused} onKeyDown={props.onKeyDown} />
          </div>
        </>
      </RemirrorProvider>
    </>
  );
}
