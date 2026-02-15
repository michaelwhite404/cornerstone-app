'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CodeBlock } from './CodeBlock';
import { clsx } from 'clsx';
import { useTheme } from '@/lib/theme';

interface CodeExample {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
}

export function CodeTabs({ examples }: CodeTabsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <TabGroup>
      <TabList className={clsx(
        "flex border-b",
        isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"
      )}>
        {examples.map((example) => (
          <Tab
            key={example.label}
            className={({ selected }) =>
              clsx(
                'px-4 py-2 text-sm font-medium transition-colors outline-none',
                selected
                  ? isDark
                    ? 'text-white border-b-2 border-blue-400 bg-slate-700'
                    : 'text-slate-900 border-b-2 border-blue-500 bg-white'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
              )
            }
          >
            {example.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {examples.map((example) => (
          <TabPanel key={example.label}>
            <CodeBlock code={example.code} language={example.language} />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
