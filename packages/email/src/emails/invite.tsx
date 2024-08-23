import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { EmailBase } from './_components/email-base';
import { EmailCard } from './_components/email-card';

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
      <EmailCard>
        <Section className="mt-6">
          <Img
            src="https://github.com/trilliumlab/forest-park-reports-app/blob/dev/assets/icon/icon-compressed.png?raw=true"
            width="40"
            height="37"
            alt="TrailEyes"
            className="my-0 mx-auto rounded-lg"
          />
        </Section>
        <Heading className="text-black text-2xl font-normal text-center p-0 my-6 mx-0">
          You're invited to <strong>TrailEyes</strong>
        </Heading>
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
          <Button
            className="bg-primary rounded text-background text-xs font-semibold no-underline text-center px-4 py-3"
            href={signupUrl}
          >
            Create an account
          </Button>
        </Section>
        <Text className="text-black text-xs leading-6">
          or copy and paste this URL into your browser:{' '}
          <Link href={signupUrl} className="text-blue-600 no-underline">
            {signupUrl}
          </Link>
        </Text>
        <Hr className="border border-solid border-border my-6 mx-0 w-full" />
        <Text className="text-muted-foreground text-xs leading-6">
          This invitation was intended for{' '}
          <span className="text-black">
            {firstName} {lastName}
          </span>
          . If you were not expecting this invitation, you can safely ignore this email.
        </Text>
      </EmailCard>
    </EmailBase>
  );
}
