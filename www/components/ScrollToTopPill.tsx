import styled from "@emotion/styled";
import * as React from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { throttle } from "throttle-debounce";
import Button from "./Button";

type Props = {
  scrollRef: React.RefObject<HTMLElement>;
};

export default function ScrollToTopPill(props: Props) {
  const [showing, setShowing] = React.useState(false);
  const animationId = React.useRef(-1);
  const isAnimating = React.useRef(false);

  React.useEffect(() => {
    const scrollNode = props.scrollRef.current;

    function scroll() {
      if (isAnimating.current || !scrollNode) {
        return;
      }

      isAnimating.current = true;
      animationId.current = requestAnimationFrame(scroll);

      const rect = scrollNode.getBoundingClientRect();

      if (rect.top < -1500) {
        setShowing(true);
      } else {
        setShowing(false);
      }
      isAnimating.current = false;
      cancelAnimationFrame(animationId.current);
    }

    const throttledScroll = throttle(400, scroll);

    window.addEventListener("scroll", throttledScroll);

    return () => {
      cancelAnimationFrame(animationId.current);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [props.scrollRef]);

  const handleClick = React.useCallback(() => {
    const scrollIntoViewNode = props.scrollRef.current;

    if (scrollIntoViewNode) {
      scrollIntoView(scrollIntoViewNode, {
        behavior: "smooth",
        scrollMode: "if-needed",
      });

      setTimeout(() => {
        setShowing(false);
      }, 400);
    }
  }, [props.scrollRef]);

  return (
    <Container>
      {showing && (
        <Button small onClick={handleClick}>
          Scroll to top
        </Button>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--depth1);
`;
