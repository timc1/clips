import { ValidationError, NotFoundError } from "lib/errors";
import ArticleFactory from "models/article";
import { NextApiRequest, NextApiResponse } from "next";
import getCurrentUser from "server/utils/getCurrentUser";
import withAuthentication from "server/withAuthentication";
import withCors from "server/withCors";
import connectDb from "../../server/db";
import Article from "../../server/models/article";
import User from "../../server/models/user";
import withSession from "../../server/session";
import { parseError } from "../../server/utils/helpers";
import * as articleValidations from "../../server/validations/article";

async function articles(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { page, limit, username } = req.query;

        const { error } = articleValidations.validateGetRequestParams.validate({
          page,
          limit,
          username,
        });

        if (error) {
          throw new ValidationError(error.message);
        }

        let articles;
        let meta;

        const user = await User.findOne({ username });

        if (user) {
          const currentUser = await getCurrentUser(req);

          const visibility =
            currentUser && currentUser.id === user.id ? undefined : "public";

          const data = await Article.getArticlesForUser(
            user.id,
            page,
            limit,
            visibility
          );
          articles = data.docs.map((doc) => ArticleFactory(doc));
          meta = {
            total: data.totalDocs,
            limit: data.limit,
            page: data.page,
            totalPages: data.totalPages,
          };
        } else {
          throw new NotFoundError("User does not exist");
        }

        res.send({
          articles,
          meta,
        });
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
    withCors(
      withAuthentication(articles, {
        skipRequestMethods: ["GET"],
      })
    )
  )
);
