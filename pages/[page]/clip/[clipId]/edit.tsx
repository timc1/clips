import styled from "@emotion/styled";
import { useRouter } from "next/router";
import * as React from "react";
import ClipEditor from "www/components/Clip/ClipEditor";
import PageLayout from "www/components/Layout/PageLayout";
import TopBar from "www/components/Layout/TopBar";
import Spacer from "www/components/Spacer";

type Props = {
  id?: string;
};

export default function ClipEdit(props: Props) {
  const { query } = useRouter();

  return (
    <>
      <TopBar title="Edit" />
      <Spacer spaces={2} />
      <Container>
        <ClipEditor id={query.clipId as string} />
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 75ch;
  width: 100%;
  margin: auto;
`;

ClipEdit.Layout = PageLayout;
