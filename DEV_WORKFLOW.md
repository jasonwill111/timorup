# Development Workflow

> Local development with D1/R2 for Astro 6 + Cloudflare Workers + better-auth

## Quick Start

```bash
# 1. Setup local D1 (from remote schema)
pnpm db:setup-local

# 2. Start development
pnpm dev          # Node adapter, port 3000
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Local dev (Node adapter + local SQLite) |
| `pnpm dev:cf` | Cloudflare adapter (requires wrangler) |
| `pnpm dev:wrangler` | Wrangler dev (uses workerd, has better-auth issues) |
| `pnpm build` | Build for Node (static + SSR) |
| `pnpm build:cf` | Build for Cloudflare Workers |
| `pnpm db:setup-local` | Export remote D1 schema to local SQLite |
| `pnpm db:push` | Push schema to D1 |

## Local Development Architecture

```
┌─────────────────────────────────────────────────┐
│  pnpm dev (Node adapter)                        │
│  ├── @libsql/client → local SQLite             │
│  │   └── .wrangler/state/v3/d1/timorlist-db.actual.sqlite
│  └── better-auth → libsql adapter              │
│      └── Auth works! ✅                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  wrangler dev --local (workerd)                 │
│  ├── D1 simulation (workerd)                   │
│  └── better-auth → workerd D1                  │
│      └── Auth FAILS ❌ (RETURNING incompatibility)
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  wrangler dev --remote                          │
│  ├── Remote D1 (production)                    │
│  └── API timeout issues (Cloudflare network)   │
└─────────────────────────────────────────────────┘
```

## Why `pnpm dev` instead of `wrangler dev`?

1. **better-auth compatibility**: workerd D1 doesn't support some SQLite operations that better-auth uses
2. **No network dependency**: Local SQLite doesn't require Cloudflare API
3. **Faster iteration**: No WebSocket connection needed

## Troubleshooting

### Auth fails with "Failed to create user"

1. Run `pnpm db:setup-local` to sync schema
2. Check `.wrangler/state/v3/d1/timorlist-db.actual.sqlite` exists
3. Verify tables: `sqlite3 .wrangler/state/v3/d1/timorlist-db.actual.sqlite ".tables"`

### Build fails with "cloudflare:workers not found"

This is expected for local build. The cloudflare:workers shim handles this in `astro.config.mjs`.

### D1 connection errors

```bash
# Re-sync local D1
pnpm db:setup-local

# Or manually
npx wrangler d1 execute timorlist-db --remote --command "SELECT sql FROM sqlite_master WHERE type='table'" --json
```

## Testing Auth

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456","name":"Test"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}'
```

## Production Deployment

Production uses Cloudflare Workers with real D1/R2:
- Auth: ✅ Works (real D1)
- Build: `USE_CLOUDFLARE=1 pnpm build` or CI
- Deploy: `git push` → CI/CD