import { MethodBadge } from './MethodBadge';
import type { EndpointInfo } from '@/lib/openapi';

interface EndpointHeaderProps {
  endpoint: EndpointInfo;
}

export function EndpointHeader({ endpoint }: EndpointHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method={endpoint.method} />
        <code className="text-lg font-mono">{endpoint.path}</code>
      </div>
      <h1 className="text-2xl font-bold mb-2">{endpoint.summary}</h1>
      {endpoint.description && (
        <p className="text-[rgb(var(--muted-foreground))]">{endpoint.description}</p>
      )}
    </div>
  );
}
