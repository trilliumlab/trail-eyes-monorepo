import { sendEmail } from '~/email-client';
import InviteEmail, { type InviteEmailProps } from '~/emails/invite';
import OtpEmail, { type OtpEmailProps } from '~/emails/otp-email';
import VerifyEmail, { type VerifyEmailProps } from '~/emails/verify-email';

export async function sendInvite(to: string, props: InviteEmailProps) {
  await sendEmail({
    email: <InviteEmail {...props} />,
    to,
    subject: "You're invited to TrailEyes",
  });
}

export async function sendVerification(to: string, props: VerifyEmailProps) {
  await sendEmail({
    email: <VerifyEmail {...props} />,
    to,
    subject: 'Verify your TrailEyes email',
  });
}

export async function sendOtp(to: string, props: OtpEmailProps) {
  await sendEmail({
    email: <OtpEmail {...props} />,
    to,
    subject: `Your TrailEyes verification code is ${props.code}`,
  });
}
