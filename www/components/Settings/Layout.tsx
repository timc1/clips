import styled from "@emotion/styled";
import { useRouter } from "next/router";
import * as React from "react";
import { useSession } from "www/hooks/useSession";
import TopBar from "../Layout/TopBar";
import Link from "../Link";
import Loading from "../Loading";

type Props = {
  content: React.ReactNode;
};

const sessionOptions = {
  redirectToIfNoValidSession: "/login",
};

export default function NavigationLayout(props: Props) {
  const router = useRouter();

  const { loading } = useSession(sessionOptions);

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <>
      <TopBar title="Settings" />
      <Container>
        <Ul>
          <li>
            <StyledLink
              href="/settings"
              fullWidth
              size="small"
              weight={router.pathname === "/settings" ? "bold" : "regular"}
            >
              General
            </StyledLink>
          </li>
        </Ul>
        <Content>{props.content}</Content>
      </Container>
    </>
  );
}

const Ul = styled.ul``;

const StyledLink = styled(Link)``;

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 0.33fr) 1fr;
  gap: calc(var(--unit) * 4);
  margin: calc(var(--unit) * 3) 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.div``;
