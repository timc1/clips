import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { AVATAR_URL } from "lib/constants";
import * as React from "react";
import { useSession } from "www/hooks/useSession";
import { metaKey } from "www/lib/platform";
import Button from "./Button";
import Displace from "./Displace";
import MarkdownEditor from "./MarkdownEditor";
import UserImage from "./UserImage";

type Props = {
  onSubmit: (value: string) => void;
  isSubmitting?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  submitText?: string;
  onClickCancel?: () => void;
  defaultValue?: string;
};

export default function CommentReplyForm(props: Props) {
  const [value, setValue] = React.useState(props.defaultValue || "");

  const handleChange = React.useCallback((value: string) => {
    setValue(value);
  }, []);

  const { onSubmit } = props;

  const handleSubmit = React.useCallback(() => {
    if (!value) {
      return;
    }

    setValue("");
    onSubmit(value);
  }, [onSubmit, value]);

  const [autoFocus, setAutoFocus] = React.useState(props.autoFocus);

  const handleKeyDown = React.useCallback(
    (event) => {
      if (metaKey(event) && event.key === "Enter") {
        setAutoFocus(true);
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const session = useSession();

  return (
    <ReplyContainer>
      <Displace vertical={0.5}>
        <UserImage
          size="tiny"
          src={
            session.user?.profileImage && AVATAR_URL + session.user.profileImage
          }
          alt="User image"
        />
      </Displace>
      <MarkdownEditor
        key={props.isSubmitting ? "reset" : ""}
        defaultValue={value}
        placeholder="Add a note…"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        isFocused={autoFocus}
        large
      />

      <ReplyButtonContainer
        isShowing={!!value}
        showBackgroundTint={!!props.onClickCancel}
      >
        {!!props.onClickCancel && (
          <Button
            disabled={!value}
            onClick={props.onClickCancel}
            css={css`
              box-shadow: none;
              background: none;
            `}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!value || props.isSubmitting}
          isLoading={props.isSubmitting}
        >
          {props.submitText || "Add note"}
        </Button>
      </ReplyButtonContainer>
    </ReplyContainer>
  );
}

const ReplyContainer = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: var(--unit);
  position: relative;
`;

const ReplyButtonContainer = styled.div<{
  isShowing: boolean;
  showBackgroundTint?: boolean;
}>`
  display: grid;
  align-self: end;
  gap: var(--unit);
  margin-bottom: calc(var(--unit) * 1.75);
  opacity: ${(props) => (props.isShowing ? 1 : 0.5)};

  ${(props) =>
    props.showBackgroundTint &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: 8px;
        background: var(--commentBackgroundTint);
        z-index: -1;
        pointer-events: none;
        touch-action: none;
      }
    `}
`;
