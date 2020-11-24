import { NextApiRequest, NextApiResponse } from "next";
import Invitation from "server/models/invitation";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import { acceptInvitation } from "server/validations/invitations";
import { client } from "www/lib/ApiClient";
import {
  NotFoundError,
  TokenExpiredError,
  InvalidCredentialsError,
  SuspiciousRequestError,
  ValidationError,
  UnauthorizedError,
} from "../../../lib/errors";
import connectDb from "../../../server/db";
import User from "../../../server/models/user";
import { parseError } from "../../../server/utils/helpers";

async function validations(req: NextApiRequest, res: NextApiResponse) {
  switch (req.query.type) {
    case "invitations": {
      switch (req.method) {
        case "GET": {
          try {
            const { email, clipId, token } = req.query;

            const { error } = acceptInvitation.validate({
              email,
              clipId,
              token,
            });

            if (error) {
              throw new ValidationError(error.message);
            }

            const invitation = await Invitation.findOne({
              email,
              clipId,
              key: token,
            });

            if (invitation) {
              const creator = await User.findById(invitation.creatorId);

              res.send({
                creator: creator.username,
                clipId: invitation.clipId,
              });
            } else {
              throw new NotFoundError();
            }
          } catch (e) {
            const error = parseError(e);
            res.status(error.code).send(error);
          }
        }
      }
      break;
    }
    case "reset-password": {
      switch (req.method) {
        case "GET": {
          try {
            const { email, token } = req.query;

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
              // show reset password form
              res.send({ ok: true });
            } else {
              throw new InvalidCredentialsError();
            }
          } catch (e) {
            const error = parseError(e);
            res.status(error.code).send(error);
          }
          break;
        }
      }
      break;
    }
    case "recaptcha": {
      const { token } = req.body;

      try {
        const data = await client.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );

        if (data.success) {
          res.send({ ok: true });
        } else {
          throw new SuspiciousRequestError();
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
    }
  }
}

export default connectDb(withSession(validations));
