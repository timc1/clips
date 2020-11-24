/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { TClip, TLinkMetadata } from "lib/types";
import { isValidUrl, parseUrl } from "lib/url";
import * as React from "react";
import { debounce } from "throttle-debounce";
import Metadata from "www/components/Clip/ClipLink/Metadata";
import Input from "www/components/Input";
import Loading from "www/components/Loading";
import MarkdownEditor from "www/components/MarkdownEditor";
import Spacer from "www/components/Spacer";
import { unfurlUrl } from "www/requests/unfurl";
import { SubmitButton } from "../shared";
import useSaveClip from "../useSaveClip";

type Props = {
  clip?: TClip;
};

export default function ClipLinkEditor(props: Props) {
  const [linkMetadata, setMetadata] = React.useState<TLinkMetadata | undefined>(
    props.clip && props.clip.linkMetadata
  );

  const [markdown, setMarkdown] = React.useState(
    props.clip && props.clip.markdown
  );

  const onUnfurled = React.useCallback((metadata: TLinkMetadata) => {
    setMetadata(metadata);
  }, []);

  const handleChangeMarkdown = React.useCallback((markdown: string) => {
    setMarkdown(markdown);
  }, []);

  const { saving, submitClip } = useSaveClip({
    clipId: props.clip && props.clip.id,
  });

  const handleSubmit = React.useCallback(() => {
    submitClip({
      type: "link",
      linkMetadata,
      markdown,
    });
  }, [linkMetadata, markdown, submitClip]);

  const [targetUrl, setTargetUrl] = React.useState(
    linkMetadata ? linkMetadata.url : ""
  );
  const [unfurling, setUnfurling] = React.useState(false);

  const unfurl = React.useCallback(
    async (url: string) => {
      if (!url.length || unfurling) {
        return;
      }
      const parsedUrl = parseUrl(url);
      const isValid = isValidUrl(parsedUrl);

      if (isValid) {
        try {
          setUnfurling(true);
          const { metadata } = await unfurlUrl(parsedUrl);
          setUnfurling(false);
          onUnfurled(metadata);
        } catch (error) {
          setUnfurling(false);
          onUnfurled(undefined);
        }
      }
    },
    [onUnfurled, unfurling]
  );

  const handleUnfurl = React.useCallback(debounce(1000, unfurl), [unfurl]);

  const handleImmediateUnfurl = React.useCallback(
    (event) => {
      event.preventDefault();
      handleUnfurl.cancel();
      unfurl(targetUrl);
    },
    [handleUnfurl, targetUrl, unfurl]
  );

  const handleChange = React.useCallback(
    (event) => {
      const { value } = event.target;
      setTargetUrl(value);
      handleUnfurl(value);
    },
    [handleUnfurl]
  );

  return (
    <>
      <>
        <form onSubmit={handleImmediateUnfurl}>
          <LinkInput
            id="insertLink"
            type="text"
            value={targetUrl}
            onChange={handleChange}
            placeholder="Insert link…"
            autoFocus
            autoComplete="off"
            disabled={unfurling}
            noBackground
          />
        </form>
        {linkMetadata && (
          <>
            <Spacer spaces={2} />
            <Metadata metadata={linkMetadata} />
            <Spacer spaces={2} />
            <MarkdownEditor
              isFocused={true}
              enabledActions={[
                "bold",
                "italic",
                // "underline",
                "blockquote",
                "strikethrough",
                "list",
              ]}
              onChange={handleChangeMarkdown}
              defaultValue={markdown}
              large
            />
          </>
        )}
        {unfurling && (
          <>
            <Spacer spaces={2} />
            <Loading flex size="small" />
          </>
        )}
      </>
      {linkMetadata ? (
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Spacer spaces={2} />
          <SubmitButton
            disabled={!linkMetadata || saving}
            onSubmit={handleSubmit}
            isLoading={saving}
          >
            {props.clip ? "Update" : "Create"}
          </SubmitButton>
        </div>
      ) : null}
    </>
  );
}

const LinkInput = styled(Input)`
  font-size: var(--fontSizeMedium);
  font-family: var(--primaryFont);
  padding: 0 var(--unit);
  line-height: 1.3;
  text-overflow: ellipsis;
  box-sizing: content-box;
  margin-left: calc(var(--unit) * -1);
`;
