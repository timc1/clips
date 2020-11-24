/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import isElementInViewport from "lib/isElementInViewport";
import * as React from "react";
import { Waypoint } from "react-waypoint";
import { debounce } from "throttle-debounce";
import useMounted from "www/hooks/useMounted";
import { client } from "../../lib/ApiClient";
import cache from "./cache";

type Props = {
  lazy?: boolean;
  alt?: string;
  url: string;
  onLoaded?: () => void;
  render?: React.ReactNode;
  height?: number;
  width?: number;
  zIndex?: number;
};

export default function Image(props: Props) {
  const [src, setSrc] = React.useState(() => {
    const cached = cache.get(props.url);

    if (cached) {
      return cached;
    }
  });
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(!src);

  const ref = React.useRef();

  const mounted = useMounted();

  const loadImage = React.useCallback(
    debounce(200, async (url: string) => {
      if (src || !mounted.current) {
        return;
      }

      const node = ref.current;

      if (node) {
        const visible = isElementInViewport(ref.current);

        if (!visible) {
          return;
        }
      }

      setLoading(true);

      try {
        const { url: signedUrl } = await client.get(url);

        const img = new window.Image();

        img.src = signedUrl;

        img.onload = () => {
          if (mounted.current) {
            setSrc(signedUrl);
            setLoading(false);
            cache.set(props.url, signedUrl);
          }
        };

        img.onerror = () => {
          if (mounted.current) {
            setLoading(false);
            setError(true);
          }
        };
      } catch {
        if (mounted.current) {
          setLoading(false);
          setError(true);
        }
      }
    }),
    [src]
  );

  const { onLoaded } = props;

  React.useEffect(() => {
    if (src && !loading) {
      if (onLoaded) {
        onLoaded();
      }
    }
  }, [loading, onLoaded, props.onLoaded, src]);

  React.useEffect(() => {
    if (!props.url || props.lazy) {
      return;
    }

    loadImage(props.url);
  }, [loadImage, props.url, props.lazy]);

  let Component = (
    <Container ref={ref}>
      <Img
        src={src}
        // alt={props.alt || ""} no alt because it messes with the height when `src` does not exist
        width={props.width}
        height={props.height}
        $loading={loading || !src}
      />
      <Loader />
      {loading || !src ? null : props.render}
    </Container>
  );

  return props.lazy && !src ? (
    <Waypoint onEnter={() => loadImage(props.url)}>{Component}</Waypoint>
  ) : (
    Component
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Loader = styled.span``;

const Img = styled.img<{ $loading: boolean }>`
  width: 100%;
  height: auto;
  user-select: none;
  transition: opacity 100ms linear;
  align-self: flex-start;

  + ${Loader} {
    user-select: none;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 100ms linear;
    opacity: 0;
  }

  ${(props) =>
    props.$loading &&
    css`
      opacity: 0;

      + ${Loader} {
        opacity: 1;
      }
    `}
`;
