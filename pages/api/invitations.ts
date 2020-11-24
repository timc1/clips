import { NOTIFICATIONS } from "lib/constants";
import { ValidationError, NotFoundError, UnauthorizedError } from "lib/errors";
import getApiUrl from "lib/getApiUrl";
import InvitationFactory from "models/invitation";
import { NextApiRequest, NextApiResponse } from "next";
import { sendClipInvitationEmail } from "server/emails";
import Invitation from "server/models/invitation";
import Notification from "server/models/notification";
import User from "server/models/user";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import uuid from "uuid/v4";
import connectDb from "../../server/db";
import Clip from "../../server/models/clip";
import { parseError } from "../../server/utils/helpers";
import {
  create,
  getInvitation,
  removeInvitation,
} from "../../server/validations/invitations";
import withAuthentication from "../../server/withAuthentication";

async function invitations(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { clipId } = req.query;
        const { error } = getInvitation.validate(clipId);

        if (error) {
          throw new ValidationError(error.message);
        }

        const clipResponse = await Clip.find({ _id: clipId });

        const clip = clipResponse[0];

        if (!clip) {
          throw new NotFoundError("Clip does not exist");
        }

        const invitations = clip.invitations;

        if (!invitations) {
          res.send({
            invitations: [],
          });
        } else {
          const response = await Invitation.find({
            _id: { $in: invitations },
          }).sort({
            createdAt: -1,
          });

          res.send({
            invitations: response.map((invitation) =>
              InvitationFactory(invitation)
            ),
          });
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "POST": {
      try {
        const user = await getCurrentUser(req);

        const { type, clipId, email } = req.body;

        if (email.toLowerCase() === user.email.toLowerCase()) {
          throw new Error("You can not send an invitation to yourself");
        }

        const params = { type, clipId, email };

        const { error } = create.validate(params);

        if (error) {
          throw new ValidationError(error.message);
        }

        const clip = await Clip.findById(clipId);

        if (clip) {
          if (clip.authorId !== user.id) {
            throw new UnauthorizedError();
          }

          const invitation = new Invitation({
            key: uuid(),
            email,
            clipId,
            creatorId: user.id,
          });

          await invitation.save();

          await clip.addInvitation(invitation.id);

          // If user that the invitation sent to exists, immediately add invitation to that user.
          const invitedUser = await User.findOne({ email });
          if (invitedUser) {
            await invitedUser.addInvitation(invitation.id);

            // Create notification since user exists.
            const notification = new Notification({
              type: NOTIFICATIONS.clipInvite,
              sender: user.id,
              receiver: invitedUser.id,
              payload: {
                clipId: clip.id,
                authorId: clip.authorId,
              },
            });

            await notification.save();
          }

          // Send email here
          const url = getApiUrl(req);
          // TODO: run this in a perform later job
          await sendClipInvitationEmail(
            url,
            email,
            user.firstName,
            clip.id,
            invitation.key
          );

          res.send({
            invitation: InvitationFactory(invitation),
          });
        } else {
          throw new NotFoundError("Clip not found");
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "DELETE": {
      try {
        const { invitationId } = req.body;

        const { error } = removeInvitation.validate(invitationId);

        if (error) {
          throw new ValidationError(error.message);
        }

        const invitation = await Invitation.findById(invitationId);

        if (!invitation) {
          throw new NotFoundError();
        }

        const clip = await Clip.findById(invitation.clipId);

        const user = await getCurrentUser(req);

        await clip.removeInvitation(invitation.id, user.id);

        const invitedUser = await User.findOne({ email: invitation.email });

        if (invitedUser) {
          await invitedUser.removeInvitation(invitation.id);
        }

        await Invitation.deleteOne({ _id: invitation.id }, { justOne: true });

        res.send({ ok: true });
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

export default connectDb(withSession(withAuthentication(invitations)));
