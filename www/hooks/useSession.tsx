import { TUser } from "lib/types";
import Router from "next/router";
import React from "react";
import useSWR from "swr";
import {
  getUser,
  login,
  register,
  submitResetPassword,
  requestResetPassword,
} from "www/requests/session";

export const REDIRECT_TO_POST_AUTH = "shimmer-redirect-post-auth";

type Props = {
  redirectToIfValidSession?: string;
  redirectToIfNoValidSession?: string;
  initialData?: any;
};

export function useSession({
  redirectToIfNoValidSession = undefined,
  redirectToIfValidSession = undefined,
  initialData = undefined,
}: Props = {}): {
  user?: TUser;
  handleLoginWithEmail: (values: {
    email: string;
    password: string;
  }) => Promise<any>;
  handleRegisterWithEmail: (values: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<any>;
  handleRequestResetPassword: (values: { email: string }) => Promise<any>;
  handleResetPassword: (values: {
    email: string;
    token: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<any>;
  loading: boolean;
  error: boolean;
} {
  const { data, error, mutate } = useSWR("/api/session", getUser, {
    initialData,
    dedupingInterval: 15000,
  });

  const loading = !data;

  const sessionId = data && data.data && data.data.id;
  // This effect handles all redirect logic
  React.useEffect(() => {
    if (loading) return;

    if (!sessionId && redirectToIfNoValidSession) {
      window.localStorage.setItem(
        REDIRECT_TO_POST_AUTH,
        window.location.pathname
      );
      // @ts-ignore hard refresh will reset SWR cache.
      window.location = redirectToIfNoValidSession;

      return;
    }

    if (sessionId && redirectToIfValidSession) {
      const storageRedirect = window.localStorage.getItem(
        REDIRECT_TO_POST_AUTH
      );

      if (storageRedirect) {
        window.localStorage.removeItem(REDIRECT_TO_POST_AUTH);
        try {
          Router.push(storageRedirect);
        } catch {
          Router.push(redirectToIfValidSession);
        }
      } else {
        Router.push(redirectToIfValidSession);
      }

      return;
    }
  }, [
    loading,
    redirectToIfNoValidSession,
    redirectToIfValidSession,
    sessionId,
  ]);

  const handleLoginWithEmail = React.useCallback(
    async (values: { email: string; password: string }) => {
      const response = await login(values);
      return mutate(response, false);
    },
    [mutate]
  );

  const handleRegisterWithEmail = React.useCallback(
    async (values: {
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      password: string;
      passwordConfirmation: string;
    }) => {
      return mutate(register(values), false);
    },
    [mutate]
  );

  const handleRequestResetPassword = React.useCallback(
    async (values: { email: string }) => {
      // No need to mutate here as no user will be returned
      return requestResetPassword(values);
    },
    []
  );

  const handleResetPassword = React.useCallback(
    async (values: {
      email: string;
      token: string;
      password: string;
      passwordConfirmation: string;
    }) => {
      // Same here – no need to mutate as no user will be returned.
      return mutate(submitResetPassword(values), false);
    },
    [mutate]
  );

  return {
    user: data?.data,
    handleLoginWithEmail,
    handleRegisterWithEmail,
    handleRequestResetPassword,
    handleResetPassword,
    loading,
    error,
  };
}
