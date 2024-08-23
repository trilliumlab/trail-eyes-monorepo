import { Text } from '@react-email/components';
import { EmailBase } from './_components/email-base';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
import { VerificationCode } from './_components/verification-code';

export interface OtpEmailProps {
  code: string;
  firstName: string;
  lastName: string;
}

export default function OtpEmail({
  code = '123456',
  firstName = 'Jane',
  lastName = 'Doe',
}: OtpEmailProps) {
  const previewText = `Your TrailEyes verification code is ${code}`;

  return (
    <EmailBase previewText={previewText}>
      <Card>
        <CardHeader>
          Your <strong>TrailEyes</strong> verification code
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
          . If you did not request this code, your account may be compromised:{' '}
          <a className="muted-link" href="reset">
            reset your password
          </a>
          .
        </CardFooter>
      </Card>
    </EmailBase>
  );
}
