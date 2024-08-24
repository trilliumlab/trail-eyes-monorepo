import { Text } from '@react-email/components';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
import { EmailBase } from './_components/email-base';
import { VerificationCode } from './_components/verification-code';

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
