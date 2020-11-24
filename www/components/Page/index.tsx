import { TUser } from "lib/types";
import Router, { useRouter } from "next/router";
import * as React from "react";
import User from "www/components/User";
import { usePageRequest } from "www/requests/hooks/usePageRequest";

type Props = {
  user?: TUser;
  sessionUser?: TUser;
};

export default function Page(props: Props) {
  const router = useRouter();

  const username = props.user && props.user.username;
  const initialData = React.useMemo(() => {
    if (username && username === router.query.page) {
      return props.user;
    }

    return undefined;
  }, [props.user, router.query.page, username]);

  const response = usePageRequest({
    page: router.query.page,
    initialData,
  });

  const found = !!response.user;

  React.useEffect(() => {
    if (response.loading) {
      return;
    }

    if (!found) {
      Router.replace("/404", "/404");
      return;
    }
  }, [found, response.loading]);

  if (response.loading) {
    return null;
  }

  return <User user={response.user} sessionUser={props.sessionUser} />;
}
