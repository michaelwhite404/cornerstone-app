# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cornerstone App is a full-stack school management platform for Cornerstone Schools of Washington. It handles device checkout/checkin, textbook tracking, leave requests, maintenance tickets, reimbursements, aftercare sessions, timesheets, and more.

## Tech Stack

- **Backend:** Node.js (v14), TypeScript, Express, MongoDB/Mongoose, Socket.IO
- **Frontend:** React 17 (CRA with craco), TypeScript, Tailwind CSS, TanStack Query v4, Headless UI
- **Auth:** Passport.js with Google OAuth 2.0 + JWT
- **Deployment:** Heroku, AWS S3 for file storage
- **Package Manager:** pnpm workspaces

## Monorepo Structure

```
cornerstone-app/
├── pnpm-workspace.yaml
├── package.json          (workspace root)
├── Procfile
├── packages/
│   ├── server/           (@cornerstone/server)
│   │   ├── src/          (app.ts, server.ts, controllers/, models/, routes/, etc.)
│   │   ├── views/email/  (pug email templates)
│   │   ├── public/images/
│   │   ├── config.env
│   │   ├── tsconfig.json
│   │   └── dist/         (build output)
│   └── client/           (@cornerstone/client)
│       ├── src/
│       │   └── types/models/  (local copies of shared types, mongoose-free)
│       ├── public/
│       └── tsconfig.json
```

## Common Commands

```bash
# Install all workspace dependencies
pnpm install

# Development - run server + client concurrently
pnpm dev

# Build server TypeScript (compiles to packages/server/dist/)
pnpm build

# Build client (CRA build)
pnpm build:client

# Build both client and server
pnpm build:all

# Production start
pnpm start

# Deploy to Heroku
pnpm run deploy

# Run commands in specific packages
pnpm --filter @cornerstone/server <command>
pnpm --filter @cornerstone/client <command>

# Client tests
pnpm --filter @cornerstone/client test
```

## Architecture

### Backend (packages/server/src/)

Layered MVC architecture with versioned APIs:

- **`app.ts`** — Express app setup, middleware stack, route mounting
- **`server.ts`** — HTTP server, Socket.IO setup, MongoDB connection, cron jobs
- **`routes/apiRoutes.ts`** — Main API router: mounts v1 (legacy) and v2 (current) under `/api`
- **`routes/v2/index.ts`** — Aggregates all v2 resource routers
- **`controllers/v2/`** — Route handlers per resource
- **`models/`** — 26 Mongoose models (Employee, Student, Device, Ticket, Leave, etc.)
- **`events/`** — Domain event handlers (Aftercare, Leave, Reimbursement, Ticket, Device, Textbooks)
- **`graphql/`** — GraphQL schema, resolvers, and typedefs (GraphiQL enabled in dev)
- **`utils/`** — Shared utilities (apiFeatures, appError, catchAsync, email, s3, etc.)
- **`types/`** — TypeScript type definitions for models and custom request/query types

### Frontend (packages/client/)

React SPA built with Create React App (using craco for webpack overrides). Proxies API requests to `localhost:8080` in development.

Shared types from the server are duplicated at `packages/client/src/types/models/` with mongoose-specific code stripped out.

#### Data Fetching (TanStack Query)

API hooks live in `src/api/` with a consistent pattern:
- **Query keys** for cache management (e.g., `studentKeys.all`, `deviceKeys.list(type)`)
- **`useQuery`** for data fetching with automatic caching/refetching
- **`useMutation`** for create/update/delete operations with cache invalidation
- **`apiClient`** in `src/api/client.ts` is the axios instance for v2 API calls

Example usage:
```typescript
import { useStudents, useCreateStudent } from "../api";

const { data: students, isLoading } = useStudents();
const createMutation = useCreateStudent();
```

#### UI Components

Custom Tailwind-based components in `src/components/ui/` (Button, Input, Select, etc.). Uses Headless UI for accessible primitives (Dialog, Menu, Combobox) and Heroicons v1 for icons.

### API Structure

- Routes mount at `/api/v2/` (v2 is also the default at `/api/`)
- Legacy v1 routes at `/api/v1/`
- Auth routes at `/auth/`
- PDF/CSV export routes at `/pdf/` and `/csv/`
- GraphQL at `/graphql`
- S3 image streaming at `/images/:key`

### Key Patterns

- **`catchAsync`** wraps async route handlers to forward errors to the global error handler
- **`AppError`** class for operational errors with status codes
- **`apiFeatures`** utility handles query filtering (gte/gt/lte/lt operators), sorting, field selection, and pagination
- **`res.sendJson(statusCode, data)`** is a custom response helper added via middleware in `app.ts`
- **Centralized error handling** in `controllers/errorController.ts` with dev/prod error formatting

### Path Aliases (packages/server/tsconfig.json)

- `@*` → `src/*` (e.g., `@utils`, `@models`, `@controllers/errorController`)
- `@@types*` → `src/types/*`

Aliases are resolved at build time by `tsc-alias`.

## Environment

Config lives in `packages/server/config.env`. Key variables: `DATABASE`, `DATABASE_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`, Google OAuth credentials, AWS S3 config, SendGrid/Mailtrap email config, Google Chat webhook.

## Employee Roles

Super Admin, Admin, Development, Instructor, Intern, Maintenance — used for authorization throughout the API.
