'use client';

import { Link } from '@repo/ui/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${pathname === href ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
    >
      {children}
    </Link>
  );
}
