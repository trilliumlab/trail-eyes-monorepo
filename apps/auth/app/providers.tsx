'use client';

import { Toaster } from '@repo/ui/toaster';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <Toaster />
      {children}
    </ThemeProvider>
  );
}
