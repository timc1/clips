import * as React from "react";
import { useRemirror } from "remirror/react";

type Props = {
  innerRef?: any;
  isFocused?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

export default function Editor(props: Props) {
  const { getRootProps, focus, view } = useRemirror({
    autoUpdate: true,
  });

  React.useEffect(() => {
    if (props.isFocused) {
      focus(view.state.doc.nodeSize);
    }
  }, [focus, props.isFocused, view]);

  const ref = React.useRef(null);

  React.useEffect(() => {
    const node = ref.current;

    if (node) {
      const editor = node.querySelector(
        "[contenteditable], .Prosemirror.remirror-editor"
      );

      if (editor) {
        editor.tabIndex = 0;
      }
    }
  }, []);

  return <div {...getRootProps({ ref })} onKeyDown={props.onKeyDown} />;
}
