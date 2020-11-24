import Bricks from "bricks.js";
import * as React from "react";

type Props = {
  ref: { current: (instance: any) => void };
  items: any[];
  sizes: { columns: number; gutter: number }[]; // Make sure to useMemo this array.
  controlled?: boolean; // `controlled` signifies that the user will control when repacking occurs.
};

export default function useBricks(props: Props) {
  const instance = React.useRef(null);

  const { items, ref, sizes } = props;

  const hasItems = items && items.length;

  React.useEffect(() => {
    if (hasItems) {
      instance.current = Bricks({
        container: ref.current,
        packed: "data-packed",
        sizes,
      }); // .resize(true); no need for resize as we're just using a 2 column grid

      if (process.env.NODE_ENV === "development") {
        instance.current
          .on("pack", () => console.log("ALL grid items packed."))
          .on("update", () => console.log("NEW grid items packed."))
          .on("resize", (size) =>
            console.log(
              "The grid has be re-packed to accommodate a new BREAKPOINT."
            )
          );
      }
    }
  }, [hasItems, ref, sizes]);

  const itemsLength = items ? items.length : 0;

  React.useEffect(() => {
    if (itemsLength && !props.controlled) {
      instance.current.pack();
    }
  }, [itemsLength, props.controlled]);

  const repack = React.useCallback(
    () => instance.current && instance.current.pack(),
    []
  );

  return {
    repack,
  };
}
