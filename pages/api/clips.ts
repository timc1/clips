import { ValidationError, NotFoundError } from "lib/errors";
import ClipFactory from "models/clip";
import { NextApiRequest, NextApiResponse } from "next";
import Article from "server/models/article";
import getCurrentUser from "server/utils/getCurrentUser";
import withAuthentication from "server/withAuthentication";
import withCors from "server/withCors";
import connectDb from "../../server/db";
import withSession from "../../server/session";
import { parseError } from "../../server/utils/helpers";
import * as validations from "../../server/validations/clip";

async function clips(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { articleId } = req.query;

        const {
          error,
        } = validations.validateGetAllArticleClipsRequest.validate({
          articleId,
        });

        if (error) {
          throw new ValidationError(error.message);
        }

        const currentUser = await getCurrentUser(req);

        const article = await Article.findById(articleId);

        if (!article) {
          throw new NotFoundError("Article not found");
        }

        const visibility =
          (currentUser && currentUser.id) === article.authorId
            ? undefined
            : "public";

        const clips = await Article.getClipsForArticle(articleId, visibility);

        if (!clips) {
          throw new NotFoundError("No clip found");
        }

        res.send({ clips: clips.map((clip) => ClipFactory(clip)) });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    default:
      res.status(405).send({ message: "Nothing here 🤷‍♀️" });
  }
}

export default connectDb(
  withSession(
    withCors(withAuthentication(clips, { skipRequestMethods: ["GET"] }))
  )
);
