/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import { TClipVisibility, TInvitation } from "lib/types";
import { useRouter } from "next/router";
import * as React from "react";
import { mutate } from "swr";
import useClipboard from "www/hooks/useClipboard";
import { metaKey } from "www/lib/platform";
import { useClipInvitationRequest } from "www/requests/hooks/useClipInvitationRequest";
import { createInvitation, removeInvitation } from "www/requests/invitations";
import * as yup from "yup";
import Button from "../Button";
import SquareButton from "../Button/SquareButton";
import Checkbox from "../Checkbox";
import Displace from "../Displace";
import Flex from "../Flex";
import Floating from "../Floating";
import FloatingMenu from "../FloatingMenu";
import Icon from "../Icon";
import Input from "../Input";
import Menu from "../Menu";
import MenuItem from "../Menu/MenuItem";
import Spacer from "../Spacer";
import Timestamp from "../Timestamp";
import { H3, P } from "../Typography";
import useSaveClip from "./useSaveClip";

type Props = {
  clipId: string;
  visibility: TClipVisibility;
};

export default function ClipShare(props: Props) {
  const validationSchema = yup.object().shape({
    email: yup.string().email().required().label("Email"),
  });

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (values, helpers?: any) => {
      try {
        setLoading(true);

        const { invitation, ...rest } = await createInvitation({
          clipId: props.clipId,
          email: values.email,
          type: "viewClip",
        });

        if (invitation) {
          helpers?.resetForm();
          mutate(
            `/api/invitations?clipId=${props.clipId}`,
            async (cache) => {
              if (cache) {
                const invitations =
                  cache && cache.invitations ? cache.invitations.slice() : [];

                invitations.unshift(invitation);

                return {
                  invitations,
                };
              }

              return cache;
            },
            false
          );
        } else {
          console.log((rest as any).message);
        }
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    },
    [props.clipId]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: handleSubmit,
  });

  const handleKeyDown = React.useCallback(
    (event) => {
      if (metaKey(event) && event.key === "Enter") {
        handleSubmit(
          { email: formik.values.email },
          { resetForm: formik.resetForm }
        );
      }
    },
    [formik.resetForm, formik.values.email, handleSubmit]
  );

  const [visibility, setVisibility] = React.useState(props.visibility);

  const { submitClip } = useSaveClip({ clipId: props.clipId });

  const [isEditing, setEditing] = React.useState(false);

  const createClickHandler = React.useCallback(
    (value: "public" | "private") => () => {
      setVisibility(value);
      submitClip({
        type: "visibility",
        visibility: value,
      });
    },
    [submitClip]
  );

  const handleClickAddViewer = React.useCallback(() => setEditing(true), []);

  const { copy } = useClipboard();
  const { query } = useRouter();

  const handleClickCopyLink = React.useCallback(() => {
    const { protocol, host } = window.location;
    copy(protocol + "//" + host + `/${query.page}/clip/${props.clipId}`);
  }, [copy, props.clipId, query.page]);

  return (
    <Container>
      <TopSection>
        <div>
          <H3 size="small" weight="bold">
            Share
          </H3>
        </div>
        <div>
          <Button onClick={handleClickCopyLink}>Copy link</Button>
        </div>
      </TopSection>
      <Spacer spaces={2} />
      <P>Who can view this Clip?</P>
      <Spacer spaces={2} />
      <Checkbox
        id="anyone"
        label="Anyone with the link"
        checked={visibility === "public"}
        onChange={createClickHandler("public")}
      />
      <Spacer spaces={2} />
      <Checkbox
        id="not-anyone"
        label="Only people specified below"
        checked={visibility === "private"}
        onChange={createClickHandler("private")}
      />
      <Spacer spaces={2} />
      <div
        css={
          visibility === "public" &&
          css`
            opacity: 0.25;
          `
        }
      >
        {isEditing ? (
          <>
            <EmailSendForm
              onSubmit={formik.handleSubmit}
              onKeyDown={handleKeyDown}
            >
              <Input
                id="email"
                type="text"
                autoComplete="off"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Invite someone…"
                autoFocus={visibility === "private"}
                disabled={visibility === "public"}
              />
              <Button
                onClick={formik.handleSubmit as any} // formik will return (value: Object) => void
                disabled={formik.errors.email || !formik.dirty}
                isLoading={loading}
              >
                Send Invite
              </Button>
            </EmailSendForm>
          </>
        ) : (
          <>
            <Button
              onClick={handleClickAddViewer}
              disabled={visibility === "public"}
            >
              Add viewers
            </Button>
          </>
        )}
        <Spacer spaces={2} />
        <Invitations clipId={props.clipId} />
      </div>
    </Container>
  );
}

function Invitations({ clipId }: { clipId: string }) {
  const invitationRequest = useClipInvitationRequest(clipId);

  const invitations = invitationRequest.invitations || [];

  const accepted = React.useMemo(() => {
    return invitations.filter((i) => i.status === "accepted");
  }, [invitations]);

  const pending = React.useMemo(() => {
    return invitations.filter((i) => i.status === "pending");
  }, [invitations]);

  return (
    <>
      {invitationRequest.loading ? null : (
        <>
          {invitations.length ? (
            <>
              <P>Viewed</P>
              <Spacer />
              <P size="tiny" color="var(--secondaryTextColor)">
                People you have invited who have viewed this clip
              </P>
              <Spacer />
              {accepted.length ? (
                <>
                  <InvitationList>
                    {accepted.map((invitation) => {
                      return (
                        <InvitationItem
                          key={invitation.id}
                          invitation={invitation}
                          clipId={clipId}
                        />
                      );
                    })}
                  </InvitationList>
                  <Spacer />
                </>
              ) : null}
              <P>Sent</P>
              <Spacer />
              <P size="tiny" color="var(--secondaryTextColor)">
                People you have invited
              </P>
              <Spacer />
              {pending.length ? (
                <InvitationList>
                  {pending.map((invitation) => {
                    return (
                      <InvitationItem
                        key={invitation.id}
                        invitation={invitation}
                        clipId={clipId}
                      />
                    );
                  })}
                </InvitationList>
              ) : null}
            </>
          ) : (
            <Flex alignItems="center">
              <P size="tiny" weight="medium">
                Only you can view this Clip right now{" "}
              </P>
              <Icon icon="lock" />
            </Flex>
          )}
        </>
      )}
    </>
  );
}

function InvitationItem({
  invitation,
  clipId,
}: {
  invitation: TInvitation;
  clipId: string;
}) {
  const handleRemoveInvite = React.useCallback(async () => {
    try {
      await removeInvitation({ invitationId: invitation.id });

      mutate(
        `/api/invitations?clipId=${clipId}`,
        async (cache) => {
          if (cache) {
            const { invitations } = cache;

            return {
              invitations: invitations.filter((i) => i.id !== invitation.id),
            };
          }

          return cache;
        },
        false
      );
    } catch {}
  }, [clipId, invitation.id]);

  return (
    <InvitationListItem key={invitation.id}>
      <OverflowText>{invitation.email}</OverflowText>

      <Timestamp
        time={
          invitation.status === "accepted"
            ? invitation.updatedAt
            : invitation.createdAt
        }
      />

      <FloatingMenu
        placement="bottom-end"
        body={
          <Floating>
            <Menu>
              <MenuItem onClick={handleRemoveInvite} text="Remove" />
            </Menu>
          </Floating>
        }
      >
        {({ ref, onClick, isShowing, ...rest }) => (
          <SquareButton
            ref={ref}
            onClick={onClick}
            css={css`
              box-shadow: none;
              ${isShowing &&
              css`
                background: var(--buttonBackgroundColorActive);
              `}
            `}
          >
            <Icon icon="horizontal-overflow" fill="var(--textColor)" />
          </SquareButton>
        )}
      </FloatingMenu>
    </InvitationListItem>
  );
}

const OverflowText = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.1;
`;

const InvitationList = styled.ul`
  display: grid;
  gap: var(--unit);
  padding: var(--unit);
  box-shadow: 0 0 0 1px var(--gridColor);
`;

const InvitationListItem = styled.li`
  display: grid;
  grid-template-columns: 2fr 1fr max-content;
  gap: var(--unit);
  justify-content: space-between;
  align-items: center;
  font-family: var(--primaryFont);
  font-size: var(--fontSizeTiny);
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  padding: calc(var(--unit) * 2);
`;

const EmailSendForm = styled.form`
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: var(--unit);
`;
