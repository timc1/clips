import * as React from "react";

/*
  InputPasswordToggle
  -------------------

  Maps through each nested child recursively and if the child is an an
  <Input /> component, pass isPasswordShowing and setPasswordShowing as props.
*/

type Props = {
  children: React.ReactNode;
};

export default function InputPasswordToggle(props: Props) {
  const [isPasswordShowing, setPasswordShowing] = React.useState(false);

  const handleSetPasswordShowing = React.useCallback(() => {
    setPasswordShowing(!isPasswordShowing);
  }, [isPasswordShowing]);

  const mapPropsToChildren = () => {
    const recursiveMap = (children: React.ReactNode) => {
      return React.Children.map(children, (child: React.ReactChild) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        // displayName does exist on child
        // @ts-ignore
        if (child.type.displayName === "Input") {
          child = React.cloneElement(child, {
            isPasswordShowing,
            setPasswordShowing: handleSetPasswordShowing,
          });
        }

        if (child.props.children) {
          child = React.cloneElement(child, {
            children: recursiveMap(child.props.children),
          });
        }

        return child;
      });
    };

    return recursiveMap(props.children);
  };

  return mapPropsToChildren();
}
