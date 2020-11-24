import styled from "@emotion/styled";
import { useFormik } from "formik";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_FIRST_NAME_LENGTH,
  MIN_FIRST_NAME_LENGTH,
  MIN_LAST_NAME_LENGTH,
} from "lib/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import Button from "www/components/Button";
import Form from "www/components/Form";
import Input from "www/components/Input";
import InputPasswordToggle from "www/components/Input/InputPasswordToggle";
import Label from "www/components/Label";
import Link from "www/components/Link";
import Padding from "www/components/Padding";
import ReCAPTCHA from "www/components/ReCAPTCHA";
import Spacer from "www/components/Spacer";
import { H1, P } from "www/components/Typography";
import { useSession } from "www/hooks/useSession";
import useToast from "www/hooks/useToast";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email().required().label("Email"),
  username: yup
    .string()
    .min(MIN_USERNAME_LENGTH)
    .max(MAX_USERNAME_LENGTH)
    .required()
    .label("Username"),
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
  password: yup.string().min(8).required().label("Password"),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .label("Confirm Password"),
});

const sessionOptions = {
  redirectToIfValidSession: "/",
};

export default function Register() {
  const session = useSession(sessionOptions);
  const { push } = useRouter();

  const { withRecaptcha } = ReCAPTCHA.useRecaptcha();

  const [isLoading, setLoading] = React.useState(false);

  const { addToast } = useToast();

  const handleSubmit = React.useCallback(
    async (values) => {
      setLoading(true);

      withRecaptcha(
        async () => {
          try {
            const data = await session.handleRegisterWithEmail(values);

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
              push("/", "/");
            }
          } catch (err) {
            setLoading(false);
            console.log("Unexpected error");
          }
        },
        () => setLoading(false)
      );
    },
    [addToast, push, session, withRecaptcha]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Head>
        <title>Register / Clips</title>
      </Head>
      <Container>
        <Info>Info here</Info>
        <FormContainer>
          <H1 size="large" weight="bold">
            Register
          </H1>
          <Spacer />
          <P>Create your Shimmer account</P>

          <Padding top={4} bottom={4}>
            <Form onSubmit={formik.handleSubmit}>
              <Label htmlFor="email">Email</Label>
              <Input
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && formik.errors.username}
              />
              <Spacer />
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
              />
              <Spacer />
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
              />
              <Spacer />
              <InputPasswordToggle>
                <>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.passwordConfirmation &&
                      formik.errors.passwordConfirmation
                    }
                  />
                </>
              </InputPasswordToggle>
              <Spacer />
              <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                Register
              </Button>
            </Form>
            <Spacer spaces={2} />
            <P size="tiny">
              Already have an account?
              <Link href="/login" as="/login">
                Log in
              </Link>
            </P>
          </Padding>
        </FormContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1fr;
`;

const Info = styled.div`
  border-right: 1px solid var(--gridColor);
  height: 100vh;
  position: sticky;
  top: 0;
`;

const FormContainer = styled.div`
  padding: calc(var(--unit) * 12) calc(var(--unit) * 10);
  max-width: 550px;
  width: 100%;
`;
