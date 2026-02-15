'use client';

import Link from 'next/link';
import { MethodBadge } from './MethodBadge';
import type { EndpointInfo } from '@/lib/openapi';
import { tagToSlug, endpointToSlug } from '@/lib/openapi';

interface EndpointCardProps {
  endpoint: EndpointInfo;
  tag: string;
}

export function EndpointCard({ endpoint, tag }: EndpointCardProps) {
  const href = `/endpoints/${tagToSlug(tag)}/${endpointToSlug(endpoint)}`;

  return (
    <Link
      href={href}
      className="block p-4 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]
                 hover:border-[rgb(var(--primary))] hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <MethodBadge method={endpoint.method} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-[rgb(var(--foreground))] truncate">
            {endpoint.path}
          </div>
          <div className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
            {endpoint.summary}
          </div>
        </div>
      </div>
    </Link>
  );
}
