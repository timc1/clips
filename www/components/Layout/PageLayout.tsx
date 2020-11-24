import styled from "@emotion/styled";
import Head from "next/head";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PageLayout(props: Props) {
  return (
    <>
      <Head>
        <title>Clips – Home for Thoughts, Ideas and Discoveries</title>
      </Head>
      <Container>{props.children}</Container>
    </>
  );
}

export const Container = styled.div`
  max-width: 100ch;
  width: 100%;
  padding: 0 var(--unit);
  margin: 0 auto;
  position: relative;
`;
