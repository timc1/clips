import styled from "@emotion/styled";
import * as React from "react";
import Spacer from "../Spacer";
import { H3, P } from "../Typography";

type Props = {
  name: string;
};

export default function OnboardingWelcome(props: Props) {
  return (
    <Container>
      <H3 size="medium" weight="bold">
        Hey, {props.name}!
      </H3>
      <Spacer spaces={2} />
      <P color="var(--secondaryTextColor)">
        Create your first clip by clicking the <code>⌘</code> icon in the menu
        or pressing <code>⌘+K</code>
      </P>
    </Container>
  );
}

const Container = styled.div`
  padding: var(--unit);

  code {
    background: var(--contentBackgroundTint);
    padding: calc(var(--unit) * 0.25) calc(var(--unit) * 0.5);
    box-shadow: 0 0 0 1px var(--gridColor);
  }
`;
