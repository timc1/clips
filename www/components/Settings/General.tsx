/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import {
  AVATAR_URL,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MIN_FIRST_NAME_LENGTH,
  MIN_LAST_NAME_LENGTH,
} from "lib/constants";
import Head from "next/head";
import * as React from "react";
import { mutate } from "swr";
import useImageUploader from "www/hooks/useImageUploader";
import { REDIRECT_TO_POST_AUTH, useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import { updateProfilePhoto, updateUser } from "www/requests/user";
import * as yup from "yup";
import Button from "../Button";
import Form from "../Form";
import Input from "../Input";
import Label from "../Label";
import Loading from "../Loading";
import ReCAPTCHA from "../ReCAPTCHA";
import Spacer from "../Spacer";
import { H3, P } from "../Typography";
import UserImage from "../UserImage";

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(MIN_FIRST_NAME_LENGTH)
    .max(MAX_FIRST_NAME_LENGTH)
    .required()
    .label("First Name"),
  lastName: yup
    .string()
    .min(MIN_LAST_NAME_LENGTH)
    .max(MAX_LAST_NAME_LENGTH)
    .required()
    .label("Last Name"),
});

export default function SettingsGeneral() {
  const { withRecaptcha } = ReCAPTCHA.useRecaptcha();

  const session = useSession();

  const [resetPasswordState, setResetPasswordState] = React.useState("idle");

  const { addToast } = useToast();

  const handleSendResetPasswordLink = React.useCallback(() => {
    setResetPasswordState("loading");

    window.localStorage.setItem(REDIRECT_TO_POST_AUTH, "/settings");

    withRecaptcha(
      async () => {
        try {
          const data = await session.handleRequestResetPassword({
            email: session.user.email,
          });

          if (data.error) {
            addToast({
              type: "self-destruct",
              children: (
                <P size="small" weight="medium">
                  {data.error.message}
                </P>
              ),
            });
          } else {
            setResetPasswordState("success");
          }
        } catch (err) {
          setResetPasswordState("error");
          console.log("Unexpected error");
        }
      },
      () => setResetPasswordState("error")
    );
  }, [addToast, session, withRecaptcha]);

  const [updateNameState, setUpdateNameState] = React.useState("idle");

  const handleSubmitNameUpdate = React.useCallback(
    async (values) => {
      setUpdateNameState("loading");

      withRecaptcha(
        async () => {
          try {
            await updateUser(values);
            setUpdateNameState("success");
          } catch (err) {
            setUpdateNameState("error");
            console.log("Unexpected error");
          }
        },
        () => setUpdateNameState("error")
      );
    },
    [withRecaptcha]
  );

  const fileLabelRef = React.useRef<HTMLLabelElement | null>(null);

  const handleToggleFiles = React.useCallback(() => {
    if (fileLabelRef.current) {
      fileLabelRef.current.click();
    }
  }, []);

  const { upload, loading: imageUploading } = useImageUploader();

  const handleUploadAvatar = React.useCallback(
    async (event) => {
      const file = event.target.files[0];
      const contents = await upload([file], {
        Bucket: "shimmer-avatars",
      });

      const key = contents[0].md5;
      await updateProfilePhoto(key);
      mutate("/api/session");
    },
    [upload]
  );

  const formik = useFormik({
    initialValues: {
      firstName: session.user?.firstName,
      lastName: session.user?.lastName,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmitNameUpdate,
  });

  return (
    <>
      <Head>
        <title>Settings · {session.user?.username}</title>
      </Head>
      <Container>
        <SectionWrapper>
          <H3 weight="bold">Name</H3>
          <Spacer spaces={2} />
          <Form onSubmit={formik.handleSubmit}>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && formik.errors.firstName}
              autoFocus
            />
            <Spacer />
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && formik.errors.lastName}
            />
            <Spacer />
            <Button
              type="submit"
              isLoading={updateNameState === "loading"}
              showSuccess={updateNameState === "success"}
            >
              Update
            </Button>
          </Form>
        </SectionWrapper>
        <SectionWrapper>
          <H3 weight="bold">Profile photo</H3>
          <Spacer />
          <P>Click on this image to upload a new avatar from your files.</P>
          <Spacer spaces={2} />
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleUploadAvatar}
            css={css`
              visibility: hidden;
              width: 0;
              height: 0;
            `}
          />
          <label
            ref={fileLabelRef}
            htmlFor="avatar"
            css={css`
              display: inline-flex;
            `}
          >
            <UserImage
              src={
                session.user?.profileImage &&
                AVATAR_URL + session.user.profileImage
              }
              size="large"
              alt={session.user?.firstName}
              onClick={handleToggleFiles}
              disabled={imageUploading}
              css={
                imageUploading &&
                css`
                  opacity: 0.5;
                `
              }
            />
          </label>
          {imageUploading && <Loading size="xsmall" />}
        </SectionWrapper>
        <SectionWrapper>
          <H3 weight="bold">Update password</H3>
          <Spacer />
          <P>
            Click the link below and we'll send you a link to reset your
            password.
          </P>
          <Spacer spaces={2} />
          <Button
            onClick={handleSendResetPasswordLink}
            isLoading={resetPasswordState === "loading"}
            showSuccess={resetPasswordState === "success"}
          >
            Send reset password link
          </Button>
        </SectionWrapper>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  gap: calc(var(--unit) * 4);
`;

const SectionWrapper = styled.div`
  padding: calc(var(--unit) * 2);
  box-shadow: 0 0 0 1px var(--dividerColor);
`;
