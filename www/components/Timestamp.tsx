import styled from "@emotion/styled";
import * as React from "react";
import useDateLabel from "www/hooks/useDateLabel";
import useTimeFromNow from "www/hooks/useTimeFromNow";
import Tooltip from "./Tooltip";

export default function Timestamp({ time }: { time: Date }) {
  const timeFromNow = useTimeFromNow({
    date: new Date(time),
  });

  const label = useDateLabel(time);

  return (
    <Tooltip label={label} aria-label={label}>
      <Span>{timeFromNow}</Span>
    </Tooltip>
  );
}

const Span = styled.div`
  display: inline-block;
  cursor: default;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  cursor: default;
`;
