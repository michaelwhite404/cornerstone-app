import type { OpenAPIV3_1 } from 'openapi-types';

export type OpenAPISpec = OpenAPIV3_1.Document;
export type PathItem = OpenAPIV3_1.PathItemObject;
export type Operation = OpenAPIV3_1.OperationObject;
export type Schema = OpenAPIV3_1.SchemaObject;
export type Parameter = OpenAPIV3_1.ParameterObject;
export type RequestBody = OpenAPIV3_1.RequestBodyObject;
export type Response = OpenAPIV3_1.ResponseObject;

export interface EndpointInfo {
  id: string;
  path: string;
  method: string;
  operation: Operation;
  tag: string;
  summary: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

export interface GroupedEndpoints {
  tag: string;
  description?: string;
  endpoints: EndpointInfo[];
}

// Load OpenAPI spec - in production this would be from a static file
export async function loadOpenApiSpec(): Promise<OpenAPISpec> {
  // In development, try to load from the generated file
  // In production, this is bundled at build time
  try {
    const spec = await import('../../public/openapi.json');
    return spec.default as OpenAPISpec;
  } catch {
    // Return a minimal spec if the file doesn't exist yet
    return {
      openapi: '3.1.0',
      info: {
        title: 'Cornerstone API',
        version: '2.0.0',
        description: 'API documentation is being generated...',
      },
      paths: {},
    };
  }
}

// Parse all endpoints from the spec
export function parseEndpoints(spec: OpenAPISpec): EndpointInfo[] {
  const endpoints: EndpointInfo[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths || {})) {
    if (!pathItem) continue;

    const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

    for (const method of methods) {
      const operation = (pathItem as PathItem)[method] as Operation | undefined;
      if (!operation) continue;

      const tag = operation.tags?.[0] || 'Other';
      const id = `${method}-${path.replace(/[{}\/]/g, '-').replace(/^-|-$/g, '')}`;

      endpoints.push({
        id,
        path,
        method: method.toUpperCase(),
        operation,
        tag,
        summary: operation.summary || `${method.toUpperCase()} ${path}`,
        description: operation.description,
        parameters: operation.parameters as Parameter[],
        requestBody: operation.requestBody as RequestBody,
        responses: (operation.responses || {}) as Record<string, Response>,
      });
    }
  }

  return endpoints;
}

// Group endpoints by tag
export function groupEndpointsByTag(
  endpoints: EndpointInfo[],
  spec: OpenAPISpec
): GroupedEndpoints[] {
  const groups = new Map<string, EndpointInfo[]>();

  for (const endpoint of endpoints) {
    const existing = groups.get(endpoint.tag) || [];
    existing.push(endpoint);
    groups.set(endpoint.tag, existing);
  }

  // Sort groups by tag name and add descriptions
  const tagDescriptions = new Map(
    (spec.tags || []).map((t) => [t.name, t.description])
  );

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tag, tagEndpoints]) => ({
      tag,
      description: tagDescriptions.get(tag),
      endpoints: tagEndpoints.sort((a, b) => {
        // Sort by path, then by method order (GET, POST, PUT, PATCH, DELETE)
        const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        const pathCompare = a.path.localeCompare(b.path);
        if (pathCompare !== 0) return pathCompare;
        return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
      }),
    }));
}

// Get a single endpoint by resource and operation ID
export function getEndpoint(
  spec: OpenAPISpec,
  resource: string,
  operationId: string
): EndpointInfo | null {
  const endpoints = parseEndpoints(spec);
  return endpoints.find((e) => e.id === operationId) || null;
}

// Get schema by name
export function getSchema(spec: OpenAPISpec, name: string): Schema | null {
  return (spec.components?.schemas?.[name] as Schema) || null;
}

// Resolve $ref to actual schema
export function resolveRef(spec: OpenAPISpec, ref: string): Schema | null {
  const parts = ref.split('/');
  if (parts[0] !== '#' || parts[1] !== 'components' || parts[2] !== 'schemas') {
    return null;
  }
  return getSchema(spec, parts[3]);
}

// Generate slug from tag name
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

// Generate slug from endpoint
export function endpointToSlug(endpoint: EndpointInfo): string {
  return endpoint.id;
}
