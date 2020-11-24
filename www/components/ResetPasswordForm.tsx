import { useFormik } from "formik";
import Router from "next/router";
import * as React from "react";
import Form from "www/components/Form";
import AuthenticationScreensLayout from "www/components/Layout/AuthenticationScreensLayout";
import { REDIRECT_TO_POST_AUTH, useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import * as yup from "yup";
import Button from "./Button";
import Input from "./Input";
import InputPasswordToggle from "./Input/InputPasswordToggle";
import Label from "./Label";
import Padding from "./Padding";
import ReCAPTCHA from "./ReCAPTCHA";
import Spacer from "./Spacer";
import { H1, P } from "./Typography";

type Props = {
  email: string;
  token: string;
};

const validationSchema = yup.object().shape({
  password: yup.string().min(8).required().label("New Password"),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .label("Confirm Password"),
});

export default function ResetPasswordForm(props: Props) {
  const session = useSession();

  const { withRecaptcha } = ReCAPTCHA.useRecaptcha();

  const [isLoading, setLoading] = React.useState(false);

  const { addToast } = useToast();

  const { handleResetPassword } = session;

  const handleSubmit = React.useCallback(
    (values) => {
      setLoading(true);

      withRecaptcha(
        async () => {
          try {
            const data = await handleResetPassword(values);

            if (data.error) {
              setLoading(false);
              addToast({
                type: "self-destruct",
                children: (
                  <P size="small" weight="medium">
                    {data.error.message}
                  </P>
                ),
              });
            } else {
              const storageRedirect = window.localStorage.getItem(
                REDIRECT_TO_POST_AUTH
              );

              if (storageRedirect) {
                Router.push(storageRedirect);
              } else {
                Router.push("/", "/");
              }
            }
          } catch (err) {
            setLoading(false);
            console.log("Unexpected error");
          }
        },
        () => setLoading(false)
      );
    },
    [addToast, handleResetPassword, withRecaptcha]
  );

  const formik = useFormik({
    initialValues: {
      email: props.email,
      token: props.token,
      password: "",
      passwordConfirmation: "",
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  return (
    <AuthenticationScreensLayout>
      <H1 size="medium" weight="bold">
        Confirm your new password
      </H1>
      <Padding top={2}>
        <Form onSubmit={formik.handleSubmit}>
          <InputPasswordToggle>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />
            <Spacer />
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation
              }
            />
          </InputPasswordToggle>
          <Spacer />
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            Confirm new password
          </Button>
        </Form>
      </Padding>
    </AuthenticationScreensLayout>
  );
}
