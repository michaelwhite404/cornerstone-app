'use client';

import { useTheme } from '@/lib/theme';
import { clsx } from 'clsx';

interface CodePanelProps {
  children: React.ReactNode;
}

export function CodePanel({ children }: CodePanelProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={clsx(
      "rounded-xl overflow-hidden border",
      isDark
        ? "bg-slate-900 border-slate-700"
        : "bg-slate-50 border-slate-200"
    )}>
      {children}
    </div>
  );
}
