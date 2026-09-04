'use client';

import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useTheme } from '@repo/ui/components/theme';
import { useRouter } from '@tanstack/react-router';
import { UserIcon } from 'lucide-react';
import { authClient } from '~/backend';

export function UserMenu() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="size-8 rounded-full">
          <UserIcon className="size-4" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Color Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme.value}
              onValueChange={theme.set as (theme: string) => void}
            >
              <DropdownMenuRadioItem indicator="checkmark" value="light">
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem indicator="checkmark" value="dark">
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem indicator="checkmark" value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut();
            router.navigate({ to: '/auth/$pathname', params: { pathname: 'sign-in' } });
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
