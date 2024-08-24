import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { privateEnv } from '@repo/util/private-env';

const transporter = nodemailer.createTransport({
  port: privateEnv.SMTP_PORT,
  host: privateEnv.SMTP_HOST,
  auth: {
    user: privateEnv.SMTP_USER,
    pass: privateEnv.SMTP_PASS,
  },
});

export async function sendEmail({
  email,
  to,
  subject,
}: { email: React.ReactElement; to: string; subject: string }) {
  await transporter.sendMail({
    from: {
      name: privateEnv.SMTP_SENDER_NAME,
      address: privateEnv.SMTP_SENDER,
    },
    to,
    subject,
    html: await render(email),
  });
}
