import { Link, Section, Text } from '@react-email/components';
import { Card, CardContent, CardFooter, CardHeader } from './_components/card';
import { EmailBase } from './_components/email-base';
import { ThemedButton } from './_components/themed-button';

export interface VerifyEmailProps {
  url: string;
  name: string;
  expirationString: string;
}

/**
 * Renders a verification email.
 *
 * @param url - The verification url.
 * @param firstName - The first name of the recipient.
 * @param lastName - The last name of the recipient.
 * @returns The rendered verification email.
 */
export default function VerifyEmail({
  url = 'https://www.example.com',
  name = 'Jane Doe',
  expirationString = '1 hour',
}: VerifyEmailProps) {
  const previewText = `Your TrailEyes verification code is ${url}`;

  return (
    <EmailBase previewText={previewText}>
      <Card>
        <CardHeader>
          Verify your <strong>TrailEyes</strong> email
        </CardHeader>
        <CardContent>
          <Text className="text-black text-sm leading-6">
            You're receiving this email because you've recently signed up for a TrailEyes account. Please confirm your email address by clicking the button below. This link will expire in {expirationString}.
          </Text>
          <Section className="text-center mt-8 mb-8">
            <ThemedButton href={url}>Verify my email</ThemedButton>
          </Section>
          <Text className="text-black text-xs leading-6">
            Or paste this link into your browser:{' '}
            <Link href={url} className="text-blue-600 no-underline">
              {url}
            </Link>
          </Text>
        </CardContent>
        <CardFooter>
          This email was intended for{' '}
          <span className="text-foreground">
            {name}
          </span>
          . If you did not request this code, you can safely ignore this email.
        </CardFooter>
      </Card>
    </EmailBase>
  );
}
