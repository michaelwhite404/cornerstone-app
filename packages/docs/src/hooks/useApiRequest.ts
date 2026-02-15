'use client';

import { useState, useCallback } from 'react';

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
}

interface RequestOptions {
  method: string;
  url: string;
  body?: any;
  token?: string;
}

export function useApiRequest() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const execute = useCallback(async (options: RequestOptions) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setDuration(null);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: options.method,
          url: options.url,
          body: options.body,
          token: options.token,
        }),
      });

      const endTime = performance.now();
      setDuration(Math.round(endTime - startTime));

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Request failed');
        return;
      }

      setResponse({
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        data: data.data,
      });
    } catch (err) {
      const endTime = performance.now();
      setDuration(Math.round(endTime - startTime));
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setDuration(null);
  }, []);

  return {
    execute,
    reset,
    response,
    error,
    isLoading,
    duration,
  };
}
