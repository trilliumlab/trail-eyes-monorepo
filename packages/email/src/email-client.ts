import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { env } from './env';

const transporter = nodemailer.createTransport({
  port: env.SMTP_PORT,
  host: env.SMTP_HOST,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail({
  email,
  to,
  subject,
}: { email: React.ReactElement; to: string; subject: string }) {
  await transporter.sendMail({
    from: {
      name: env.SMTP_SENDER_NAME,
      address: env.SMTP_SENDER,
    },
    to,
    subject,
    html: await render(email),
  });
}
