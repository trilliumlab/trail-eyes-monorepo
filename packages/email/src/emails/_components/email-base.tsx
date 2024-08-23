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

/*
Css with \0 will only apply to outlook. This style block will be removed in gmail.

Outlook inverts the button color if it's white, so we set the background as a 1x1 white pixel to prevent it from being inverted.
Outlook adds a data-ogsc attribute whenver it changes a color in dark mode, so we have a dummy span as the sibling
Of the button, and so this selector only applies when the siblings color has changed (ie we're in dark mode)

We use the same concept with the text, but we use background-clip: text to render the text as a clip of a tiled 1x1 black pixel
*/
const outlookCss = `
[data-ogsc] + .foreground-button\0{
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=);
}

[data-ogsc] + .foreground-button-text\0{
  background-clip: text;
  color: transparent;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=);
}
`;

export function EmailBase({ children, previewText }: EmailBaseProps) {
  return (
    <Html>
      <Head>
        <style type="text/css">{globalCss}</style>
        <style type="text/css">{outlookCss}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind config={tailwindConfig}>{children}</Tailwind>
    </Html>
  );
}
