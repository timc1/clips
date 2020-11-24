import getApiUrl from "lib/getApiUrl";
import { TUser } from "lib/types";
import { client } from "../lib/ApiClient";

type Return = {
  data?: TUser;
  error?: any;
};

export const getUser = async (): Promise<Return> => {
  const response = await client.get(`${getApiUrl()}/api/session`);

  return {
    data: response.user,
    error: response.error,
  };
};

export const register = async (values: Object): Promise<Return> => {
  const response = await client.post(`${getApiUrl()}/api/user`, values);

  return {
    data: response.user,
    error: response,
  };
};

export const login = async (
  values: Object,
  options?: { withEmail?: boolean }
): Promise<Return> => {
  const response = await client.post(
    `${getApiUrl()}/api/session${options?.withEmail ? "?method=email" : ""}`,
    values
  );

  return {
    data: response.user,
    error: response.error,
  };
};

export const logout = () => client.delete(`${getApiUrl()}/api/session`);

export const requestResetPassword = async (values: Object): Promise<Return> => {
  const response = await client.post(
    `${getApiUrl()}/api/user?method=reset-password`,
    values
  );

  return {
    data: response.data,
    error: response.error,
  };
};

export const submitResetPassword = async (values: Object): Promise<Return> => {
  const response = await client.put(
    `${getApiUrl()}/api/user?method=reset-password`,
    values
  );

  return {
    data: response.user,
    error: response.error,
  };
};
