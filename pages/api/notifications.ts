import { UnauthorizedError, ValidationError } from "lib/errors";
import NotificationFactory from "models/notification";
import { NextApiRequest, NextApiResponse } from "next";
import Notification from "server/models/notification";
import User from "server/models/user";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import {
  getNotifications,
  markNotificationAsRead,
} from "server/validations/notification";
import connectDb from "../../server/db";
import { parseError } from "../../server/utils/helpers";
import withAuthentication from "../../server/withAuthentication";

async function notifications(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const currentUser = await getCurrentUser(req);

        const { page = 1, limit = 10 } = req.query;

        const { error } = getNotifications.validate({ page, limit });

        if (error) {
          throw new ValidationError(error.message);
        }

        const user = await User.findById(currentUser.id);
        const data = await user.getNotifications({
          page,
          limit,
        });

        res.send({
          notifications: data.docs.map((doc) => NotificationFactory(doc)),
          meta: {
            total: data.totalDocs,
            totalPages: data.totalPages,
            page: data.page,
            limit: data.limit,
          },
        });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "PUT": {
      try {
        const { markAsRead } = req.body;

        const { error } = markNotificationAsRead.validate({ markAsRead });

        if (error) {
          throw new ValidationError(error.message);
        }

        const user = await getCurrentUser(req);
        const notification = await Notification.findById(markAsRead);
        const response = await notification.markAsRead(user.id);

        if (response.permissionDenied) {
          throw new UnauthorizedError();
        }

        res.send({ notification: response });
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

export default connectDb(withSession(withAuthentication(notifications)));
