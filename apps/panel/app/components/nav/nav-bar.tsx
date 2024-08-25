import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/sheet';
import { Menu, Package2, Search } from 'lucide-react';
import Link from 'next/link';
import { NavLink } from './nav-link';
import { UserMenu } from './user-menu';

function NavLinks() {
  return (
    <>
      <NavLink href="/">Dashboard</NavLink>
      <NavLink href="/confirmed">Confirmed Reports</NavLink>
      <NavLink href="/unconfirmed">Unconfirmed Reports</NavLink>
    </>
  );
}

export function NavBar() {
  return (
    <header className="z-30 sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-b from-background via-background/50 to-background/50 backdrop-blur-md px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
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
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
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
        <UserMenu />
      </div>
    </header>
  );
}
