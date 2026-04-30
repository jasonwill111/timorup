# server

**Path**: `src/server`

## Purpose

Cloudflare Workers entry points and routing configuration.

## Overview

The server module contains 15 files with approximately 3,000 lines of code.

## Entry Points

| File | Purpose |
|------|---------|
| `entry.mjs` | Main worker entry |
| `admin.ts` | Admin panel routes |
| `auth.ts` | Auth API routes |
| `account.ts` | Account management |

## Architecture

```
Cloudflare Workers
├── entry.mjs (main router)
├── Hono apps (route handlers)
└── bindings (DB, KV, R2)
```

## Patterns Used

- Hono framework for routing
- Service bindings for D1/KV/R2
- Middleware for auth

## Analysis Summary

- **Source Files**: 15
- **Test Files**: 0
- **Total Exports**: 10+

## Dependencies

- `hono` (HTTP framework)
- `drizzle-orm/d1` (DB)
- `@cloudflare/workerd` (runtime)

---
*Updated 2026-04-30*