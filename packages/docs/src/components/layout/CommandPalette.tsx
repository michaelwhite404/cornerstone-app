'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import {
  BookOpenIcon,
  KeyIcon,
  CollectionIcon,
  FilterIcon,
  ExclamationCircleIcon,
  CodeIcon,
} from '@heroicons/react/outline';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  href: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const staticPages: SearchResult[] = [
  { id: 'intro', title: 'Introduction', href: '/', category: 'Getting Started', icon: BookOpenIcon },
  { id: 'auth', title: 'Authentication', href: '/concepts/authentication', category: 'Concepts', icon: KeyIcon },
  { id: 'pagination', title: 'Pagination', href: '/concepts/pagination', category: 'Concepts', icon: CollectionIcon },
  { id: 'filtering', title: 'Filtering', href: '/concepts/filtering', category: 'Concepts', icon: FilterIcon },
  { id: 'errors', title: 'Error Handling', href: '/concepts/errors', category: 'Concepts', icon: ExclamationCircleIcon },
  { id: 'endpoints', title: 'API Endpoints', href: '/endpoints', category: 'Reference', icon: CodeIcon },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => onOpenChange(false)} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto p-4 pt-[20vh]">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-xl rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-2xl overflow-hidden">
              <Command className="flex flex-col" loop>
                <div className="flex items-center border-b border-[rgb(var(--border))] px-4">
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search documentation..."
                    className="flex-1 h-14 bg-transparent text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] outline-none"
                  />
                  <kbd className="text-xs px-1.5 py-0.5 rounded border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))]">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto scrollbar-thin p-2">
                  <Command.Empty className="py-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
                    No results found.
                  </Command.Empty>

                  {staticPages.map((page) => (
                    <Command.Item
                      key={page.id}
                      value={`${page.title} ${page.category}`}
                      onSelect={() => handleSelect(page.href)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                 data-[selected=true]:bg-[rgb(var(--accent))]"
                    >
                      <page.icon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                      <div className="flex-1">
                        <div className="text-sm">{page.title}</div>
                        <div className="text-xs text-[rgb(var(--muted-foreground))]">{page.category}</div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
