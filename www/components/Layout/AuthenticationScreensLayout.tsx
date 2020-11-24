/* 
  Layout

  This component is currently used for the login and reset-password routes.
  which each have a container with some box-shadow and padding around the
  forms.
*/

import styled from "@emotion/styled";
import * as React from "react";
import Spacer from "../Spacer";

type Props = {
  children: React.ReactNode;
  subLinks?: React.ReactNode;
};

export default function Layout(props: Props) {
  return (
    <Container>
      <FormContainer>{props.children}</FormContainer>
      {props.subLinks && (
        <>
          <Spacer />
          {props.subLinks}
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: calc(var(--unit) * 16);
  align-items: center;
  flex-direction: column;
`;

const FormContainer = styled.div`
  padding: calc(var(--unit) * 4) calc(var(--unit) * 6) 0 calc(var(--unit) * 4);
  max-width: 450px;
  width: 100%;

  @media (max-width: 500px) {
    box-shadow: none;
    padding: calc(var(--unit) * 3);
    padding-bottom: 0;
  }
`;
