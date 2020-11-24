import { TClip, TUser } from "lib/types";
import { useRouter } from "next/router";
import { getClip } from "pages/api/clip";
import * as React from "react";
import User from "server/models/user";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import ClipPage from "www/components/Clip/ClipPage";
import PageLayout from "www/components/Layout/PageLayout";

type Props = {
  id: string;
  initialData?: TClip;
  currentUser?: TUser;
  author?: TUser;
};

function SingleClipPage(props: Props) {
  const { query } = useRouter();

  const clipId = props.initialData?.id;

  const initialData = React.useMemo(() => {
    if (clipId && clipId === query.clipId) {
      return props.initialData;
    }

    return undefined;
  }, [clipId, props.initialData, query.clipId]);

  return (
    <ClipPage
      id={props.id || (query.clipId as string)}
      clip={initialData}
      currentUser={props.currentUser}
      author={props.author}
    />
  );
}

SingleClipPage.Layout = PageLayout;

export const getServerSideProps = withSession(async function ({
  req,
  res,
  query,
}) {
  const currentUser = (await getCurrentUser(req)) || null;

  try {
    const clip = await getClip(query.clipId, currentUser);
    const author = await User.findById(clip.authorId);

    return {
      props: {
        currentUser,
        initialData: clip,
        author: JSON.parse(JSON.stringify(author)),
      },
    };
  } catch {
    res.setHeader("location", "/404");
    res.statusCode = 302;
    return {
      props: {},
    };
  }
});

export default SingleClipPage;
