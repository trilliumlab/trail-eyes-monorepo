import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
import { EmailBase } from './_components/email-base';
import { ThemedButton } from './_components/themed-button';

export interface InviteEmailProps {
  firstName: string;
  lastName: string;
  inviteRole: string;
  invitedByFirstName: string;
  invitedByLastName: string;
  invitedByEmail: string;
}

const signupUrl = 'https://traileyes.net/signup';

/**
 * Represents an email for inviting users to TrailEyes.
 *
 * @param firstName - The first name of the user being invited.
 * @param lastName - The last name of the user being invited.
 * @param inviteRole - The role for which the user is being invited.
 * @param invitedByFirstName - The first name of the user who sent the invitation.
 * @param invitedByLastName - The last name of the user who sent the invitation.
 * @param invitedByEmail - The email address of the user who sent the invitation.
 *
 * @returns The rendered invitation email.
 */
export default function InviteEmail({
  firstName = 'Jane',
  lastName = 'Doe',
  inviteRole = 'volunteer',
  invitedByFirstName = 'John',
  invitedByLastName = 'Doe',
  invitedByEmail = 'johndoe@gmail.com',
}: InviteEmailProps) {
  const previewText = `${invitedByFirstName} ${invitedByLastName} has invited you to TrailEyes as a ${inviteRole}.`;

  return (
    <EmailBase previewText={previewText}>
      <Card>
        <CardHeader>
          You're invited to <strong>TrailEyes</strong>
        </CardHeader>
        <CardContent>
          <Text className="text-black text-sm leading-6">
            <strong>
              {invitedByFirstName} {invitedByLastName}
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
            or copy and paste this URL into your browser:{' '}
            <Link href={signupUrl} className="text-blue-600 no-underline">
              {signupUrl}
            </Link>
          </Text>
        </CardContent>
        <CardFooter>
          This invitation was intended for{' '}
          <span className="text-black">
            {firstName} {lastName}
          </span>
          . If you were not expecting this invitation, you can safely ignore this email.
        </CardFooter>
      </Card>
    </EmailBase>
  );
}
