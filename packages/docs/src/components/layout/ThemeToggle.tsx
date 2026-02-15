'use client';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { SunIcon, MoonIcon, DesktopComputerIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';
import { useTheme } from '@/lib/theme';
import { clsx } from 'clsx';

const themes = [
  { value: 'light' as const, label: 'Light', icon: SunIcon },
  { value: 'dark' as const, label: 'Dark', icon: MoonIcon },
  { value: 'system' as const, label: 'System', icon: DesktopComputerIcon },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Menu as="div" className="relative">
      <MenuButton className="p-2 rounded-lg hover:bg-[rgb(var(--accent))] transition-colors">
        {resolvedTheme === 'dark' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-lg focus:outline-none">
          <div className="p-1">
            {themes.map(({ value, label, icon: Icon }) => (
              <MenuItem key={value}>
                {({ focus }) => (
                  <button
                    onClick={() => setTheme(value)}
                    className={clsx(
                      'flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md',
                      focus && 'bg-[rgb(var(--accent))]',
                      theme === value && 'text-[rgb(var(--primary))]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
