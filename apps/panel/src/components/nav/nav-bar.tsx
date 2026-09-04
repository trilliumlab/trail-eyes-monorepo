import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Link } from '@tanstack/react-router';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/sheet';
import { useLocation, type LinkComponent } from '@tanstack/react-router';
import { Menu, Package2, Search } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { UserButton } from '@daveyplate/better-auth-ui';
import { ThemeMenu } from './theme-menu';
import { authClient } from '~/backend';

const NavLink: LinkComponent<'a'> = ({ className, ...props }) => {
  const location = useLocation();

  const selected = location.pathname === props.to;

  return (
    <Link
      {...props}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap no-underline",
        selected && "text-foreground/90"
      )}
    />
  );
};

function NavLinks() {
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as { tier?: string } | undefined)?.tier === '4';

  return (
    <>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/confirmed">Confirmed Reports</NavLink>
      <NavLink to="/unconfirmed">Unconfirmed Reports</NavLink>
      {isAdmin && <NavLink to="/pending-staff">Pending Staff</NavLink>}
    </>
  );
}

export function NavBar() {
  return (
    <header className="z-30 sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-b from-background via-background/50 to-background/50 backdrop-blur-md px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Package2 className="h-6 w-6" />
          <span className="sr-only">TrailEyes Panel</span>
        </Link>
        <NavLinks />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-4 m-4 text-lg font-medium">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">TrailEyes Panel</span>
            </Link>
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trails..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ThemeMenu />
        <UserButton size="icon" />
      </div>
    </header>
  );
}
