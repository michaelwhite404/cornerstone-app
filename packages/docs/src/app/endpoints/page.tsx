import { loadOpenApiSpec, parseEndpoints, groupEndpointsByTag } from '@/lib/openapi';
import { EndpointCard } from '@/components/docs';

export default async function EndpointsPage() {
  const spec = await loadOpenApiSpec();
  const endpoints = parseEndpoints(spec);
  const grouped = groupEndpointsByTag(endpoints, spec);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          API Endpoints
        </h1>
        <p className="text-lg text-[rgb(var(--muted-foreground))]">
          Browse all available API endpoints organized by resource.
        </p>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[rgb(var(--border))] rounded-lg">
          <p className="text-[rgb(var(--muted-foreground))]">
            No endpoints found. Run <code className="px-2 py-1 bg-[rgb(var(--muted))] rounded">pnpm generate:openapi</code> to generate the API spec.
          </p>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.tag}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{group.tag}</h2>
              {group.description && (
                <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
                  {group.description}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              {group.endpoints.map((endpoint) => (
                <EndpointCard
                  key={endpoint.id}
                  endpoint={endpoint}
                  tag={group.tag}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
