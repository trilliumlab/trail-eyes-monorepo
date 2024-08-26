import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@repo/ui/globals.css';
import { publicEnv } from '@repo/util/public-env';
import { Providers } from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: `${publicEnv.APP_NAME} Auth`,
  description: `${publicEnv.APP_NAME} authentication service`,
};

// <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
