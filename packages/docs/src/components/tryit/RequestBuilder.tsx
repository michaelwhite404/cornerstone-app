'use client';

import { useEffect, useState } from 'react';
import type { Parameter } from '@/lib/openapi';
import { ChevronDownIcon, ChevronRightIcon, KeyIcon } from '@heroicons/react/outline';

interface RequestBuilderProps {
  pathParams: Parameter[];
  queryParams: Parameter[];
  hasBody: boolean;
  pathValues: Record<string, string>;
  queryValues: Record<string, string>;
  bodyValue: string;
  authToken: string;
  onPathChange: (values: Record<string, string>) => void;
  onQueryChange: (values: Record<string, string>) => void;
  onBodyChange: (value: string) => void;
  onAuthChange: (token: string) => void;
}

export function RequestBuilder({
  pathParams,
  queryParams,
  hasBody,
  pathValues,
  queryValues,
  bodyValue,
  authToken,
  onPathChange,
  onQueryChange,
  onBodyChange,
  onAuthChange,
}: RequestBuilderProps) {
  const [showAuth, setShowAuth] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [showQuery, setShowQuery] = useState(true);
  const [showBody, setShowBody] = useState(true);

  // Load saved auth token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('api-auth-token');
    if (saved) {
      onAuthChange(saved);
    }
  }, [onAuthChange]);

  // Save auth token to localStorage
  const handleAuthChange = (token: string) => {
    onAuthChange(token);
    localStorage.setItem('api-auth-token', token);
  };

  return (
    <div className="space-y-4">
      {/* Auth Section */}
      <Section
        title="Authentication"
        icon={<KeyIcon className="h-4 w-4" />}
        isOpen={showAuth}
        onToggle={() => setShowAuth(!showAuth)}
      >
        <div>
          <label className="block text-xs text-[rgb(var(--muted-foreground))] mb-1">
            Bearer Token
          </label>
          <input
            type="password"
            value={authToken}
            onChange={(e) => handleAuthChange(e.target.value)}
            placeholder="Enter your JWT token"
            className="w-full px-3 py-2 text-sm rounded-lg border border-[rgb(var(--border))]
                       bg-[rgb(var(--background))] focus:outline-none focus:ring-2
                       focus:ring-[rgb(var(--primary))] focus:border-transparent"
          />
        </div>
      </Section>

      {/* Path Parameters */}
      {pathParams.length > 0 && (
        <Section
          title="Path Parameters"
          isOpen={showPath}
          onToggle={() => setShowPath(!showPath)}
        >
          <div className="space-y-3">
            {pathParams.map((param) => (
              <div key={param.name}>
                <label className="flex items-center gap-2 text-xs mb-1">
                  <code>{param.name}</code>
                  {param.required && (
                    <span className="text-red-500 text-[10px]">required</span>
                  )}
                </label>
                <input
                  type="text"
                  value={pathValues[param.name] || ''}
                  onChange={(e) =>
                    onPathChange({ ...pathValues, [param.name]: e.target.value })
                  }
                  placeholder={param.description || `Enter ${param.name}`}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[rgb(var(--border))]
                             bg-[rgb(var(--background))] focus:outline-none focus:ring-2
                             focus:ring-[rgb(var(--primary))] focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Query Parameters */}
      {queryParams.length > 0 && (
        <Section
          title="Query Parameters"
          isOpen={showQuery}
          onToggle={() => setShowQuery(!showQuery)}
        >
          <div className="space-y-3">
            {queryParams.map((param) => (
              <div key={param.name}>
                <label className="flex items-center gap-2 text-xs mb-1">
                  <code>{param.name}</code>
                  {param.required && (
                    <span className="text-red-500 text-[10px]">required</span>
                  )}
                </label>
                <input
                  type="text"
                  value={queryValues[param.name] || ''}
                  onChange={(e) =>
                    onQueryChange({ ...queryValues, [param.name]: e.target.value })
                  }
                  placeholder={param.description || `Enter ${param.name}`}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[rgb(var(--border))]
                             bg-[rgb(var(--background))] focus:outline-none focus:ring-2
                             focus:ring-[rgb(var(--primary))] focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Request Body */}
      {hasBody && (
        <Section
          title="Request Body"
          isOpen={showBody}
          onToggle={() => setShowBody(!showBody)}
        >
          <textarea
            value={bodyValue}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder='{"key": "value"}'
            rows={6}
            className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-[rgb(var(--border))]
                       bg-[rgb(var(--background))] focus:outline-none focus:ring-2
                       focus:ring-[rgb(var(--primary))] focus:border-transparent resize-y"
          />
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[rgb(var(--border))] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
                   bg-[rgb(var(--muted))] hover:bg-[rgb(var(--accent))] transition-colors"
      >
        {isOpen ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
        {icon}
        {title}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}
