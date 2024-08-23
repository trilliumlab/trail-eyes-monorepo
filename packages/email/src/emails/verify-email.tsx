import { Heading, Hr, Img, Section, Text } from '@react-email/components';
import { EmailBase } from './_components/email-base';
import { EmailCard } from './_components/email-card';

export interface VerifyEmailProps {
  code: string;
  firstName: string;
  lastName: string;
}

export default function VerifyEmail({
  code = '123456',
  firstName = 'Jane',
  lastName = 'Doe',
}: VerifyEmailProps) {
  const previewText = `Your TrailEyes verification code is ${code}`;

  return (
    <EmailBase previewText={previewText}>
      <EmailCard>
        <Section className="mt-6">
          <Img
            src="https://github.com/trilliumlab/forest-park-reports-app/blob/dev/assets/icon/icon-compressed.png?raw=true"
            width="40"
            height="37"
            alt="Vercel"
            className="my-0 mx-auto rounded"
          />
        </Section>
        <Heading className="text-black text-2xl font-normal text-center p-0 my-6 mx-0">
          Verify your <strong>TrailEyes</strong> email
        </Heading>
        <Text className="text-black text-sm leading-6">
          Enter it in your open browser window. This code will expire in 15 minutes.
        </Text>
        <VerificationCode>{code}</VerificationCode>
        <Hr className="border border-solid border-border my-6 mx-0 w-full" />
        <Text className="text-muted-foreground text-xs leading-6">
          This email was intended for{' '}
          <span className="text-foreground">
            {firstName} {lastName}
          </span>
          . If you did not request this code, you can safely ignore this email.
        </Text>
      </EmailCard>
    </EmailBase>
  );
}

function VerificationCode({ children }: { children: string }) {
  const group1 = children.slice(0, 3);
  const group2 = children.slice(3);

  return (
    <Section className="bg-foreground/5 border border-solid border-border rounded w-56 my-8">
      <Heading className="my-2 ml-1.5 mb-2.5 text-center tracking-[8px]">
        <span>{group1}</span>
        <span className="ml-3">{group2}</span>
      </Heading>
    </Section>
  );
}
