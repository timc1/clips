import S3 from "aws-sdk/clients/s3";
import { AVATAR_BUCKET } from "lib/constants";
import { ValidationError } from "lib/errors";
import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "server/db";
import withSession from "server/session";
import { parseError } from "server/utils/helpers";
import { validateImageContent } from "server/validations/images";
import withAuthentication from "server/withAuthentication";
import withCors from "server/withCors";
import { TBucketOptions } from "www/hooks/useImageUploader";

async function images(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { key } = req.query;

        const s3 = new S3({
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          region: "us-west-1",
        });

        const params = { Bucket: "shimmerapp", Key: key, Expires: 3600 };

        const url = s3.getSignedUrl("getObject", params);

        res.send({ ok: true, url });
      } catch (e) {
        const error = parseError(e);
        res.status(error.code).send(error);
      }
      break;
    }
    case "POST": {
      try {
        const { contents, bucketOptions } = req.body;

        const { error } = validateImageContent.validate(contents);

        if (error) {
          throw new ValidationError(error.message);
        }

        const params: {
          key: string;
          contentType: string;
          bucketOptions?: TBucketOptions;
        }[] = contents.map((content) => ({
          key: content.md5,
          contentType: content.contentType,
          bucketOptions,
        }));

        const presignedPostData = await Promise.all(
          params.map((param) => createPresignedPost(param))
        );

        res.send({ ok: true, presignedPostData });
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
    withCors(withAuthentication(images, { skipRequestMethods: ["GET"] }))
  )
);

function createPresignedPost({
  key, // md5
  contentType,
  bucketOptions,
}: {
  key: string;
  contentType: string;
  bucketOptions?: TBucketOptions;
}): Promise<{
  url: string;
  fields: Object;
}> {
  const s3 = new S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "us-west-1",
  });

  const params = {
    Expires: 60,
    Bucket: AVATAR_BUCKET,
    Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
    Fields: {
      "Content-Type": contentType,
      key,
    },
    ...bucketOptions,
  };

  return new Promise(async (resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}
