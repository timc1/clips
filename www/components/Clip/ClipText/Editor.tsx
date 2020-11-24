/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { TClip } from "lib/types";
import * as React from "react";
import MarkdownEditor from "www/components/MarkdownEditor";
import Spacer from "www/components/Spacer";
import Tooltip from "www/components/Tooltip";
import * as KeyCode from "www/lib/keyCode";
import { SubmitButton } from "../shared";
import useSaveClip from "../useSaveClip";

type Props = {
  clip?: TClip;
};

export default function Editor(props: Props) {
  const [markdown, setMarkdown] = React.useState(
    (props.clip && props.clip.markdown) || ""
  );
  const [canSubmit, setCanSubmit] = React.useState(!!markdown);

  React.useEffect(() => {
    if (!canSubmit && !!markdown.trim()) {
      setCanSubmit(true);
    }

    if (canSubmit && !markdown.trim()) {
      setCanSubmit(false);
    }
  }, [markdown, canSubmit]);

  const { saving, submitClip } = useSaveClip({
    clipId: props.clip && props.clip.id,
  });

  const handleSubmit = React.useCallback(() => {
    submitClip({
      type: "text",
      markdown,
    });
  }, [markdown, submitClip]);

  const propsMarkdown = props.clip?.markdown;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === KeyCode.KEY_ESCAPE) {
        if (!!markdown && markdown !== propsMarkdown && !saving) {
          if (
            !window.confirm(
              "You have unsaved content. Are you sure you want to exit?"
            )
          ) {
            event.stopPropagation();
          }
        }

        return;
      }
    },
    [markdown, propsMarkdown, saving]
  );

  const handleRichTextEditorChange = React.useCallback((markdown) => {
    setMarkdown(markdown);
  }, []);

  const maybeWrapInTooltip = React.useCallback(
    (component: React.ReactNode) => {
      if (canSubmit) {
        return component;
      }
      return (
        <Tooltip
          label="Please enter some content"
          aria-label="Please enter some content"
        >
          <span>{component}</span>
        </Tooltip>
      );
    },
    [canSubmit]
  );

  return (
    <Container>
      <MarkdownEditor
        isFocused
        readOnly={saving}
        enabledActions={[
          "bold",
          "italic",
          // "underline",
          "blockquote",
          "strikethrough",
          "list",
        ]}
        onChange={handleRichTextEditorChange}
        onKeyDown={handleKeyDown}
        defaultValue={markdown}
        large
      />
      <Spacer spaces={2} />
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
        `}
      >
        {maybeWrapInTooltip(
          <SubmitButton
            disabled={!canSubmit || saving}
            isLoading={saving}
            onSubmit={handleSubmit}
          >
            {props.clip ? "Update" : "Create"}
          </SubmitButton>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div``;
