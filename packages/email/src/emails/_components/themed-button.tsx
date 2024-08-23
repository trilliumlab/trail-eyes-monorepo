import { Button } from '@react-email/components';

export function ThemedButton({ href, children }: { href: string; children: string }) {
  return (
    <>
      <span className="text-foreground">&#8203;</span>
      <Button
        className="foreground-button rounded text-background text-xs font-semibold no-underline text-center px-4 py-3"
        href={href}
      >
        <span className="text-foreground">&#8203;</span>
        <span className="foreground-button-text">{children}</span>
      </Button>
    </>
  );
}
