'use client';

import { useState, useCallback } from 'react';
import type { EndpointInfo } from '@/lib/openapi';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useTheme } from '@/lib/theme';
import { PlayIcon } from '@heroicons/react/solid';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';

interface TryItPanelProps {
  endpoint: EndpointInfo;
}

export function TryItPanel({ endpoint }: TryItPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState<string>('{}');
  const [authToken, setAuthToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('api-auth-token') || '';
    }
    return '';
  });

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { execute, response, isLoading, error, duration } = useApiRequest();

  const handleExecute = useCallback(async () => {
    // Build URL with path params
    let url = endpoint.path;
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    }

    // Add query params
    const queryString = Object.entries(queryParams)
      .filter(([, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    if (queryString) {
      url += `?${queryString}`;
    }

    // Parse body for POST/PUT/PATCH
    let parsedBody: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }
    }

    // Save token
    if (authToken) {
      localStorage.setItem('api-auth-token', authToken);
    }

    await execute({
      method: endpoint.method,
      url,
      body: parsedBody,
      token: authToken,
    });
  }, [endpoint, pathParams, queryParams, body, authToken, execute]);

  // Extract parameters by type
  const pathParamDefs = endpoint.parameters?.filter((p) => p.in === 'path') || [];
  const queryParamDefs = endpoint.parameters?.filter((p) => p.in === 'query') || [];
  const hasParams = pathParamDefs.length > 0 || queryParamDefs.length > 0 || ['POST', 'PUT', 'PATCH'].includes(endpoint.method);

  return (
    <div className={clsx(
      "border-t",
      isDark ? "border-slate-700" : "border-slate-200"
    )}>
      {/* Try It Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className={clsx(
            "flex items-center gap-2 text-sm",
            isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
          )}
        >
          {expanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
          <span>Parameters</span>
        </button>

        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg
                     bg-blue-600 text-white hover:bg-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
          Try it
        </button>
      </div>

      {/* Expanded Parameters */}
      {expanded && hasParams && (
        <div className="px-4 pb-4 space-y-4">
          {/* Auth Token */}
          <div>
            <label className={clsx(
              "block text-xs mb-1",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>Authorization Token</label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Bearer token"
              className={clsx(
                "w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-blue-500",
                isDark
                  ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              )}
            />
          </div>

          {/* Path Parameters */}
          {pathParamDefs.map((param) => (
            <div key={param.name}>
              <label className={clsx(
                "block text-xs mb-1",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                {param.name}
                {param.required && <span className="text-orange-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={pathParams[param.name] || ''}
                onChange={(e) => setPathParams({ ...pathParams, [param.name]: e.target.value })}
                placeholder={param.description || param.name}
                className={clsx(
                  "w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-blue-500",
                  isDark
                    ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>
          ))}

          {/* Query Parameters */}
          {queryParamDefs.map((param) => (
            <div key={param.name}>
              <label className={clsx(
                "block text-xs mb-1",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                {param.name}
                {param.required && <span className="text-orange-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={queryParams[param.name] || ''}
                onChange={(e) => setQueryParams({ ...queryParams, [param.name]: e.target.value })}
                placeholder={param.description || param.name}
                className={clsx(
                  "w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-blue-500",
                  isDark
                    ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>
          ))}

          {/* Request Body */}
          {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
            <div>
              <label className={clsx(
                "block text-xs mb-1",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>Request Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                rows={4}
                className={clsx(
                  "w-full px-3 py-2 text-sm font-mono rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y",
                  isDark
                    ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* Response */}
      {(response || error) && (
        <div className={clsx(
          "border-t",
          isDark ? "border-slate-700" : "border-slate-200"
        )}>
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {response && (
                <>
                  <span className={clsx(
                    'text-sm font-medium',
                    response.status >= 200 && response.status < 300 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {response.status}
                  </span>
                  <span className={clsx(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>{response.statusText}</span>
                </>
              )}
              {error && <span className="text-sm text-red-500">Error</span>}
            </div>
            {duration && (
              <span className={clsx(
                "text-xs",
                isDark ? "text-slate-500" : "text-slate-400"
              )}>{duration}ms</span>
            )}
          </div>

          <div className="max-h-64 overflow-auto">
            <pre className={clsx(
              "p-4 text-sm overflow-x-auto",
              isDark ? "text-slate-100 bg-slate-900" : "text-slate-800 bg-slate-50"
            )}>
              <code>
                {error ? error : JSON.stringify(response?.data, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
