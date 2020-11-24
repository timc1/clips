/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import Flex from "www/components/Flex";
import Icon from "www/components/Icon";
import Link from "www/components/Link";
import Padding from "www/components/Padding";
import Spacer from "www/components/Spacer";
import { P } from "www/components/Typography";

export default function Explore() {
  return (
    <Padding left={2} right={2}>
      <Flex
        alignItems="center"
        justifyContent="center"
        direction="column"
        css={css`
          min-height: 100vh;
        `}
      >
        <Icon icon="exclamation-mark" size="large" />
        <P>
          You've found something cool in the works{" "}
          <span role="img" aria-label="eyes">
            👀
          </span>
        </P>
        <Spacer />
        <Link href="/">Home</Link>
      </Flex>
    </Padding>
  );
}
