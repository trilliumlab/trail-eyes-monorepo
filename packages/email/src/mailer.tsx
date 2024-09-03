import { sendEmail } from './email-client';
import InviteEmail, { type InviteEmailProps } from './emails/invite';
import OtpEmail, { type OtpEmailProps } from './emails/otp-email';
import VerifyEmail, { type VerifyEmailProps } from './emails/verify-email';

/**
 * Sends an invitation email to the specified recipient.
 *
 * @param props.firstName - The first name of the user being invited.
 * @param props.lastName - The last name of the user being invited.
 * @param props.inviteRole - The role for which the user is being invited.
 * @param props.invitedByFirstName - The first name of the user who sent the invitation.
 * @param props.invitedByLastName - The last name of the user who sent the invitation.
 * @param props.invitedByEmail - The email address of the user who sent the invitation.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendInvite(to: string, props: InviteEmailProps) {
  await sendEmail({
    email: <InviteEmail {...props} />,
    to,
    subject: "You're invited to TrailEyes",
  });
}

/**
 * Sends a verification email to the specified recipient.
 *
 * @param to - The email address of the recipient.
 * @param props.code - The verification code.
 * @param props.firstName - The first name of the recipient.
 * @param props.lastName - The last name of the recipient.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendVerification(to: string, props: VerifyEmailProps) {
  await sendEmail({
    email: <VerifyEmail {...props} />,
    to,
    subject: 'Verify your TrailEyes email',
  });
}

/**
 * Sends an OTP (One-Time Password) email to the specified recipient.
 *
 * @param to - The email address of the recipient.
 * @param props.code - The verification code.
 * @param props.firstName - The first name of the recipient.
 * @param props.lastName - The last name of the recipient.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendOtp(to: string, props: OtpEmailProps) {
  await sendEmail({
    email: <OtpEmail {...props} />,
    to,
    subject: `Your TrailEyes verification code is ${props.code}`,
  });
}
