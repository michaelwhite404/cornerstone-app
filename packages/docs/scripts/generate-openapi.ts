/**
 * OpenAPI Spec Generator
 *
 * This script generates an OpenAPI 3.1 specification from the server's route
 * and type definitions. It uses ts-morph to parse TypeScript files.
 *
 * Usage: tsx scripts/generate-openapi.ts
 */

import * as fs from "fs";
import * as path from "path";
import { Project, SourceFile, SyntaxKind, Node } from "ts-morph";

const SERVER_PATH = path.resolve(__dirname, "../../../server/src");
const OUTPUT_PATH = path.resolve(__dirname, "../public/openapi.json");

interface RouteInfo {
  method: string;
  path: string;
  handler: string;
  middleware: string[];
  description?: string;
}

interface ResourceRoutes {
  basePath: string;
  routes: RouteInfo[];
}

// Base OpenAPI spec structure
const baseSpec = {
  openapi: "3.1.0",
  info: {
    title: "Cornerstone API",
    version: "2.0.0",
    description: "API for the Cornerstone School Management Platform",
    contact: {
      name: "Cornerstone Development Team",
    },
  },
  servers: [
    {
      url: "https://api.cornerstone-schools.org/v2",
      description: "Production server",
    },
    {
      url: "http://localhost:8080/api/v2",
      description: "Development server",
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtained from Google OAuth authentication",
      },
    },
    schemas: {} as Record<string, any>,
  },
  tags: [] as Array<{ name: string; description: string }>,
  paths: {} as Record<string, any>,
};

// Resource definitions with descriptions
const resources: Record<string, { description: string; tag: string }> = {
  students: { description: "Student management", tag: "Students" },
  users: { description: "Employee/user management", tag: "Users" },
  devices: { description: "Device checkout and tracking", tag: "Devices" },
  textbooks: { description: "Textbook management", tag: "Textbooks" },
  rooms: { description: "Room management", tag: "Rooms" },
  timesheets: { description: "Timesheet tracking", tag: "Timesheets" },
  departments: { description: "Department management", tag: "Departments" },
  "org-units": { description: "Organizational units", tag: "Org Units" },
  short: { description: "URL shortener", tag: "Short URLs" },
  aftercare: { description: "Aftercare session management", tag: "Aftercare" },
  groups: { description: "User groups", tag: "Groups" },
  tickets: { description: "Support ticket management", tag: "Tickets" },
  reimbursements: { description: "Reimbursement requests", tag: "Reimbursements" },
  leaves: { description: "Leave requests", tag: "Leaves" },
  "school-year": { description: "School year management", tag: "School Year" },
};

// Map TypeScript types to OpenAPI schemas
function tsTypeToSchema(typeName: string): any {
  const typeMap: Record<string, any> = {
    string: { type: "string" },
    number: { type: "number" },
    boolean: { type: "boolean" },
    Date: { type: "string", format: "date-time" },
    any: { type: "object" },
  };
  return typeMap[typeName] || { type: "string" };
}

// Parse interface properties to OpenAPI schema
function parseInterfaceToSchema(sourceFile: SourceFile, interfaceName: string): any {
  const interfaceDecl = sourceFile.getInterface(interfaceName);
  if (!interfaceDecl) return null;

  const properties: Record<string, any> = {};
  const required: string[] = [];

  interfaceDecl.getProperties().forEach((prop) => {
    const name = prop.getName();
    const typeNode = prop.getTypeNode();
    const isOptional = prop.hasQuestionToken();
    const jsDoc = prop.getJsDocs()[0];
    const description = jsDoc?.getDescription()?.trim();

    let schema: any = { type: "string" };

    if (typeNode) {
      const typeText = typeNode.getText();

      // Handle union types (e.g., "Active" | "Inactive")
      if (typeText.includes("|") && typeText.includes('"')) {
        const enumValues = typeText
          .split("|")
          .map((v) => v.trim().replace(/"/g, ""))
          .filter((v) => v);
        schema = { type: "string", enum: enumValues };
      }
      // Handle arrays
      else if (typeText.endsWith("[]")) {
        const itemType = typeText.slice(0, -2);
        schema = { type: "array", items: tsTypeToSchema(itemType) };
      }
      // Handle basic types
      else {
        schema = tsTypeToSchema(typeText);
      }
    }

    if (description) {
      schema.description = description;
    }

    properties[name] = schema;

    if (!isOptional) {
      required.push(name);
    }
  });

  return {
    type: "object",
    properties,
    ...(required.length > 0 && { required }),
  };
}

// Parse route files to extract endpoint information
function parseRouteFile(filePath: string, project: Project): ResourceRoutes | null {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const routes: RouteInfo[] = [];

  // Find router method calls
  sourceFile.forEachDescendant((node) => {
    if (Node.isCallExpression(node)) {
      const expression = node.getExpression();
      const expressionText = expression.getText();

      // Match router.get, router.post, etc.
      const methodMatch = expressionText.match(/(\w+Router)\.(get|post|put|patch|delete|route)/);

      if (methodMatch) {
        const args = node.getArguments();
        if (args.length >= 1) {
          const pathArg = args[0];
          const routePath = pathArg.getText().replace(/['"]/g, "");

          // Handle .route().get().post() chaining
          if (methodMatch[2] === "route") {
            // Get the chained methods
            let parent = node.getParent();
            while (parent && Node.isPropertyAccessExpression(parent.getParent())) {
              const grandparent = parent.getParent();
              if (grandparent && Node.isCallExpression(grandparent.getParent())) {
                const chainedCall = grandparent.getParent() as any;
                const chainedMethod = grandparent.getName?.();
                if (
                  chainedMethod &&
                  ["get", "post", "put", "patch", "delete"].includes(chainedMethod)
                ) {
                  const handlers = chainedCall.getArguments?.() || [];
                  routes.push({
                    method: chainedMethod.toUpperCase(),
                    path: routePath,
                    handler: handlers.map((h: any) => h.getText()).join(", "),
                    middleware: [],
                  });
                }
                parent = chainedCall;
              } else {
                break;
              }
            }
          } else {
            const method = methodMatch[2].toUpperCase();
            const handlerArgs = args.slice(1);
            const handlers = handlerArgs.map((a) => a.getText());

            routes.push({
              method,
              path: routePath,
              handler: handlers[handlers.length - 1] || "",
              middleware: handlers.slice(0, -1),
            });
          }
        }
      }
    }
  });

  // Extract base path from filename
  const fileName = path.basename(filePath, ".ts");
  const basePath = fileName.replace("Routes", "").toLowerCase();

  return routes.length > 0 ? { basePath, routes } : null;
}

// Convert route info to OpenAPI path item
function routeToPathItem(
  route: RouteInfo,
  basePath: string,
  tag: string
): { path: string; pathItem: any } {
  const fullPath = `/${basePath}${route.path === "/" ? "" : route.path}`;

  // Convert Express params to OpenAPI params
  const openApiPath = fullPath.replace(/:(\w+)/g, "{$1}");

  // Extract path parameters
  const pathParams = [...fullPath.matchAll(/:(\w+)/g)].map((match) => ({
    name: match[1],
    in: "path",
    required: true,
    schema: { type: "string" },
  }));

  // Determine operation details based on method and handler
  const method = route.method.toLowerCase();
  const handlerName = route.handler.split(".").pop() || "";

  let summary = "";
  let description = "";

  // Generate summary from handler name
  if (handlerName.startsWith("getAll")) {
    summary = `List all ${tag.toLowerCase()}`;
  } else if (handlerName.startsWith("getOne") || handlerName === "getOneDevice") {
    summary = `Get a ${tag.toLowerCase().replace(/s$/, "")}`;
  } else if (handlerName.startsWith("create")) {
    summary = `Create a ${tag.toLowerCase().replace(/s$/, "")}`;
  } else if (handlerName.startsWith("update")) {
    summary = `Update a ${tag.toLowerCase().replace(/s$/, "")}`;
  } else if (handlerName.startsWith("delete")) {
    summary = `Delete a ${tag.toLowerCase().replace(/s$/, "")}`;
  } else {
    // Convert camelCase to title case
    summary = handlerName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  // Check for role restrictions in middleware
  const restrictMatch = route.middleware.find((m) => m.includes("restrictTo"));
  const requiredRoles = restrictMatch
    ? restrictMatch.match(/"([^"]+)"/g)?.map((r) => r.replace(/"/g, ""))
    : null;

  if (requiredRoles) {
    description = `Requires role: ${requiredRoles.join(" or ")}`;
  }

  const operation: any = {
    tags: [tag],
    summary,
    description: description || undefined,
    parameters: pathParams.length > 0 ? pathParams : undefined,
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "success" },
                data: { type: "object" },
              },
            },
          },
        },
      },
      401: { description: "Unauthorized" },
      403: { description: "Forbidden" },
      404: { description: "Not found" },
    },
  };

  // Add request body for POST/PUT/PATCH
  if (["post", "put", "patch"].includes(method)) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object" },
        },
      },
    };
  }

  return {
    path: openApiPath,
    pathItem: { [method]: operation },
  };
}

// Main generation function
async function generateOpenApiSpec() {
  console.log("Generating OpenAPI specification...");

  const project = new Project({
    skipAddingFilesFromTsConfig: true,
  });

  // Add tags
  baseSpec.tags = Object.values(resources).map((r) => ({
    name: r.tag,
    description: r.description,
  }));

  // Parse type definitions for schemas
  const typesDir = path.join(SERVER_PATH, "types/models");
  if (fs.existsSync(typesDir)) {
    const typeFiles = fs.readdirSync(typesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

    for (const file of typeFiles) {
      const sourceFile = project.addSourceFileAtPath(path.join(typesDir, file));
      const interfaces = sourceFile.getInterfaces();

      for (const iface of interfaces) {
        const name = iface.getName();
        if (name.endsWith("Model") && !name.endsWith("Document")) {
          const schemaName = name.replace("Model", "");
          const schema = parseInterfaceToSchema(sourceFile, name);
          if (schema) {
            baseSpec.components.schemas[schemaName] = schema;
          }
        }
      }
    }
  }

  // Parse route files
  const routesDir = path.join(SERVER_PATH, "routes/v2");
  if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir).filter((f) => f.endsWith("Routes.ts"));

    for (const file of routeFiles) {
      const filePath = path.join(routesDir, file);
      const resourceRoutes = parseRouteFile(filePath, project);

      if (resourceRoutes) {
        const resourceKey = resourceRoutes.basePath;
        const resourceDef = resources[resourceKey] || {
          description: `${resourceKey} operations`,
          tag: resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1),
        };

        // Add tag if not already present
        if (!baseSpec.tags.find((t) => t.name === resourceDef.tag)) {
          baseSpec.tags.push({
            name: resourceDef.tag,
            description: resourceDef.description,
          });
        }

        // Process routes
        for (const route of resourceRoutes.routes) {
          const { path: apiPath, pathItem } = routeToPathItem(route, resourceKey, resourceDef.tag);

          if (!baseSpec.paths[apiPath]) {
            baseSpec.paths[apiPath] = {};
          }
          Object.assign(baseSpec.paths[apiPath], pathItem);
        }
      }
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the spec
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(baseSpec, null, 2));
  console.log(`OpenAPI spec generated: ${OUTPUT_PATH}`);
  console.log(`  - ${Object.keys(baseSpec.paths).length} endpoints`);
  console.log(`  - ${Object.keys(baseSpec.components.schemas).length} schemas`);
  console.log(`  - ${baseSpec.tags.length} tags`);
}

generateOpenApiSpec().catch(console.error);
