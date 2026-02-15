'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import type { Response } from '@/lib/openapi';

interface ResponsePanelProps {
  responses: Record<string, Response>;
}

export function ResponsePanel({ responses }: ResponsePanelProps) {
  // Get the success response (200 or 201)
  const successResponse = responses['200'] || responses['201'];

  if (!successResponse) {
    return (
      <p className="text-sm text-[rgb(var(--muted-foreground))]">
        No response schema available.
      </p>
    );
  }

  const schema = successResponse.content?.['application/json']?.schema as any;

  if (!schema) {
    return (
      <p className="text-sm text-[rgb(var(--muted-foreground))]">
        No response schema available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <SchemaFields schema={schema} />
    </div>
  );
}

function SchemaFields({ schema, depth = 0 }: { schema: any; depth?: number }) {
  if (!schema || !schema.properties) {
    return null;
  }

  return (
    <div className="space-y-3">
      {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
        <FieldItem key={key} name={key} schema={prop} depth={depth} />
      ))}
    </div>
  );
}

function FieldItem({ name, schema, depth }: { name: string; schema: any; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = schema.type === 'object' && schema.properties;
  const isArray = schema.type === 'array';
  const arrayItemSchema = isArray ? schema.items : null;
  const hasArrayChildren = arrayItemSchema?.type === 'object' && arrayItemSchema?.properties;

  return (
    <div className="border-b border-[rgb(var(--border))] pb-3 last:border-0">
      <div className="flex items-start gap-2">
        {(hasChildren || hasArrayChildren) ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-0.5 p-0.5 hover:bg-[rgb(var(--muted))] rounded"
          >
            {expanded ? (
              <ChevronDownIcon className="h-3 w-3 text-[rgb(var(--muted-foreground))]" />
            ) : (
              <ChevronRightIcon className="h-3 w-3 text-[rgb(var(--muted-foreground))]" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <code className="font-semibold text-sm">{name}</code>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {getTypeDisplay(schema)}
            </span>
            {schema.format && (
              <span className="text-xs text-purple-600 dark:text-purple-400">
                {schema.format}
              </span>
            )}
            {schema.readOnly && (
              <span className="text-xs text-slate-500">Read-only</span>
            )}
          </div>
          {schema.description && (
            <p className="text-sm text-[rgb(var(--muted-foreground))]">
              {schema.description}
            </p>
          )}
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-6 mt-3 pl-3 border-l border-[rgb(var(--border))]">
          <SchemaFields schema={schema} depth={depth + 1} />
        </div>
      )}

      {expanded && hasArrayChildren && (
        <div className="ml-6 mt-3 pl-3 border-l border-[rgb(var(--border))]">
          <SchemaFields schema={arrayItemSchema} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

function getTypeDisplay(schema: any): string {
  if (!schema) return 'any';

  if (schema.type === 'array') {
    const itemType = schema.items?.type || 'object';
    return `list of ${itemType}s`;
  }

  if (schema.enum) {
    return `enum: ${schema.enum.join(' | ')}`;
  }

  if (schema.oneOf || schema.anyOf) {
    return 'mixed';
  }

  return schema.type || 'any';
}
