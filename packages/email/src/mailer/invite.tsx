import { sendEmail } from '~/email-client';
import InviteEmail, { type InviteEmailProps } from '~/emails/invite';
import VerifyEmail, { type VerifyEmailProps } from '~/emails/verify-email';

export async function sendInvite(to: string, props: InviteEmailProps) {
  await sendEmail({
    email: <InviteEmail {...props} />,
    to,
    subject: "You're invited to TrailEyes",
  });
}

export async function sendEmailVerification(to: string, props: VerifyEmailProps) {
  await sendEmail({
    email: <VerifyEmail {...props} />,
    to,
    subject: 'Verify your TrailEyes email',
  });
}
