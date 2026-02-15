import type { OpenAPISpec } from './openapi';
import { parseEndpoints, groupEndpointsByTag, tagToSlug, endpointToSlug } from './openapi';

export interface NavItem {
  title: string;
  href: string;
  method?: string;
}

export interface NavGroup {
  title: string;
  description?: string;
  items: NavItem[];
}

// Generate navigation from OpenAPI spec
export function generateNavigation(spec: OpenAPISpec): NavGroup[] {
  const grouped = groupEndpointsByTag(parseEndpoints(spec), spec);

  return grouped.map((group) => ({
    title: group.tag,
    description: group.description,
    items: group.endpoints.map((endpoint) => ({
      title: endpoint.summary,
      href: `/endpoints/${tagToSlug(group.tag)}/${endpointToSlug(endpoint)}`,
      method: endpoint.method,
    })),
  }));
}

// Flatten navigation for search
export function flattenNavigation(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      title: `${group.title}: ${item.title}`,
    }))
  );
}
