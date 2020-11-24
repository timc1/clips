import {
  InvalidValidationRequestError,
  ValidationError,
  InvalidCredentialsError,
} from "lib/errors";
import { loginRoute } from "lib/routes";
import Router, { useRouter } from "next/router";
import * as React from "react";
import { mutate } from "swr";
import Loading from "www/components/Loading";
import ResetPasswordForm from "www/components/ResetPasswordForm";
import { REDIRECT_TO_POST_AUTH, useSession } from "www/hooks/useSession";
import { client } from "www/lib/ApiClient";

export default function Validations() {
  const [isValidating, setValidating] = React.useState(true);
  const [validationUI, setValidationUI] = React.useState(null);
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();

  const userEmail = user?.email;

  React.useEffect(() => {
    const { type } = router.query;

    if (!type || sessionLoading) {
      return;
    }

    async function validate(type) {
      try {
        switch (type) {
          case "invitations": {
            const { email, clipId, token } = router.query;
            const data = await validateClipInvitation(
              email as string,
              clipId as string,
              token as string
            );

            if (data.error) {
              Router.replace(loginRoute);
            } else {
              const asPath = `/${data.creator}/clip/${data.clipId}`;

              if (userEmail === email) {
                Router.replace(asPath);
              } else {
                window.localStorage.setItem(REDIRECT_TO_POST_AUTH, asPath);
                Router.replace(loginRoute);
              }
            }

            break;
          }
          case "reset-password": {
            const { email, token } = router.query;
            const data = await validateResetPassword(
              email as string,
              token as string
            );
            if (data.ok) {
              setValidating(false);
              setValidationUI(
                <ResetPasswordForm
                  email={email.toString()}
                  token={token.toString()}
                />
              );
            } else {
              throw new InvalidCredentialsError();
            }
            break;
          }
          case "email-signin": {
            const { email, token } = router.query;
            const data = await validateSigninLink(
              email as string,
              token as string
            );

            if (data.ok) {
              mutate("/api/session", { data: data.user });

              const storageRedirect = window.localStorage.getItem(
                REDIRECT_TO_POST_AUTH
              );

              if (storageRedirect) {
                window.localStorage.removeItem(REDIRECT_TO_POST_AUTH);
                try {
                  const route = JSON.parse(storageRedirect);
                  if (route) {
                    Router.push(route.pathname, route.asPath);
                  }
                } catch {
                  Router.replace(`/${data.user.username}`);
                }
              } else {
                Router.replace(`/${data.user.username}`);
              }
            } else {
              throw new InvalidCredentialsError();
            }

            break;
          }
          default:
            throw new InvalidValidationRequestError();
        }
      } catch (error) {
        setValidating(false);

        if (
          error instanceof InvalidValidationRequestError ||
          // ValidationError: "type" is valid, but maybe an incorrecty formatted query param needed was passed.
          error instanceof ValidationError
        ) {
          Router.replace("/404");
          return;
        }

        if (error instanceof InvalidCredentialsError) {
          setValidationUI(<div>Invalid credentials</div>);
          return;
        }

        setValidationUI(<div>something went wrong screen!</div>);
      }
    }

    try {
      validate(type);
    } catch (error) {
      if (error instanceof InvalidValidationRequestError) {
        Router.replace("/404");
      }
    }
  }, [router.asPath, router.pathname, router.query, sessionLoading, userEmail]);

  if (isValidating) {
    return <Loading fullPage size="large" fill="var(--tertiaryTextColor)" />;
  }

  return validationUI;
}

/*
  These URL validations can just be placed in this file. Once it gets too big we
  can split them into a file inside /server ☺️
*/

// This function already returns a promise, so there needn't be an async :)
function validateResetPassword(email: string, token: string) {
  if (!email || !token) {
    throw new ValidationError();
  }

  return client.get("/api/validations/reset-password", { email, token });
}

function validateSigninLink(email: string, token: string) {
  if (!email || !token) {
    throw new ValidationError();
  }

  return client.get("/api/session", { email, token });
}

function validateClipInvitation(email: string, clipId: string, token: string) {
  return client.get("/api/validations/invitations", { email, clipId, token });
}
