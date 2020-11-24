import { TLinkMetadata } from "lib/types";
import * as React from "react";
import Metadata from "www/components/Clip/ClipLink/Metadata";
import Markdown from "www/components/Markdown";
import Spacer from "www/components/Spacer";

type Props = {
  markdown: string;
  linkMetadata: TLinkMetadata;
};

export default function ClipLink(props: Props) {
  return (
    <div>
      <Metadata metadata={props.linkMetadata} />
      <Spacer spaces={2} />
      <Markdown markdown={props.markdown} />
    </div>
  );
}
