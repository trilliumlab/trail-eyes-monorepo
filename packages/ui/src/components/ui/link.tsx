import NextLink, { type LinkProps } from 'next/link';
import { cn } from '@ui/lib/utils';

export const linkStyle =
  'cursor-pointer transition-colors rounded-sm hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-background focus-visible:ring-offset-1 focus-visible:ring-2 focus-visible:ring-ring underline';

export function Link(
  props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>,
) {
  return <NextLink {...props} className={cn(linkStyle, props.className)} />;
}
