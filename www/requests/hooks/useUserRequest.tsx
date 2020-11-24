import { TUser } from "lib/types";
import useSWR from "swr";
import { fetchUser } from "../user";

type Props = {
  userId?: string;
  user?: TUser;
};

export function useUserRequest(props: Props) {
  const { data, error } = useSWR(
    props.userId ? `/api/user/${props.userId}` : null,
    () => fetchUser(props.userId),
    {
      initialData: props.user ? { user: props.user } : undefined,
      dedupingInterval: 86400000, // 24 hours
      revalidateOnFocus: false,
    }
  );

  const loading = !data;

  return {
    user: data?.user,
    loading,
    error,
  };
}
