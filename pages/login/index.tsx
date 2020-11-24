import { useFormik } from "formik";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import * as React from "react";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import { redirectHome } from "server/utils/helpers";
import Button from "www/components/Button";
import Displace from "www/components/Displace";
import Flex from "www/components/Flex";
import Form from "www/components/Form";
import Icon from "www/components/Icon";
import Input from "www/components/Input";
import InputPasswordToggle from "www/components/Input/InputPasswordToggle";
import Label from "www/components/Label";
import Layout from "www/components/Layout/AuthenticationScreensLayout";
import Link from "www/components/Link";
import Padding from "www/components/Padding";
import ReCAPTCHA from "www/components/ReCAPTCHA";
import Spacer from "www/components/Spacer";
import { H1, P } from "www/components/Typography";
import { useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import { login } from "www/requests/session";
import * as yup from "yup";

const PASSWORD_METHOD = "password";

const sessionOptions = {
  redirectToIfValidSession: "/",
};

export default function Login() {
  const session = useSession(sessionOptions);

  const isValidating = false;

  const { withRecaptcha } = ReCAPTCHA.useRecaptcha();
  const [isLoading, setLoading] = React.useState(false);
  const [isEmailLoginSent, setEmailLoginSent] = React.useState(false);

  const router = useRouter();
  const method = router.query.method;

  React.useEffect(() => {
    if (method && method !== PASSWORD_METHOD) {
      Router.replace(router.pathname, router.pathname);
    }
  }, [method, router.pathname]);

  const validationSchema = React.useMemo(
    () =>
      method === PASSWORD_METHOD
        ? yup.object().shape({
            email: yup.string().email().required().label("Email"),
            password: yup.string().min(8).required().label("Password"),
          })
        : yup.object().shape({
            email: yup.string().email().required().label("Email"),
          }),
    [method]
  );

  const { addToast } = useToast();

  const handleSubmit = React.useCallback(
    (values: { email: string; password: string }) => {
      setLoading(true);

      setEmailLoginSent(false);

      withRecaptcha(
        async () => {
          try {
            let data;

            if (method === PASSWORD_METHOD) {
              data = await session.handleLoginWithEmail(values);
            } else {
              data = await login(values, { withEmail: true });
            }

            if (method !== PASSWORD_METHOD) {
              setEmailLoginSent(true);
              setLoading(false);
            }

            if (data.error) {
              setLoading(false);
              addToast({
                type: "self-destruct",
                children: (
                  <P size="small" weight="medium">
                    Invalid login credentials
                  </P>
                ),
              });
            }
          } catch (err) {
            setLoading(false);
            console.log("Unexpected error");
          }
        },
        () => setLoading(false)
      );
    },
    [addToast, method, session, withRecaptcha]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  const handleLoginUsingPasswordClick = React.useCallback(() => {
    const route = `${router.pathname}?method=password`;
    Router.push(route, route);
  }, [router.pathname]);

  const handleLoginUsingLinkClick = React.useCallback(() => {
    const route = `${router.pathname}`;
    Router.push(route, route);
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>Login / Clips</title>
      </Head>
      <Layout
        subLinks={
          <P size="tiny">
            Don't have an account?
            <Link href="/register" as="/register">
              Create one
            </Link>
          </P>
        }
      >
        <>
          {method && (
            <>
              <Displace horizontal={-1}>
                <Icon
                  icon="caret-left"
                  onClick={handleLoginUsingLinkClick}
                  title="Login using email link"
                />
              </Displace>
              <Spacer spaces={2} />
            </>
          )}
          <H1 size="medium" weight="bold">
            Log in to your account
          </H1>
          <Padding top={3}>
            <Form onSubmit={formik.handleSubmit}>
              <Label htmlFor="email">Email</Label>
              <Input
                key={method as React.Key} // Force rerender when method changes, so autoFocus resets focus.
                id="email"
                type="text"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
                autoFocus
              />
              <Spacer />
              {!method && (
                <>
                  <Button
                    type="submit"
                    disabled={isValidating || isLoading}
                    isLoading={isLoading}
                    showSuccess={isEmailLoginSent}
                  >
                    Send me a login link
                  </Button>
                  <Flex justifyContent="center">
                    <Link
                      disabled={isLoading}
                      onClick={handleLoginUsingPasswordClick}
                    >
                      Log in using password
                    </Link>
                  </Flex>
                </>
              )}
              {method === PASSWORD_METHOD && (
                <>
                  <InputPasswordToggle>
                    <Flex
                      row
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Label htmlFor="password">Password</Label>
                      <Link
                        // @ts-ignore
                        tabIndex="-1"
                        href={`/reset-password${
                          formik.values.email && !formik.errors.email
                            ? "?email=" + formik.values.email
                            : ""
                        }`}
                        as={`/reset-password${
                          formik.values.email && !formik.errors.email
                            ? "?email=" + formik.values.email
                            : ""
                        }`}
                      >
                        Forgot password?
                      </Link>
                    </Flex>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && formik.errors.password}
                    />
                  </InputPasswordToggle>
                  <Spacer />
                  <Button
                    type="submit"
                    disabled={isValidating || isLoading}
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </>
              )}
            </Form>
          </Padding>
        </>
      </Layout>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = (await getCurrentUser(req)) || null;

  if (user) {
    redirectHome(res, user);
  }

  return {
    props: {},
  };
});
