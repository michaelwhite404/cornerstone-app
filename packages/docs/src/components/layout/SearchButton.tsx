'use client';

import { SearchIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { CommandPalette } from './CommandPalette';

export function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[rgb(var(--muted-foreground))]
                   bg-[rgb(var(--muted))] hover:bg-[rgb(var(--accent))] rounded-lg transition-colors"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium
                        bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
