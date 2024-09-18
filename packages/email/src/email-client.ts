import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { privateEnv } from '@repo/env';

const transporter = nodemailer.createTransport({
  port: privateEnv().smtpPort,
  host: privateEnv().smtpHost,
  auth: {
    user: privateEnv().smtpUser,
    pass: privateEnv().smtpPass,
  },
});

/**
 * Sends a react-email to the specified recipient.
 *
 * @param email - The react-email component to send.
 * @param to - The email address of the recipient.
 * @param subject - The subject of the email.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendEmail({
  email,
  to,
  subject,
}: { email: React.ReactElement; to: string; subject: string }) {
  await transporter.sendMail({
    from: {
      name: privateEnv().smtpSenderName,
      address: privateEnv().smtpSender,
    },
    to,
    subject,
    html: await render(email),
  });
}
