import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    // Handle password rotation/update the password - see https://github.com/vvo/next-iron-session#examples
    password: [
      {
        id: 1,
        password: process.env.SESSION_COOKIE_PASSWORD_V1,
      },
    ],
    cookieName: "shimmer.session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      // Commented below is for reference – the default 15 days, in seconds.
      // maxAge: 1296000,
    },
  });
}
