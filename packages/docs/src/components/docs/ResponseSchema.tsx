'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';
import type { Response } from '@/lib/openapi';
import { clsx } from 'clsx';

interface ResponseSchemaProps {
  responses: Record<string, Response>;
}

export function ResponseSchema({ responses }: ResponseSchemaProps) {
  const [expandedCode, setExpandedCode] = useState<string>('200');

  const statusCodes = Object.keys(responses).sort();

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3">Responses</h3>
      <div className="border border-[rgb(var(--border))] rounded-lg overflow-hidden">
        {statusCodes.map((code) => {
          const response = responses[code];
          const isExpanded = expandedCode === code;
          const statusClass = getStatusClass(code);

          return (
            <div key={code} className="border-b border-[rgb(var(--border))] last:border-b-0">
              <button
                onClick={() => setExpandedCode(isExpanded ? '' : code)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgb(var(--muted))] transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                )}
                <span className={clsx('font-mono font-semibold', statusClass)}>
                  {code}
                </span>
                <span className="text-sm text-[rgb(var(--muted-foreground))]">
                  {response.description}
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  {response.content?.['application/json']?.schema ? (
                    <SchemaViewer schema={response.content['application/json'].schema as any} />
                  ) : (
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      No response body
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SchemaViewer({ schema, depth = 0 }: { schema: any; depth?: number }) {
  if (!schema) return null;

  if (schema.type === 'object' && schema.properties) {
    return (
      <div className={clsx('space-y-1', depth > 0 && 'ml-4 border-l border-[rgb(var(--border))] pl-4')}>
        {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
          <div key={key} className="flex items-start gap-2 text-sm py-1">
            <code className="font-mono text-[rgb(var(--foreground))]">{key}</code>
            <span className="text-[rgb(var(--muted-foreground))]">:</span>
            <span className="font-mono text-xs text-blue-500 dark:text-blue-400">
              {prop.type || 'any'}
            </span>
            {prop.description && (
              <span className="text-[rgb(var(--muted-foreground))] text-xs">
                - {prop.description}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (schema.type === 'array' && schema.items) {
    return (
      <div className="text-sm">
        <span className="font-mono text-xs text-blue-500 dark:text-blue-400">
          {schema.items.type || 'any'}[]
        </span>
        {schema.items.type === 'object' && schema.items.properties && (
          <SchemaViewer schema={schema.items} depth={depth + 1} />
        )}
      </div>
    );
  }

  return (
    <span className="font-mono text-xs text-blue-500 dark:text-blue-400">
      {schema.type || 'any'}
    </span>
  );
}

function getStatusClass(code: string): string {
  const codeNum = parseInt(code, 10);
  if (codeNum >= 200 && codeNum < 300) return 'text-green-600 dark:text-green-400';
  if (codeNum >= 300 && codeNum < 400) return 'text-blue-600 dark:text-blue-400';
  if (codeNum >= 400 && codeNum < 500) return 'text-amber-600 dark:text-amber-400';
  if (codeNum >= 500) return 'text-red-600 dark:text-red-400';
  return 'text-[rgb(var(--foreground))]';
}
