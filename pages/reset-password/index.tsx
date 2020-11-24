import { useFormik } from "formik";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import * as React from "react";
import Button from "www/components/Button";
import Displace from "www/components/Displace";
import Form from "www/components/Form";
import Icon from "www/components/Icon";
import Input from "www/components/Input";
import Label from "www/components/Label";
import Layout from "www/components/Layout/AuthenticationScreensLayout";
import Link from "www/components/Link";
import Padding from "www/components/Padding";
import ReCAPTCHA from "www/components/ReCAPTCHA";
import Spacer from "www/components/Spacer";
import { H1, P } from "www/components/Typography";
import { useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().required().label("Email"),
});

export default function ResetPassword() {
  const session = useSession();

  const { withRecaptcha } = ReCAPTCHA.useRecaptcha();

  const [isLoading, setLoading] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const router = useRouter();

  const { addToast } = useToast();

  const handleSubmit = (values) => {
    setLoading(true);
    setIsSuccessful(false);

    withRecaptcha(
      async () => {
        try {
          const data = await session.handleRequestResetPassword(values);

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
            setIsSuccessful(true);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log("Unexpected error");
        }
      },
      () => setLoading(false)
    );
  };

  const formik = useFormik({
    initialValues: {
      email: router.query.email || "",
      password: "",
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Head>
        <title>Reset Password / Clips</title>
      </Head>
      <Layout
        subLinks={
          <P size="tiny">
            Have account information?
            <Link href="/login" as="/login">
              Log in
            </Link>
          </P>
        }
      >
        <>
          <Displace horizontal={-1}>
            <Icon
              icon="caret-left"
              onClick={() => {
                const route = `/login?method=password`;
                Router.push(route, route);
              }}
              title="Login using email link"
            />
          </Displace>
          <Spacer spaces={2} />
          <H1 size="medium" weight="bold">
            Reset password
          </H1>
          <Spacer />
          <P size="small">
            Enter the email associated with your account and we'll send you a
            link to reset your password
          </P>
          <Padding top={2}>
            <Form onSubmit={formik.handleSubmit}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
                autoFocus
              />
              <Spacer />
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                showSuccess={isSuccessful}
              >
                Send reset link
              </Button>
            </Form>
          </Padding>
        </>
      </Layout>
    </>
  );
}
