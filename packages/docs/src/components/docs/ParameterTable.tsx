import type { Parameter } from '@/lib/openapi';

interface ParameterTableProps {
  parameters: Parameter[];
  title?: string;
}

export function ParameterTable({ parameters, title = 'Parameters' }: ParameterTableProps) {
  if (!parameters || parameters.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="overflow-x-auto border border-[rgb(var(--border))] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[rgb(var(--muted))]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-left px-4 py-3 font-semibold">In</th>
              <th className="text-left px-4 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--border))]">
            {parameters.map((param) => (
              <tr key={`${param.in}-${param.name}`}>
                <td className="px-4 py-3">
                  <code className="text-sm font-mono">{param.name}</code>
                  {param.required && (
                    <span className="ml-2 text-xs text-red-500">required</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[rgb(var(--muted-foreground))]">
                  {getSchemaType(param.schema)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded text-xs bg-[rgb(var(--muted))]">
                    {param.in}
                  </span>
                </td>
                <td className="px-4 py-3 text-[rgb(var(--muted-foreground))]">
                  {param.description || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSchemaType(schema: any): string {
  if (!schema) return 'any';

  if (schema.type === 'array') {
    const itemType = schema.items?.type || 'any';
    return `${itemType}[]`;
  }

  if (schema.enum) {
    return schema.enum.map((v: string) => `"${v}"`).join(' | ');
  }

  return schema.type || 'any';
}
