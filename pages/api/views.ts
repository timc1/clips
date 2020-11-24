import { NotFoundError, ValidationError } from "lib/errors";
import { NextApiRequest, NextApiResponse } from "next";
import View from "server/models/view";
import getCurrentUser from "server/utils/getCurrentUser";
import { getViews } from "server/validations/view";
import withCors from "server/withCors";
import connectDb from "../../server/db";
import withSession from "../../server/session";
import { parseError } from "../../server/utils/helpers";
import { getClip } from "./clip";

export const JWT_EXPIRES_AT = "15 days";

async function views(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { clipId } = req.query;

        const { error } = getViews.validate({ clipId });

        if (error) {
          throw new ValidationError(error.message);
        }

        const currentUser = await getCurrentUser(req);
        // make sure clip is available
        const clip = await getClip(req.query.clipId as string, currentUser);

        if (!clip) {
          throw new NotFoundError();
        }

        const view = await View.findOne({ clipId: clip.id });

        if (!view) {
          const newView = new View({
            clipId: clip.id,
          });
          await newView.save();
          res.send({ count: 1 });
        } else {
          const updatedView = await view.increment();
          res.send({ count: updatedView.count });
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    default:
      res.status(405).send({ message: "Nothing here 🤷‍♀️" });
  }
}

export default connectDb(withSession(withCors(views)));
