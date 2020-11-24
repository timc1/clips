import {
  ValidationError,
  NotFoundError,
  TokenExpiredError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "lib/errors";
import getApiUrl from "lib/getApiUrl";
import UserFactory from "models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { sendResetPasswordEmail } from "server/emails";
import getCurrentUser from "server/utils/getCurrentUser";
import getJWT from "server/utils/getJWT";
import connectDb, { CASE_INSENSITIVE_COLLATION } from "../../server/db";
import User from "../../server/models/user";
import withSession from "../../server/session";
import { sessionizeUser, parseError } from "../../server/utils/helpers";
import {
  signUp,
  resetPasswordRequest,
  resetPasswordSubmission,
  getUserRequest,
  validateUpdateUser,
  validateUpdateProfilePhoto,
} from "../../server/validations/user";

async function user(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { userId } = req.query;

        const { error } = getUserRequest.validate({ userId });

        if (error) {
          throw new ValidationError(error.message);
        }

        const user = await User.findById(userId);

        res.send({ user: UserFactory(user) });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "POST": {
      try {
        const isResetPasswordRequest = req.query.method === "reset-password";
        if (isResetPasswordRequest) {
          const { email } = req.body;

          const { error } = resetPasswordRequest.validate({ email });

          if (error) {
            throw new ValidationError(error.message);
          }

          const user = await User.findOne({ email }).collation(
            CASE_INSENSITIVE_COLLATION
          );
          const url = getApiUrl(req);

          if (user) {
            await sendResetPasswordEmail(user, url, email);

            res.send({ ok: true });
          } else {
            await sendResetPasswordEmail(null, url, email); // send email anyway but prompt user registration

            res.send({ ok: true });
          }
        } else {
          const {
            username,
            email,
            firstName,
            lastName,
            password,
            passwordConfirmation,
          } = req.body;

          const { error } = signUp.validate({
            username,
            email,
            firstName,
            lastName,
            password,
            passwordConfirmation,
          });

          if (error) {
            throw new ValidationError(error.message);
          }

          const hasOnboarded = false;
          const emailVerified = false;

          const newUser = new User({
            username,
            email,
            firstName,
            lastName,
            password,
            hasOnboarded,
            emailVerified,
          });

          const sessionUser = sessionizeUser(newUser);
          await newUser.save();

          // @ts-ignore
          const { session } = req;
          const jwt = getJWT(sessionUser);
          session.set("jwt", jwt);
          await session.save();

          res.send({ ok: true, user: sessionUser });
        }
      } catch (e) {
        const error = parseError(e);
        console.log("error", error);

        res.status(error.code).send(error);
      }
      break;
    }
    case "PUT": {
      try {
        const isResetPassword = req.query.method === "reset-password";
        const isUpdateProfilePhoto =
          req.query.method === "update-profile-photo";

        if (isUpdateProfilePhoto) {
          const { key } = req.body;

          const { error } = validateUpdateProfilePhoto.validate({ key });

          if (error) {
            throw new ValidationError(error.message);
          }

          const sessionUser = await getCurrentUser(req);

          if (!sessionUser) {
            throw new UnauthorizedError();
          }

          const user = await User.findByIdAndUpdate(
            sessionUser.id,
            {
              $set: { profileImage: key },
              useFindAndModify: false,
            },
            { new: true }
          );

          // @ts-ignore
          const { session } = req;
          // update current session user to reflect updated profileImage
          const jwt = getJWT(sessionizeUser(user));
          session.set("jwt", jwt);
          await session.save();

          res.send({ user });
        } else if (isResetPassword) {
          const { email, password, passwordConfirmation, token } = req.body;

          const { error } = resetPasswordSubmission.validate({
            password,
            passwordConfirmation,
          });

          if (error) {
            throw new ValidationError(error.message);
          }

          const user = await User.findOne({ email });

          if (!user) {
            throw new NotFoundError("No user with this email was found");
          }

          const tokenIsValid = user.compareResetPasswordToken(token);
          if (tokenIsValid.tokenExpired === true) {
            throw new TokenExpiredError(
              "Password reset request has expired. Re-submit your email address to receive a new recovery link."
            );
          } else if (tokenIsValid === true) {
            await user.updateUserPassword(password);

            const sessionUser = sessionizeUser(user);
            // @ts-ignore
            const { session } = req;
            const jwt = getJWT(sessionUser);
            session.set("jwt", jwt);
            await session.save();
            res.send({ ok: true, user: sessionUser });
          } else {
            throw new InvalidCredentialsError();
          }
        } else {
          // update user
          const { firstName, lastName } = req.body;

          const { error } = validateUpdateUser.validate({
            firstName,
            lastName,
          });

          if (error) {
            throw new ValidationError(error.message);
          }

          const sessionUser = await getCurrentUser(req);
          const currentUser = await User.findById(sessionUser.id);
          const user = await currentUser.updateUser({
            firstName,
            lastName,
          });

          // update jwt + session user
          // @ts-ignore
          const { session } = req;
          const jwt = getJWT(sessionizeUser(user));
          session.set("jwt", jwt);
          await session.save();

          // send updated user
          res.send({
            user,
          });
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

export default connectDb(withSession(user));
