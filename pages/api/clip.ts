import areDatesSame from "lib/areDatesSame";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  NothingToUpdateError,
} from "lib/errors";
import { TUser } from "lib/types";
import ClipFactory from "models/clip";
import { NextApiRequest, NextApiResponse } from "next";
import Invitation from "server/models/invitation";
import User from "server/models/user";
import getCurrentUser from "server/utils/getCurrentUser";
import withAuthentication from "server/withAuthentication";
import withCors from "server/withCors";
import connectDb from "../../server/db";
import Article from "../../server/models/article";
import Clip from "../../server/models/clip";
import withSession from "../../server/session";
import { parseError } from "../../server/utils/helpers";
import * as validations from "../../server/validations/clip";

async function clip(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const currentUser = await getCurrentUser(req);
        const clip = await getClip(req.query.clipId as string, currentUser);
        res.send({ clip: ClipFactory(clip) });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "POST": {
      try {
        const { params } = req.body;

        const {
          error: typeValidationError,
        } = validations.validateType.validate(params.type);

        if (typeValidationError) {
          throw new ValidationError(typeValidationError.message);
        }

        let validator;
        let validateBody = {};

        if (params.type === "text") {
          validator = validations.validateSaveTextType;
          validateBody = {
            markdown: params.markdown,
          };
        }

        if (params.type === "link") {
          validator = validations.validateSaveLinkType;
          validateBody = {
            metadata: params.metadata,
            markdown: params.markdown,
          };
        }

        if (params.type === "image") {
          validator = validations.validateSaveImageType;
          validateBody = {
            images: params.images,
          };
        }

        const { error } = validator.validate(validateBody);

        if (error) {
          throw new ValidationError(error.message);
        }

        const user = await getCurrentUser(req);
        const date = new Date();

        // 1. Get latest article from user.
        const latestArticle = await Article.getLastArticle(user.id);
        let articleId;

        if (
          !latestArticle ||
          (latestArticle && !areDatesSame(latestArticle.createdAt, date))
        ) {
          // 1a. If no article or article.date !== date, create a new article.
          const newArticle = new Article({
            authorId: user.id,
          });

          const newlyCreatedArticle = await newArticle.save();
          articleId = newlyCreatedArticle.id;
        } else {
          // 1b. If an existing article for the day, append to it.
          articleId = latestArticle.id;
        }

        // 3. Create the new clip.
        let newClip;

        if (params.type === "text") {
          newClip = new Clip({
            articleId,
            authorId: user.id,
            type: params.type,
            markdown: params.markdown,
          });

          await newClip.save();
        } else if (params.type === "link") {
          newClip = new Clip({
            articleId,
            authorId: user.id,
            type: params.type,
            linkMetadata: params.linkMetadata,
            markdown: params.markdown,
          });

          await newClip.save();
        } else if (params.type === "image") {
          newClip = new Clip({
            articleId,
            authorId: user.id,
            type: params.type,
            images: params.images,
          });

          await newClip.save();
        } else {
          throw new ValidationError();
        }

        // 4. Update article to include newly added clip.
        const article = await Article.findById(articleId);
        if (article) {
          await article.addClipToArticle(user.id, articleId, newClip.id);
        } else {
          throw new NotFoundError("Article does not exist");
        }

        res.send({ ok: true, data: { clip: ClipFactory(newClip) } });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "PUT": {
      try {
        const { params } = req.body;

        const {
          error: typeValidationError,
        } = validations.validateType.validate(params.type);

        if (typeValidationError) {
          throw new ValidationError(typeValidationError.message);
        }

        let validator;
        let validateBody = {};

        if (params.type === "text") {
          validator = validations.validateSaveTextType;
          validateBody = {
            markdown: params.markdown,
          };
        } else if (params.type === "link") {
          validator = validations.validateSaveLinkType;
          validateBody = {
            metadata: params.linkMetadata,
            markdown: params.markdown,
          };
        } else if (params.type === "image") {
          validator = validations.validateSaveImageType;
          validateBody = {
            images: params.images,
          };
        } else if (params.type === "visibility") {
          validator = validations.validateUpdateVisibilityRequest;
          validateBody = {
            visibility: params.visibility,
          };
        } else {
          throw new ValidationError();
        }

        const { error } = validator.validate(validateBody);

        if (error) {
          throw new ValidationError(error.message);
        }

        const user = await getCurrentUser(req);

        // 3. Create the new clip.
        let newClip;

        const oldClip = await Clip.findById(params.id);

        if (!oldClip) {
          throw new NotFoundError("Clip not found.");
        }

        if (oldClip.authorId !== user.id) {
          throw new UnauthorizedError();
        }

        if (params.type === "text") {
          oldClip.title = params.title;
          oldClip.markdown = params.markdown;
        } else if (params.type === "link") {
          oldClip.linkMetadata = params.linkMetadata;
          oldClip.markdown = params.markdown;
        } else if (params.type === "image") {
          oldClip.images = params.images;
        } else if (params.type === "visibility") {
          oldClip.visibility = params.visibility;
        }

        newClip = await oldClip.save();

        res.send({ ok: true, data: { clip: ClipFactory(newClip) } });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "DELETE": {
      try {
        const { clipId } = req.body;

        const { error } = validations.validateDeleteClipRequest.validate({
          clipId,
        });

        if (error) {
          throw new ValidationError(error.message);
        }

        const clip = await Clip.findById(clipId);

        if (!clip || clip.isRemoved) {
          throw new NotFoundError("No clip found");
        }

        const user = await getCurrentUser(req);
        if (clip.authorId !== user.id) {
          throw new UnauthorizedError();
        }

        if (clip.isRemoved === true) {
          throw new NothingToUpdateError();
        }

        const removedClip = await clip.deleteClip();

        await Article.findByIdAndUpdate(
          clip.articleId,
          {
            $pull: { clips: clip.id },
            useFindAndModify: false,
          },
          { new: true, timestamps: false }
        );

        res.send({ ok: true, data: { clip: ClipFactory(removedClip) } });
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
    withCors(
      withAuthentication(clip, {
        skipRequestMethods: ["GET"],
      })
    )
  )
);

export async function getClip(clipId: string, currentUser: TUser) {
  const { error } = validations.validateGetClipRequest.validate({
    clipId,
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  const clip = await Clip.findById(clipId);

  if (clip && clip.isRemoved) {
    return null;
  }

  const invitations = currentUser
    ? await Invitation.find({
        _id: { $in: clip.invitations },
      })
    : [];

  const invitation = invitations.filter(
    (invitation) => invitation.email === currentUser.email
  )[0];

  if (invitation && invitation.status === "pending") {
    invitation.status = "accepted";
    await invitation.save();

    const self = await User.findById(currentUser.id);
    await self.addInvitation(invitation.id);
  }

  if (
    !clip ||
    (clip.visibility === "private" &&
      clip.authorId !== currentUser?.id &&
      !invitation)
  ) {
    throw new NotFoundError("No clip found");
  }

  return JSON.parse(JSON.stringify(ClipFactory(clip)));
}
