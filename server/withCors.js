import Cors from 'cors'
import initMiddleware from "./initMiddleware";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

const withCors = (
  handler,
) => async (req, res) => {
  try {
    await cors(req, res);
    return handler(req, res)
  } catch (error) {
    res.status(error.code).send({
      message: "Something went wrong with CORS"
    });
  }
};

export default withCors;