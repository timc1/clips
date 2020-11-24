import { RequestMethod } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { UnauthorizedError } from "../lib/errors";
import getCurrentUser from "./utils/getCurrentUser";
import { parseError } from "./utils/helpers";

type Options = {
  skipRequestMethods?: RequestMethod[];
};

const withAuthentication = (
  handler,
  options: Options = {
    skipRequestMethods: [],
  }
) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getCurrentUser(req);
    const skipAuthentication = options.skipRequestMethods.includes(
      req.method as RequestMethod
    );

    if (skipAuthentication || user) {
      return handler(req, res);
    } else {
      throw new UnauthorizedError();
    }
  } catch (error) {
    res.status(error.code).send(parseError(error));
  }
};

export default withAuthentication;
