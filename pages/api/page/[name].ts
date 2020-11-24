/**
 * A Page is any root level route that we want to server render.
 */

import UserFactory from "models/user";
import { NextApiRequest, NextApiResponse } from "next";
import User from "server/models/user";
import withSession from "server/session";
import { parseError } from "server/utils/helpers";
import connectDb, { CASE_INSENSITIVE_COLLATION } from "../../../server/db";

export const PAGE_TYPES = {
  USER: "user",
};

async function page(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const data = await getPage(req.query.name as string);

        // If user exists, fetch for their clips.
        if (data) {
          res.send(UserFactory(data));
        } else {
          res.send(undefined);
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

export default connectDb(withSession(page));

export async function getPage(username: string) {
  const user = await User.findOne({ username }).collation(
    CASE_INSENSITIVE_COLLATION
  );

  if (user) {
    return UserFactory(user);
  }

  return undefined;
}
