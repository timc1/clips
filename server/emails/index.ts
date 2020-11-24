import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDER_EMAIL = "app.shimmer@gmail.com";

type SendgridParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function send(params: SendgridParams) {
  try {
    await sgMail.send({ ...params, from: SENDER_EMAIL });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export async function sendSignInMail(user, url) {
  const token = await user.generateSignInToken(user.email);
  const link = `${url}/validations/email-signin?email=${user.email}&token=${token}`;

  await send({
    to: user.email,
    subject: "Your sign in link",
    text: `Please sign in using this link: ${link}`,
    html: `<p>Please sign in using this link: <a href="${link}">Click here to sign in</a></p>`,
  });
}

export async function sendResetPasswordEmail(user, url, address) {
  if (user) {
    const token = await user.generateResetPasswordToken();
    const link = `${url}/validations/reset-password?email=${user.email}&token=${token}`;

    await send({
      to: user.email,
      subject: "Password Reset Request",
      text: `Reset your password using this link: ${link}`,
      html: `<p>Hello ${user.firstName}, forgot your password? Don't worry, reset your password using this link: <a href="${link}">Click here to reset password</a></p>`,
    });
  } else {
    const link = `${url}/register?email=${address}`;
    await send({
      to: address,
      subject: "Password Reset Request",
      text: `Hello, it seems like there is no account associated with this email. Use this link to join Shimmer : ${link}`,
      html: `<p>Hello, we received your password reset request. However, it seems like there is no account associated with this email. Use this link to join Shimmer: <a href="${link}">Register</a></p>`,
    });
  }
}

export async function sendClipInvitationEmail(
  url,
  email,
  senderName,
  clipId,
  token
) {
  const link = `${url}/validations/invitations?email=${email}&clipId=${clipId}&token=${token}`;
  await send({
    to: email,
    subject: `${senderName} invited you to view a Clip 👋`,
    text: `Hey there, ${senderName} sent you a clip. Use this link to view: ${link}`,
    html: `<p>Hey there, use this link to view the clip ${senderName} sent you: <a href="${link}">View Clip</a></p>`,
  });
}
