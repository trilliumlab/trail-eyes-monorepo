import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { EmailBase } from './_components/email-base';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
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
