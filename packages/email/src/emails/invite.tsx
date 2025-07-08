import { Link, Section, Text } from '@react-email/components';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
import { EmailBase } from './_components/email-base';
import { ThemedButton } from './_components/themed-button';

export interface InviteEmailProps {
  name: string;
  inviteRole: string;
  invitedByName: string;
  invitedByEmail: string;
}

const signupUrl = 'https://traileyes.net/signup';

/**
 * Represents an email for inviting users to TrailEyes.
 *
 * @param name - The full name of the user being invited.
 * @param inviteRole - The role for which the user is being invited.
 * @param invitedByName - The full name of the user who sent the invitation.
 * @param invitedByEmail - The email address of the user who sent the invitation.
 *
 * @returns The rendered invitation email.
 */
export default function InviteEmail({
  name = 'Jane Doe',
  inviteRole = 'volunteer',
  invitedByName = 'John Doe',
  invitedByEmail = 'johndoe@gmail.com',
}: InviteEmailProps) {
  const previewText = `${invitedByName} has invited you to TrailEyes as a ${inviteRole}.`;

  return (
    <EmailBase previewText={previewText}>
      <Card>
        <CardHeader>
          You're invited to <strong>TrailEyes</strong>
        </CardHeader>
        <CardContent>
          <Text className="text-black text-sm leading-6">
            <strong>
              {invitedByName}
            </strong>{' '}
            (
            <Link href={`mailto:${invitedByEmail}`} className="text-blue-600 no-underline">
              {invitedByEmail}
            </Link>
            ) has invited you to <strong>TrailEyes</strong> as a <strong>{inviteRole}</strong>.
          </Text>
          <Section className="text-center mt-8 mb-8">
            <ThemedButton href={signupUrl}>Create an account</ThemedButton>
          </Section>
          <Text className="text-black text-xs leading-6">
            Or paste this link into your browser:{' '}
            <Link href={signupUrl} className="text-blue-600 no-underline">
              {signupUrl}
            </Link>
          </Text>
        </CardContent>
        <CardFooter>
          This invitation was intended for{' '}
          <span className="text-black">
            {name}
          </span>
          . If you were not expecting this invitation, you can safely ignore this email.
        </CardFooter>
      </Card>
    </EmailBase>
  );
}
