import {
  TokenExpiredError,
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
  SuspiciousRequestError,
} from "lib/errors";
import getApiUrl from "lib/getApiUrl";
import { NextApiRequest, NextApiResponse } from "next";
import { sendSignInMail } from "server/emails";
import getCurrentUser from "server/utils/getCurrentUser";
import getJWT from "server/utils/getJWT";
import withCors from "server/withCors";
import connectDb, { CASE_INSENSITIVE_COLLATION } from "../../server/db";
import User from "../../server/models/user";
import withSession from "../../server/session";
import { sessionizeUser, parseError } from "../../server/utils/helpers";
import {
  signIn,
  signInWithEmail,
  signInWithEmailQueryParams,
} from "../../server/validations/user";

export const JWT_EXPIRES_AT = "15 days";

async function session(req: NextApiRequest, res: NextApiResponse) {
  const { session } = req as any;

  switch (req.method) {
    case "GET":
      try {
        const { token, email } = req.query;
        const isEmailLinkAuthentication = token && email;
        if (isEmailLinkAuthentication) {
          const { error } = signInWithEmailQueryParams.validate({
            email,
            token,
          });

          if (error) {
            throw new ValidationError(error.message);
          }

          const user = await User.findOne({ email }).collation(
            CASE_INSENSITIVE_COLLATION
          );

          if (user) {
            const tokenIsValid = user.compareSignInToken(token);

            if (tokenIsValid.tokenExpired === true) {
              const url = getApiUrl(req);
              await sendSignInMail(user, url);

              throw new TokenExpiredError(
                "Token Expired. A new email was sent."
              );
            } else if (tokenIsValid === true) {
              const sessionUser = sessionizeUser(user);
              const jwt = getJWT(sessionUser);
              session.set("jwt", jwt);
              await session.save();

              res.send({ ok: true, user: sessionUser });
            } else {
              throw new InvalidCredentialsError();
            }
          } else {
            throw new InvalidCredentialsError();
          }
        } else {
          const user = await getCurrentUser(req);
          if (user) {
            res.send({ ok: true, user });
          } else {
            res.status(401).send(parseError({ code: 401 }));
          }
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    case "POST": {
      try {
        const isEmailLinkAuthentication = req.query.method === "email";
        if (isEmailLinkAuthentication) {
          const { email } = req.body;

          const { error } = signInWithEmail.validate({ email });

          if (error) {
            throw new ValidationError(error.message);
          }

          const user = await User.findOne({ email }).collation(
            CASE_INSENSITIVE_COLLATION
          );

          if (user) {
            const url = getApiUrl(req);

            await sendSignInMail(user, url);

            res.send({ ok: true });
          } else {
            throw new NotFoundError("No user with this email was found");
          }
        } else {
          const { email, password } = req.body;

          const { error } = signIn.validate({ email, password });

          if (error) {
            throw new ValidationError(error.message);
          }

          const user = await User.findOne({ email }).collation(
            CASE_INSENSITIVE_COLLATION
          );

          if (user) {
            // account already locked, increment attempt
            if (user.isLocked) {
              throw new SuspiciousRequestError(
                "Your account has been locked due to consecutive invalid login attempts."
              );
            }

            if (user.comparePasswords(password)) {
              const sessionUser = sessionizeUser(user);
              const jwt = getJWT(sessionUser);

              session.set("jwt", jwt);

              await session.save();

              // reset login attempts if necessary
              if (user.loginAttempts > 0 || user.lockUntil) {
                await user.resetLoginAttempts();
              }

              res.send({ ok: true, user: sessionUser, authToken: jwt });
            } else {
              await user.incrementLoginAttempts();

              throw new InvalidCredentialsError("Invalid login credentials");
            }
          } else {
            throw new InvalidCredentialsError("Invalid login credentials");
          }
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "DELETE": {
      const { session } = req as any;

      try {
        const user = await getCurrentUser(req);

        if (user) {
          session.destroy();
          res.send({ ok: true, user });
        } else {
          res.status(422).send(parseError({ error: "Something went wrong" }));
        }
      } catch (error) {
        res.status(422).send(parseError(error));
      }
      break;
    }
    default:
      res.status(405).send({ message: "Nothing here 🤷‍♀️" });
  }
}

export default connectDb(withSession(withCors(session)));
