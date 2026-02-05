# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cornerstone App is a full-stack school management platform for Cornerstone Schools of Washington. It handles device checkout/checkin, textbook tracking, leave requests, maintenance tickets, reimbursements, aftercare sessions, timesheets, and more.

## Tech Stack

- **Backend:** Node.js (v14), TypeScript, Express, MongoDB/Mongoose, Socket.IO
- **Frontend:** React 17 (CRA), TypeScript, Tailwind CSS, SCSS, BlueprintJS, Material-UI
- **Auth:** Passport.js with Google OAuth 2.0 + JWT
- **Deployment:** Heroku, AWS S3 for file storage

## Common Commands

```bash
# Build TypeScript (compiles to /dist, resolves path aliases, copies GraphQL typedefs)
npm run build

# Development - run server + client concurrently
npm run dev

# Watch TypeScript compilation with alias resolution
npm run watch

# Run server only (nodemon, port 8080)
npm run server

# Run client only (CRA dev server, port 3000, proxies to :8080)
npm run client

# Production start
npm start

# Deploy to Heroku
npm run deploy

# Client tests (from /client)
cd client && npm test
```

## Architecture

### Backend (src/)

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

### Frontend (client/)

React SPA in `/client`, built with Create React App. Proxies API requests to `localhost:8080` in development.

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
- **Rate limiting**: 300 req/min per IP on API routes

### Path Aliases (tsconfig.json)

- `@*` → `src/*` (e.g., `@utils`, `@models`, `@controllers/errorController`)
- `@@types*` → `src/types/*`

Aliases are resolved at build time by `tsc-alias`.

## Environment

Config lives in `config.env` at the project root. Key variables: `DATABASE`, `DATABASE_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`, Google OAuth credentials, AWS S3 config, SendGrid/Mailtrap email config, Google Chat webhook.

## Employee Roles

Super Admin, Admin, Development, Instructor, Intern, Maintenance — used for authorization throughout the API.
