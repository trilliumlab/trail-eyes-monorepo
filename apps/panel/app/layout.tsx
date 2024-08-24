import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@repo/ui/globals.css';
import { ThemeProvider } from 'next-themes';
import { publicEnv } from '@repo/util/public-env';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: `${publicEnv.APP_NAME} Panel`,
  description: `${publicEnv.APP_NAME} admin panel`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
