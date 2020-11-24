import styled from "@emotion/styled";
import * as React from "react";
import Markdown from "www/components/Markdown";
import { P } from "../../Typography";

type Props = {
  title: string;
  markdown: string;
  timestamp: string;
};

export default function ClipText(props: Props) {
  const headerStyle = React.useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
    }),
    []
  );

  return (
    <Container>
      {props.title && (
        // title is deprecated and was previously used until I realized it
        // probably can just live within the markdown 🤷🏻‍♂️
        <Header>
          <P style={headerStyle} size="small" weight="medium">
            {props.title}
          </P>
        </Header>
      )}
      <Markdown markdown={props.markdown} />
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: calc(var(--unit) * 0.5);
`;
