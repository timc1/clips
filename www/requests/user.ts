import getApiUrl from "lib/getApiUrl";
import { TUser } from "lib/types";
import { mutate } from "swr";
import { client } from "../lib/ApiClient";

export async function fetchUser(
  userId: string
): Promise<{
  user?: TUser;
}> {
  const response = await client.get(`${getApiUrl()}/api/user`, { userId });

  if (response.error) {
    throw response.error;
  }

  return {
    user: response.user,
  };
}

export async function updateUser({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): Promise<{
  user?: TUser;
}> {
  const user = await client.put(`${getApiUrl()}/api/user`, {
    firstName,
    lastName,
  });

  mutate("/api/session");

  return user;
}

export async function updateProfilePhoto(key: string) {
  return client.put(`${getApiUrl()}/api/user?method=update-profile-photo`, {
    key,
  });
}
