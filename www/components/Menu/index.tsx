import styled from "@emotion/styled";
import FocusTrap from "focus-trap-react";
import isDesktop from "lib/isDesktop";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Menu({ children, ...rest }: Props) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (isDesktop()) {
      setActive(true);
    }
  }, []);

  return (
    <FocusTrap active={active}>
      <Wrapper {...rest}>{children}</Wrapper>
    </FocusTrap>
  );
}

const Wrapper = styled.div``;
