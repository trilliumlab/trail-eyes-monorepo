import { Heading, Section, Text } from '@react-email/components';
import { EmailBase } from './_components/email-base';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';

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
      <Card>
        <CardHeader>
          Verify your <strong>TrailEyes</strong> email
        </CardHeader>
        <CardContent>
          <Text className="text-black text-sm leading-6">
            Enter it in your open browser window. This code will expire in 15 minutes.
          </Text>
          <VerificationCode>{code}</VerificationCode>
        </CardContent>
        <CardFooter>
          This email was intended for{' '}
          <span className="text-foreground">
            {firstName} {lastName}
          </span>
          . If you did not request this code, you can safely ignore this email.
        </CardFooter>
      </Card>
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
