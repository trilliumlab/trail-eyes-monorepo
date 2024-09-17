import { Link as TSLink, type LinkComponent as TSLinkComponent } from '@tanstack/react-router';
import { cn } from '@ui/lib/utils';

export const linkStyle =
  'cursor-pointer transition-colors rounded-sm hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-background focus-visible:ring-offset-1 focus-visible:ring-2 focus-visible:ring-ring underline';

export const Link: TSLinkComponent<'a'> = ({ className, ...props }) => {
  return <TSLink {...props} className={cn(linkStyle, className)} />;
};
