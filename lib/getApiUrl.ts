import { NextApiRequest } from "next";

export default function getApiUrl(req?: NextApiRequest) {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const apiUrl = process.browser
    ? `${protocol}://${window.location.host}`
    : req
    ? `${protocol}://${req.headers.host}`
    : "https://shimmer.app";

  return apiUrl;
}
