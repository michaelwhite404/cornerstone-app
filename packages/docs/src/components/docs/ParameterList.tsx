'use client';

import type { Parameter } from '@/lib/openapi';

interface ParameterListProps {
  parameters: Parameter[];
}

export function ParameterList({ parameters }: ParameterListProps) {
  if (!parameters || parameters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {parameters.map((param) => (
        <div
          key={`${param.in}-${param.name}`}
          className="border-b border-[rgb(var(--border))] pb-4 last:border-0"
        >
          <div className="flex items-center gap-2 mb-1">
            <code className="font-semibold text-sm">{param.name}</code>
            <TypeBadge type={getSchemaType(param.schema)} />
            {param.required && <RequiredBadge />}
          </div>
          {param.description && (
            <p className="text-sm text-[rgb(var(--muted-foreground))]">
              {param.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="text-xs text-blue-600 dark:text-blue-400">
      {type}
    </span>
  );
}

function RequiredBadge() {
  return (
    <span className="text-xs text-orange-600 dark:text-orange-400">
      Required
    </span>
  );
}

function getSchemaType(schema: any): string {
  if (!schema) return 'any';

  if (schema.type === 'array') {
    const itemType = schema.items?.type || 'any';
    return `${itemType}[]`;
  }

  if (schema.enum) {
    return 'enum';
  }

  return schema.type || 'any';
}
