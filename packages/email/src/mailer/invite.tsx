import { sendEmail } from '~/email-client';
import InviteEmail from '~/emails/invite';

export async function sendInvite(to: string) {
  await sendEmail({
    email: <InviteEmail />,
    to,
    subject: "You've been invited to TrailEyes",
  });
}
