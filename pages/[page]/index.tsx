import { TUser } from "lib/types";
import { getPage } from "pages/api/page/[name]";
import * as React from "react";
import connectDb from "server/db";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import PageComponent from "www/components/Page";
import { useSession } from "www/hooks/useSession";

type Props = {
  sessionUser?: TUser;
  initialData?: TUser;
};

function Page(props: Props) {
  const session = useSession(
    props.sessionUser
      ? {
          initialData: { data: props.sessionUser },
        }
      : undefined
  );

  return <PageComponent user={props.initialData} sessionUser={session.user} />;
}

export const getServerSideProps = connectDb(
  withSession(async function ({ req, res, query }) {
    const sessionUser = (await getCurrentUser(req)) || null;
    const user = await getPage(query.page);

    if (!user && !res.finished) {
      res.setHeader("location", "/404");
      res.statusCode = 302;
      return {
        props: {},
      };
    }

    return {
      props: {
        sessionUser,
        initialData: JSON.parse(JSON.stringify(user)),
      },
    };
  })
);

export default Page;
