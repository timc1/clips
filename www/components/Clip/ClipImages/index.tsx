import styled from "@emotion/styled";
import getApiUrl from "lib/getApiUrl";
import { TImage } from "lib/types";
import * as React from "react";
import Image from "www/components/Image";
import Markdown from "www/components/Markdown";
import Spacer from "www/components/Spacer";

type Props = {
  images: TImage[];
};

export default function ClipImages(props: Props) {
  if (!props.images) {
    return null;
  }

  return (
    <Ul>
      {props.images.map((image) => {
        const url = getApiUrl() + `/api/images?key=${image.key}`;
        return (
          <li key={url}>
            <Image
              key={url}
              url={url}
              height={image.height}
              width={image.width}
              lazy
            />
            <Spacer />
            {image.description && (
              <MarkdownWrapper>
                <Markdown markdown={image.description} />
              </MarkdownWrapper>
            )}
          </li>
        );
      })}
    </Ul>
  );
}

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: calc(var(--unit) * 2);
`;

const MarkdownWrapper = styled.div`
  background: var(--commentBackgroundTint);
  padding: calc(var(--unit) * 2);
  width: 100%;
  border-left: 4px solid var(--contentBackgroundTint);
`;
