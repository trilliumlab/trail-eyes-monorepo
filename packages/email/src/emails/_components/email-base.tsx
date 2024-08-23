import { Head, Html, Preview, Tailwind } from '@react-email/components';
import tailwindConfig from '~/../tailwind.config';

export interface EmailBaseProps {
  children: React.ReactNode;
  previewText: string;
}

export function EmailBase({ children, previewText }: EmailBaseProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={tailwindConfig}>{children}</Tailwind>
    </Html>
  );
}
