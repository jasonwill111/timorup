# Plan: API Endpoint Review & Best Practice Optimization

## Design

### Architecture Overview

The TimorBiz API has two layers:
1. **Astro API Routes** (`src/pages/api/`) - SSR endpoints for form submissions
2. **Hono Routes** (`src/server/routes/`) - Structured REST API for client consumption

### Key Design Decisions

| Decision | Rationale |
|----------|----------|
| Unified error format | `{ error: { code: "ERROR_CODE", message: "..." } }` |
| Zod v4 error format | Single `error` string for validation errors |
| Session auth via better-auth | `auth.api.getSession()` Astro, `getCurrentUser()` Hono |
| Remove auth stub | `pages/api/auth/sign-in.ts` doesn't verify passwords |

### API Layer Responsibilities

| Layer | Use Case | Auth Pattern |
|-------|---------|--------------|
| Astro API Routes | Form submissions, server actions | `auth.api.getSession()` with cookie header |
| Hono Routes | Client API calls | `getCurrentUser()` with session cookie |

### Error Response Standard

```typescript
// Success
{ success: true, data: T }

// With pagination
{ success: true, data: T[], meta: { total, page, pageSize } }

// Validation error (400)
{ error: "Field 'email' must be valid email" }

// Business error (4xx)
{ error: { code: "ERROR_CODE", message: "Human readable" } }

// Server error (500)
{ error: { code: "INTERNAL_ERROR", message: "..." } }
```

## Rationale

### Why Two API Layers?

Astro API Routes handle form submissions with seamless better-auth integration.
Hono Routes provide clean REST structure with middleware (CORS, rate limiting).

### Fix Priority

1. **Critical**: Auth stub (security) - `pages/api/auth/sign-in.ts`
2. **High**: Error format consistency - all endpoints
3. **High**: Remove duplicate endpoints
4. **Medium**: Zod validation - new/modified endpoints
5. **Low**: Performance optimization - N+1 queries

## Technology Stack

- **Framework**: Astro 6.0.8 + Hono 4.12.5
- **Auth**: better-auth 1.5.3
- **Validation**: Zod 4.3.6
- **Database**: Drizzle 0.45.1 + SQLite
- **Testing**: Vitest + Playwright
