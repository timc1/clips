import * as React from "react";
import { P } from "www/components/Typography";
import useToast from "./useToast";

export default function useClipboard() {
  const { addToast } = useToast();

  const copy = React.useCallback(
    (value: string) => {
      navigator.clipboard.writeText(value).then(function () {
        addToast({
          type: "self-destruct",
          children: (
            <P size="small" weight="medium">
              Copied link to clipboard
            </P>
          ),
        });
      });
    },
    [addToast]
  );

  return {
    copy,
  };
}
