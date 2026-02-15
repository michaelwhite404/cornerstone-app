import { notFound } from 'next/navigation';
import {
  loadOpenApiSpec,
  parseEndpoints,
  groupEndpointsByTag,
  tagToSlug,
  endpointToSlug,
} from '@/lib/openapi';
import { generateCodeExamples } from '@/lib/code-generators';
import { MethodBadge } from '@/components/docs';
import { CodeTabs } from '@/components/code';
import { TryItPanel } from '@/components/tryit/TryItPanel';
import { ParameterList } from '@/components/docs/ParameterList';
import { ResponsePanel } from '@/components/docs/ResponsePanel';
import { CodePanel } from '@/components/docs/CodePanel';

interface PageProps {
  params: Promise<{
    resource: string;
    operation: string;
  }>;
}

export async function generateStaticParams() {
  const spec = await loadOpenApiSpec();
  const endpoints = parseEndpoints(spec);
  const grouped = groupEndpointsByTag(endpoints, spec);

  const params: Array<{ resource: string; operation: string }> = [];

  for (const group of grouped) {
    for (const endpoint of group.endpoints) {
      params.push({
        resource: tagToSlug(group.tag),
        operation: endpointToSlug(endpoint),
      });
    }
  }

  return params;
}

export default async function EndpointPage({ params }: PageProps) {
  const { resource, operation } = await params;
  const spec = await loadOpenApiSpec();
  const endpoints = parseEndpoints(spec);
  const grouped = groupEndpointsByTag(endpoints, spec);

  // Find the endpoint
  let foundEndpoint = null;
  let foundTag = '';

  for (const group of grouped) {
    if (tagToSlug(group.tag) === resource) {
      foundTag = group.tag;
      foundEndpoint = group.endpoints.find(
        (e) => endpointToSlug(e) === operation
      );
      break;
    }
  }

  if (!foundEndpoint) {
    notFound();
  }

  const codeExamples = generateCodeExamples(foundEndpoint);

  // Separate parameters by type
  const pathParams = foundEndpoint.parameters?.filter((p) => p.in === 'path') || [];
  const queryParams = foundEndpoint.parameters?.filter((p) => p.in === 'query') || [];

  return (
    <div className="flex gap-8">
      {/* Left column - Documentation */}
      <div className="flex-1 min-w-0 max-w-2xl">
        {/* Breadcrumb */}
        <div className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
          {foundTag} / {foundEndpoint.summary}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{foundEndpoint.summary}</h1>
          <div className="flex items-center gap-3 font-mono text-sm bg-[rgb(var(--muted))] rounded-lg px-4 py-2">
            <MethodBadge method={foundEndpoint.method} />
            <span className="text-[rgb(var(--muted-foreground))]">{foundEndpoint.path}</span>
          </div>
        </div>

        {/* Description */}
        {foundEndpoint.description && (
          <div className="mb-8">
            <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
              {foundEndpoint.description}
            </p>
          </div>
        )}

        {/* Authentication */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Authentication</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            Bearer authentication of the form <code className="px-1.5 py-0.5 bg-[rgb(var(--muted))] rounded text-xs">Bearer &lt;token&gt;</code>, where token is your auth token.
          </p>
        </section>

        {/* Path Parameters */}
        {pathParams.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Path parameters</h2>
            <ParameterList parameters={pathParams} />
          </section>
        )}

        {/* Query Parameters */}
        {queryParams.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Query parameters</h2>
            <ParameterList parameters={queryParams} />
          </section>
        )}

        {/* Request Body */}
        {foundEndpoint.requestBody && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Request</h2>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
              Request body for this endpoint.
            </p>
            {/* TODO: Parse request body schema into ParameterList */}
          </section>
        )}

        {/* Response */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Response</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
            Request was successful.
          </p>
          <ResponsePanel responses={foundEndpoint.responses} />
        </section>
      </div>

      {/* Right column - Code & Try It (sticky) */}
      <div className="hidden lg:block w-[420px] flex-shrink-0">
        <div className="sticky top-20">
          <CodePanel>
            <CodeTabs examples={codeExamples} />
            <TryItPanel endpoint={foundEndpoint} />
          </CodePanel>
        </div>
      </div>
    </div>
  );
}
