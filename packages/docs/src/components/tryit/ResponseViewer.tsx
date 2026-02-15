'use client';

import { ClipboardCopyIcon, CheckIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { clsx } from 'clsx';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  } | null;
  error: string | null;
  duration: number | null;
  isLoading: boolean;
}

export function ResponseViewer({ response, error, duration, isLoading }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (response?.data) {
      await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-[rgb(var(--muted-foreground))]">
          <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
          <span>Sending request...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
          Request Failed
        </h4>
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-48 text-[rgb(var(--muted-foreground))]">
        <p className="text-sm">Click "Send Request" to see the response</p>
      </div>
    );
  }

  const statusClass = getStatusClass(response.status);

  return (
    <div className="space-y-3">
      {/* Status Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={clsx('font-mono font-semibold', statusClass)}>
            {response.status}
          </span>
          <span className="text-sm text-[rgb(var(--muted-foreground))]">
            {response.statusText}
          </span>
        </div>
        {duration !== null && (
          <span className="text-xs text-[rgb(var(--muted-foreground))]">
            {duration}ms
          </span>
        )}
      </div>

      {/* Response Body */}
      <div className="relative group">
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-auto max-h-96 text-sm">
          <code>{JSON.stringify(response.data, null, 2)}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={clsx(
            'absolute top-2 right-2 p-2 rounded-md transition-all',
            'opacity-0 group-hover:opacity-100',
            'bg-slate-700 hover:bg-slate-600 text-slate-300'
          )}
          title="Copy response"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-400" />
          ) : (
            <ClipboardCopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Headers (collapsed by default) */}
      <details className="text-sm">
        <summary className="cursor-pointer text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]">
          Response Headers
        </summary>
        <div className="mt-2 p-3 rounded-lg bg-[rgb(var(--muted))] font-mono text-xs space-y-1">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key}>
              <span className="text-[rgb(var(--muted-foreground))]">{key}:</span>{' '}
              <span>{value}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function getStatusClass(status: number): string {
  if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
  if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
  if (status >= 400 && status < 500) return 'text-amber-600 dark:text-amber-400';
  if (status >= 500) return 'text-red-600 dark:text-red-400';
  return 'text-[rgb(var(--foreground))]';
}
