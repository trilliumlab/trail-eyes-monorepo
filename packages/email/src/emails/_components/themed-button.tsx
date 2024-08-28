import { Button } from '@react-email/components';

/**
 * Renders a themed button component.
 *
 * @param href - The URL to navigate to when the button is clicked.
 * @param children - The button text.
 * @returns The rendered themed button component.
 */
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
