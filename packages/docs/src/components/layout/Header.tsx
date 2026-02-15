'use client';

import { ThemeToggle } from './ThemeToggle';
import { SearchButton } from './SearchButton';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--background))]/60">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side - spacer for mobile menu button */}
        <div className="w-10 lg:w-0" />

        {/* Center/Right - Search and Theme Toggle */}
        <div className="flex items-center gap-4">
          <SearchButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
