import { UnauthorizedError, ValidationError } from "lib/errors";
import { NextApiRequest, NextApiResponse } from "next";
import pusherClient from "server/pusher";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import { pusherPOSTEventBodyValidation } from "server/validations/pusher";
import connectDb from "../../server/db";
import { parseError } from "../../server/utils/helpers";
import withAuthentication from "../../server/withAuthentication";

async function event(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const {
          // socketId is the pusher socketId
          body: { channel, name, data, socketId },
        } = req as any;
        const user = await getCurrentUser(req);

        const { error } = pusherPOSTEventBodyValidation.validate({
          channel,
          name,
          data,
          socketId,
        });

        if (error) {
          throw new ValidationError(error.message);
        }

        if (user) {
          pusherClient.trigger(channel, name, data, socketId, (error) => {
            if (error) {
              // TODO: add logging here
              console.log({ error });
            }
          });

          res.send({
            ok: true,
          });
        } else {
          throw new UnauthorizedError("Unauthenticated");
        }
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

export default connectDb(withSession(withAuthentication(event)));
