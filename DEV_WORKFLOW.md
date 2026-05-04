# Development Workflow

> Local development with D1/R2 for Astro 6 + Cloudflare Workers + better-auth

## Quick Start

```bash
# 1. Build
pnpm build

# 2. Start dev server (NO --local flag!)
wrangler dev --port XXXX
```

**⚠️ IMPORTANT**: `--local` uses local D1 simulator (empty data). Omit it to use remote D1.

## Port Conflicts

Port in use? Use a different port, **don't kill other projects**.

```bash
# Check port
lsof -i :8787

# Find available port
for port in 8787 8788 8789 8790; do
  if ! lsof -i :$port 2>/dev/null | grep -q LISTEN; then
    wrangler dev --port $port
    break
  fi
done
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  wrangler dev --port XXXX (remote D1)                  │
│  ├── Uses remote D1 (has all data) ✅                  │
│  ├── Uses remote R2                                    │
│  └── Same as production                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  wrangler dev --local (local D1 simulator)             │
│  ├── Empty local D1 (no seed data) ❌                 │
│  └── Only for testing without network                  │
└─────────────────────────────────────────────────────────┘
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build Astro for Cloudflare Workers |
| `wrangler dev --port XXXX` | Start dev server (uses remote D1/R2) |
| `wrangler d1 execute timorlist-db --remote --file=seed.sql` | Push seed data |

## Testing Accounts

| Email | Password | Role |
|-------|----------|------|
| user@timorlist.com | user12345 | user |
| admin@timorlist.com | admin12345 | admin |

**Password requirement**: Minimum 8 characters (better-auth config)

## Troubleshooting

### API returns empty data
```bash
# Check if data exists in remote D1
wrangler d1 execute timorlist-db --remote --command "SELECT COUNT(*) FROM business_pages" --json

# If empty, seed data
wrangler d1 execute timorlist-db --remote --file=src/db/seed.sql --yes
```

### Auth fails with "Invalid credentials"
Check password is 8+ characters.

### Build fails
```bash
# Clean build
rm -rf dist .wrangler/deploy
pnpm build
```

## Production Deployment

```bash
git push  # CI/CD handles deployment
```

---

*Updated 2026-05-04: Use `wrangler dev` without --local flag*
