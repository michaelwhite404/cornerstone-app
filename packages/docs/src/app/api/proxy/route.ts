import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v2';

interface ProxyRequest {
  method: string;
  url: string;
  body?: any;
  token?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProxyRequest = await request.json();
    const { method, url, body: requestBody, token } = body;

    // Build the full URL
    const fullUrl = `${API_BASE_URL}${url}`;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the actual API request
    const startTime = Date.now();
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });
    const endTime = Date.now();

    // Get response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Extract relevant headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      // Only include safe headers
      if (['content-type', 'x-total-count', 'x-page', 'x-per-page'].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      duration: endTime - startTime,
    });
  } catch (error) {
    console.error('Proxy error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to proxy request',
      },
      { status: 500 }
    );
  }
}
