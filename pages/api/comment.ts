import { NOTIFICATIONS } from "lib/constants";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  NothingToUpdateError,
} from "lib/errors";
import { NextApiRequest, NextApiResponse } from "next";
import CommentSubscription from "server/models/commentSubscription";
import Notification from "server/models/notification";
import withSession from "server/session";
import getCurrentUser from "server/utils/getCurrentUser";
import connectDb from "../../server/db";
import Clip from "../../server/models/clip";
import Comment from "../../server/models/comment";
import { parseError } from "../../server/utils/helpers";
import { create } from "../../server/validations/comment";
import withAuthentication from "../../server/withAuthentication";

async function comment(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const user = await getCurrentUser(req);

        if (!user) {
          throw new UnauthorizedError();
        }

        const authorId = user.id;

        const { clipId, text } = req.body;

        const params = { clipId, text, authorId };

        const { error } = create.validate(params);

        if (error) {
          throw new ValidationError(error.message);
        }

        const clip = await Clip.findById(clipId);

        if (clip) {
          const newComment = new Comment(params);

          await newComment.save();

          const updatedClip = await Clip.findByIdAndUpdate(
            clipId,
            {
              $push: { comments: newComment.id },
              useFindAndModify: false,
            },
            { new: true, timestamps: false }
          );

          // manage subscribers
          const subscribers = await CommentSubscription.find({
            clipId: clip.id,
          });

          const indexOfSubscriber = subscribers.findIndex(
            (subscriber) => subscriber.userId.toString() === user.id
          );

          const subscriber = subscribers[indexOfSubscriber];

          const subscribersToNotify = subscriber
            ? // remove the current user (subscriber) from getting notified of their own comment
              [
                ...subscribers.slice(0, indexOfSubscriber),
                ...subscribers.slice(indexOfSubscriber + 1),
              ]
            : subscribers;

          const isOwner = clip.authorId === user.id;

          // dont want to add the owner of the clip as a subscriber
          if (!subscriber && !isOwner) {
            const newSubscriber = new CommentSubscription({
              clipId: clip.id,
              userId: user.id,
            });

            await newSubscriber.save();
          }

          const payload = {
            clipId: clip.id,
            authorId: clip.authorId,
            commentId: newComment.id,
          };

          // Create notifications for subscribers
          if (!!subscribersToNotify) {
            const docs = subscribersToNotify.map((subscriber) => {
              return {
                type: NOTIFICATIONS.commentCreatedSubscription,
                sender: user.id,
                receiver: subscriber.userId,
                payload,
              };
            });

            // this option prevents additional documents from being inserted if one fails
            const options = { ordered: true };
            await Notification.insertMany(docs, options);
          }

          // if current user is not owner of clip, notify owner
          if (!isOwner) {
            const notification = new Notification({
              type: NOTIFICATIONS.commentCreated,
              sender: user.id,
              receiver: clip.authorId,
              payload,
            });

            await notification.save();
          }

          res.send({
            ok: true,
            comment: newComment,
            clip: updatedClip,
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
        const { commentId } = req.body;

        const comment = await Comment.findById(commentId);

        if (comment) {
          if (comment.isRemoved === true) {
            throw new NotFoundError("Comment does not exist.");
          }

          const user = await getCurrentUser(req);
          const userId = user.id;
          const deletedComment = await comment.deleteCommentByAuthor(userId);

          if (deletedComment.permissionDenied === true) {
            throw new UnauthorizedError(
              "User does not have permission to delete."
            );
          }

          // Once a comment is deleted, update clip.comments record to reflect the change
          const clip = await Clip.findById(comment.clipId);

          await clip.removeCommentFromClip(comment.id, user.id);

          res.send({
            comment: deletedComment,
          });
        } else {
          throw new NotFoundError("Comment not found");
        }
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "PUT": {
      try {
        const { commentId, text } = req.body;

        const comment = await Comment.findById(commentId);

        if (comment) {
          if (comment.isRemoved === true) {
            throw new NotFoundError("This comment does not exist.");
          }
          if (comment.text === text) {
            throw new NothingToUpdateError("Nothing to update.");
          }
          const user = await getCurrentUser(req);
          const userId = user.id;
          const editedComment = await comment.editCommentByAuthor(userId, text);

          if (editedComment.permissionDenied === true) {
            throw new UnauthorizedError(
              "User does not have permission to edit."
            );
          }

          res.send({
            comment: editedComment,
          });
        } else {
          throw new NotFoundError("Comment not found");
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

export default connectDb(
  withSession(
    withAuthentication(comment, {
      skipRequestMethods: ["POST"],
    })
  )
);
