import got from "got";
import { ValidationError, NotFoundError } from "lib/errors";
import { TLinkMetadata } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import withAuthentication from "server/withAuthentication";
import withCors from "server/withCors";
import connectDb from "../../server/db";
import withSession from "../../server/session";
import { parseError } from "../../server/utils/helpers";
import * as validations from "../../server/validations/unfurl";
const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-clearbit")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
]);

async function unfurl(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const { url } = req.query;

        const { error } = validations.url.validate(url);

        if (error) {
          throw new ValidationError(error.message);
        }

        try {
          const { body: html, url: uri } = await got(url as string);
          const metadata = await metascraper({ html, url: uri });

          res.send({ ok: true, metadata: formatMetadata(metadata) });
        } catch (e) {
          throw new NotFoundError();
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

function formatMetadata(
  metadata: TLinkMetadata
): {
  author: string;
  date: string;
  description: string;
  image: string;
  logo: string;
  publisher: string;
  title: string;
  url: string;
} {
  return {
    author: metadata.author || "",
    date: metadata.date || "",
    description: metadata.description || "",
    image: metadata.image || "",
    logo: metadata.logo || "",
    publisher: metadata.publisher || "",
    title: metadata.title || "",
    url: metadata.url || "",
  };
}

export default connectDb(withSession(withCors(withAuthentication(unfurl))));
