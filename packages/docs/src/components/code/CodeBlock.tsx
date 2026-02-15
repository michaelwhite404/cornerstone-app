'use client';

import { useEffect, useState } from 'react';
import { ClipboardCopyIcon, CheckIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import { useTheme } from '@/lib/theme';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const highlight = async () => {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang: language as any,
          theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
        });
        setHighlightedHtml(html);
      } catch (e) {
        console.error('Failed to highlight code:', e);
      }
    };
    highlight();
  }, [code, language, resolvedTheme]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative group">
      {/* Header */}
      {filename && (
        <div className={clsx(
          "flex items-center justify-between px-4 py-2 border-b",
          isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
        )}>
          <span className={clsx(
            "text-sm font-mono",
            isDark ? "text-slate-400" : "text-slate-600"
          )}>{filename}</span>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className={clsx(
              '[&>pre]:!m-0 [&>pre]:p-4 [&>pre]:overflow-x-auto',
              '[&_code]:!bg-transparent [&_code]:text-sm [&_code]:leading-relaxed',
              isDark ? '[&>pre]:!bg-slate-900' : '[&>pre]:!bg-slate-50',
              showLineNumbers && '[&>pre]:pl-12'
            )}
          />
        ) : (
          <pre className={clsx(
            "p-4 overflow-x-auto",
            isDark ? "bg-slate-900" : "bg-slate-50"
          )}>
            <code className={clsx(
              "text-sm leading-relaxed",
              isDark ? "text-slate-100" : "text-slate-800"
            )}>{code}</code>
          </pre>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={clsx(
            'absolute top-2 right-2 p-2 rounded-md transition-all',
            'opacity-0 group-hover:opacity-100',
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
          )}
          title="Copy code"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ClipboardCopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
