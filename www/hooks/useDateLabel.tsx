import * as React from "react";

// Format: Sat Oct 10 2020 · 9:57:13 PM
export default function useDateLabel(date: Date) {
  const label = React.useMemo(() => {
    const d = date && new Date(date);
    return (
      d &&
      `${d.toDateString()} ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }, [date]);

  return label;
}
