import { sign } from "jsonwebtoken";
import { TUser } from "lib/types";

import { JWT_EXPIRES_AT } from "pages/api/session";

export default function getJWT(user: TUser) {
  const jwt = sign(user, process.env.JWT_KEY, {
    expiresIn: JWT_EXPIRES_AT,
  });

  return jwt;
}
