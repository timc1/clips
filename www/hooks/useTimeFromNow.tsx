import fromNow from "lib/fromNow";
import * as React from "react";

type Props = {
  date: Date;
};

const TEN_SECONDS = 10000;

export default function useTimeFromNow(props: Props) {
  const interval = React.useRef(null);
  const [value, setValue] = React.useState("");

  const time = props.date && props.date.getTime();
  React.useEffect(() => {
    if (time) {
      interval.current = setInterval(() => {
        setValue(fromNow(time));
      }, TEN_SECONDS);

      setValue(fromNow(time));
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [time]);

  return value;
}
