import { Head, Html, Preview, Tailwind } from '@react-email/components';
import tailwindConfig from '~/../tailwind.config';

export interface EmailBaseProps {
  children: React.ReactNode;
  previewText: string;
}

const globalCss = `
.light-only {
  display: block;
}
.dark-only {
  display: none;
}

/* Styles here only apply to dark mode (outlook, apple mail) */
@media (prefers-color-scheme: dark) {
  .light-only {
    display: none !important;
  }
  .dark-only {
    display: block !important;
  }
}

.traileyes-image {
  background-image: url("https://github.com/trilliumlab/forest-park-reports-app/blob/dev/assets/icon/icon-64px.jpeg?raw=true");
  width: 64px;
  height: 64px;
}

.foreground-button {
  background-color: ${tailwindConfig.theme.extend.colors.foreground};
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.foreground-button:hover {
  background-color: ${tailwindConfig.theme.extend.colors.accent.foreground}e5;
}

.muted-link {
  color: ${tailwindConfig.theme.extend.colors.muted.foreground};
}
.muted-link:hover {
  color: ${tailwindConfig.theme.extend.colors.accent.foreground};
}
`;

export function EmailBase({ children, previewText }: EmailBaseProps) {
  return (
    <Html>
      <Head>
        <style type="text/css">{globalCss}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind config={tailwindConfig}>{children}</Tailwind>
    </Html>
  );
}
