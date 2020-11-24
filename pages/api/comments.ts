import { ValidationError, NotFoundError } from "lib/errors";
import CommentFactory from "models/comment";
import { NextApiRequest, NextApiResponse } from "next";
import withSession from "server/session";
import { validateGetClipCommentsRequest } from "server/validations/clip";
import connectDb from "../../server/db";
import Clip from "../../server/models/clip";
import { parseError } from "../../server/utils/helpers";
import withAuthentication from "../../server/withAuthentication";

async function comments(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { clipId } = req.query;
        const { error } = validateGetClipCommentsRequest.validate({ clipId });

        if (error) {
          throw new ValidationError(error.message);
        }

        const clip = await Clip.findById(clipId);

        if (!clip) {
          throw new NotFoundError();
        }

        const comments = await clip.getComments();

        res.send({
          comments: comments.map((comment) => CommentFactory(comment)),
        });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    default:
      res.status(405).send({ message: "Nothing here 🤷‍♀️" });
  }
}

export default connectDb(
  withSession(
    withAuthentication(comments, {
      skipRequestMethods: ["GET"],
    })
  )
);
