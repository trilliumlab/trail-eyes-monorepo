'use client';

import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useTheme } from '@repo/ui/components/theme';
import { UserIcon, SunIcon, MoonIcon } from 'lucide-react';

export function ThemeMenu() {
  const theme = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-8 rounded-full">
          <SunIcon className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
