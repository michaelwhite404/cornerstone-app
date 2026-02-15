'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  BookOpenIcon,
  KeyIcon,
  CollectionIcon,
  FilterIcon,
  ExclamationCircleIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { MethodBadge } from '@/components/docs/MethodBadge';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  method?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
}

interface EndpointGroup {
  tag: string;
  endpoints: Array<{
    id: string;
    path: string;
    method: string;
    summary: string;
  }>;
}

const staticNavigation: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/', icon: BookOpenIcon },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { title: 'Authentication', href: '/concepts/authentication', icon: KeyIcon },
      { title: 'Pagination', href: '/concepts/pagination', icon: CollectionIcon },
      { title: 'Filtering', href: '/concepts/filtering', icon: FilterIcon },
      { title: 'Errors', href: '/concepts/errors', icon: ExclamationCircleIcon },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [endpointGroups, setEndpointGroups] = useState<EndpointGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Load endpoints from OpenAPI spec
  useEffect(() => {
    fetch('/openapi.json')
      .then((res) => res.json())
      .then((spec) => {
        const groups = new Map<string, EndpointGroup['endpoints']>();

        for (const [path, pathItem] of Object.entries(spec.paths || {})) {
          const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

          for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation) continue;

            const tag = operation.tags?.[0] || 'Other';
            const id = `${method}-${path.replace(/[{}\/]/g, '-').replace(/^-|-$/g, '')}`;

            if (!groups.has(tag)) {
              groups.set(tag, []);
            }

            groups.get(tag)!.push({
              id,
              path,
              method: method.toUpperCase(),
              summary: operation.summary || `${method.toUpperCase()} ${path}`,
            });
          }
        }

        // Sort groups alphabetically and endpoints by path then method
        const sortedGroups: EndpointGroup[] = Array.from(groups.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([tag, endpoints]) => ({
            tag,
            endpoints: endpoints.sort((a, b) => {
              const pathCompare = a.path.localeCompare(b.path);
              if (pathCompare !== 0) return pathCompare;
              const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
              return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
            }),
          }));

        setEndpointGroups(sortedGroups);

        // Auto-expand all groups so badges are visible
        setExpandedGroups(new Set(sortedGroups.map((g) => g.tag)));
      })
      .catch(() => {
        // Silently fail if spec isn't available yet
      });
  }, [pathname]);

  const toggleGroup = (tag: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 bg-[rgb(var(--card))] border-r border-[rgb(var(--border))]',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[rgb(var(--border))]">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))] flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <div className="font-semibold">Cornerstone</div>
              <div className="text-xs text-[rgb(var(--muted-foreground))]">API Docs</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
            <div className="space-y-6">
              {/* Static navigation */}
              {staticNavigation.map((group) => (
                <div key={group.title}>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted-foreground))] mb-2">
                    {group.title}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={clsx('sidebar-link', isActive && 'active')}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Endpoints by resource */}
              {endpointGroups.length > 0 && (
                <div>
                  <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted-foreground))] mb-2">
                    API Reference
                  </h3>
                  <ul className="space-y-1">
                    {endpointGroups.map((group) => {
                      const isExpanded = expandedGroups.has(group.tag);
                      const slug = tagToSlug(group.tag);

                      return (
                        <li key={group.tag}>
                          <button
                            onClick={() => toggleGroup(group.tag)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg
                                       text-[rgb(var(--foreground))] hover:bg-[rgb(var(--accent))] transition-colors"
                          >
                            <span className="font-medium">{group.tag}</span>
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                            )}
                          </button>

                          {isExpanded && (
                            <ul className="mt-1 ml-3 space-y-0.5 border-l border-[rgb(var(--border))]">
                              {group.endpoints.map((endpoint) => {
                                const href = `/endpoints/${slug}/${endpoint.id}`;
                                const isActive = pathname === href;

                                return (
                                  <li key={endpoint.id}>
                                    <Link
                                      href={href}
                                      onClick={() => setMobileOpen(false)}
                                      className={clsx(
                                        'flex items-center gap-2 pl-3 pr-2 py-1.5 text-sm rounded-r-lg',
                                        'hover:bg-[rgb(var(--accent))] transition-colors',
                                        isActive
                                          ? 'bg-[rgb(var(--accent))] text-[rgb(var(--foreground))]'
                                          : 'text-[rgb(var(--muted-foreground))]'
                                      )}
                                    >
                                      <MethodBadge method={endpoint.method} size="sm" active={isActive} />
                                      <span className="truncate text-xs">
                                        {endpoint.summary}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[rgb(var(--border))] text-xs text-[rgb(var(--muted-foreground))]">
            <div>API Version: v2</div>
          </div>
        </div>
      </aside>
    </>
  );
}

function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}
