import styled from "@emotion/styled";
import React from "react";
import Button from "www/components/Button";
import { metaKey } from "../../lib/platform";

export function SubmitButton({
  onSubmit,
  isLoading,
  disabled,
  children,
}: {
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  children?: React.ReactNode;
}) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (metaKey(event) && event.key === "Enter" && !disabled) {
        onSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSubmit, disabled]);

  return (
    <ButtonContainer>
      <Button
        type="submit"
        disabled={disabled || isLoading}
        isLoading={isLoading}
        onClick={onSubmit}
      >
        {children || "Submit"}
      </Button>
    </ButtonContainer>
  );
}

const ButtonContainer = styled.div`
  width: max-content;
  margin-left: auto;
`;
