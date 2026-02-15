import type { EndpointInfo, Parameter, RequestBody } from "./openapi";

interface CodeExample {
  label: string;
  language: string;
  code: string;
}

// Generate code examples for an endpoint
export function generateCodeExamples(
  endpoint: EndpointInfo,
  baseUrl: string = "https://api.cornerstone-schools.org/v2"
): CodeExample[] {
  const fullUrl = `${baseUrl}${endpoint.path}`;

  return [
    generateCurl(endpoint, fullUrl),
    generateJavaScript(endpoint, fullUrl),
    generatePython(endpoint, fullUrl),
  ];
}

function generateCurl(endpoint: EndpointInfo, url: string): CodeExample {
  const lines: string[] = [];

  // Replace path params with placeholders
  let urlWithParams = url.replace(/{(\w+)}/g, ":$1");

  lines.push(`curl -X ${endpoint.method} "${urlWithParams}" \\`);
  lines.push(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
  lines.push(`  -H "Content-Type: application/json"`);

  // Add request body for POST/PUT/PATCH
  if (endpoint.requestBody && ["POST", "PUT", "PATCH"].includes(endpoint.method)) {
    const exampleBody = generateExampleBody(endpoint.requestBody);
    if (exampleBody) {
      lines[lines.length - 1] += " \\";
      lines.push(`  -d '${JSON.stringify(exampleBody, null, 2).replace(/\n/g, "\n  ")}'`);
    }
  }

  return {
    label: "cURL",
    language: "bash",
    code: lines.join("\n"),
  };
}

function generateJavaScript(endpoint: EndpointInfo, url: string): CodeExample {
  const lines: string[] = [];

  // Replace path params with template literals
  let urlWithParams = url.replace(/{(\w+)}/g, "${$1}");

  lines.push("const response = await fetch(");
  lines.push(`  \`${urlWithParams}\`,`);
  lines.push("  {");
  lines.push(`    method: '${endpoint.method}',`);
  lines.push("    headers: {");
  lines.push("      'Authorization': `Bearer ${token}`,");
  lines.push("      'Content-Type': 'application/json',");
  lines.push("    },");

  // Add request body for POST/PUT/PATCH
  if (endpoint.requestBody && ["POST", "PUT", "PATCH"].includes(endpoint.method)) {
    const exampleBody = generateExampleBody(endpoint.requestBody);
    if (exampleBody) {
      lines.push(
        `    body: JSON.stringify(${JSON.stringify(exampleBody, null, 6).replace(
          /\n/g,
          "\n    "
        )}),`
      );
    }
  }

  lines.push("  }");
  lines.push(");");
  lines.push("");
  lines.push("const data = await response.json();");

  return {
    label: "JavaScript",
    language: "javascript",
    code: lines.join("\n"),
  };
}

function generatePython(endpoint: EndpointInfo, url: string): CodeExample {
  const lines: string[] = [];

  // Replace path params with f-string format
  let urlWithParams = url.replace(/{(\w+)}/g, "{$1}");

  lines.push("import requests");
  lines.push("");
  lines.push("headers = {");
  lines.push("    'Authorization': f'Bearer {token}',");
  lines.push("    'Content-Type': 'application/json',");
  lines.push("}");
  lines.push("");

  // Add request body for POST/PUT/PATCH
  if (endpoint.requestBody && ["POST", "PUT", "PATCH"].includes(endpoint.method)) {
    const exampleBody = generateExampleBody(endpoint.requestBody);
    if (exampleBody) {
      lines.push(
        "data = " +
          JSON.stringify(exampleBody, null, 4)
            .replace(/null/g, "None")
            .replace(/true/g, "True")
            .replace(/false/g, "False")
      );
      lines.push("");
      lines.push(`response = requests.${endpoint.method.toLowerCase()}(`);
      lines.push(`    f'${urlWithParams}',`);
      lines.push("    headers=headers,");
      lines.push("    json=data,");
      lines.push(")");
    } else {
      lines.push(`response = requests.${endpoint.method.toLowerCase()}(`);
      lines.push(`    f'${urlWithParams}',`);
      lines.push("    headers=headers,");
      lines.push(")");
    }
  } else {
    lines.push(`response = requests.${endpoint.method.toLowerCase()}(`);
    lines.push(`    f'${urlWithParams}',`);
    lines.push("    headers=headers,");
    lines.push(")");
  }

  lines.push("");
  lines.push("result = response.json()");

  return {
    label: "Python",
    language: "python",
    code: lines.join("\n"),
  };
}

function generateExampleBody(requestBody: RequestBody): Record<string, any> | null {
  const content = requestBody.content?.["application/json"];
  if (!content?.schema) return null;

  const schema = content.schema as any;

  // Generate example from schema
  if (schema.type === "object" && schema.properties) {
    const example: Record<string, any> = {};
    for (const [key, prop] of Object.entries(schema.properties) as [string, any][]) {
      example[key] = getExampleValue(prop);
    }
    return example;
  }

  return null;
}

function getExampleValue(schema: any): any {
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  switch (schema.type) {
    case "string":
      if (schema.enum) return schema.enum[0];
      if (schema.format === "date-time") return "2024-01-01T00:00:00Z";
      if (schema.format === "email") return "user@example.com";
      return "string";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return true;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return null;
  }
}

// Format query parameters for display
export function formatQueryParams(params?: Parameter[]): string {
  if (!params || params.length === 0) return "";

  const queryParams = params.filter((p) => p.in === "query");
  if (queryParams.length === 0) return "";

  const paramStrings = queryParams.map((p) => {
    const value = getExampleValue(p.schema || {});
    return `${p.name}=${encodeURIComponent(String(value))}`;
  });

  return "?" + paramStrings.join("&");
}
