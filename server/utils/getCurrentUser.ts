import jwt from "jsonwebtoken";
import { TUser } from "lib/types";
import { NextApiRequest } from "next";

// Gets the current user, if one, from either session or jwt.
// TODO: probably just store the jwt in cookie.
export default function getCurrentUser(
  req: NextApiRequest
): Promise<TUser | undefined> {
  return new Promise((resolve) => {
    // @ts-ignore
    const { session } = req;
    const sessionToken = session.get("jwt");
    const token = sessionToken || req.headers.authorization;

    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (!err && user) {
          return resolve(user);
        }

        resolve(undefined);
      });
    } else {
      resolve(undefined);
    }
  });
}
