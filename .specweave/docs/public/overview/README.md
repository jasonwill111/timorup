# Project Overview

## TimorLink

A business listing platform for East Timor, supporting Business, Government, and Non-Profit organizations.

## Quick Start

```bash
# Install dependencies
pnpm install

# Local development (requires wrangler for D1/R2)
pnpm build
npx wrangler dev --config wrangler.jsonc --local dist/server/entry.mjs

# Production build
pnpm build
git push  # CI/CD handles deployment
```

## Architecture

```
┌─────────────────────────────────────────────────────�?�?                 Cloudflare Workers                  �?�? ┌─────────────�? ┌─────────────�? ┌─────────────�? �?�? �?  Admin    �? �?  Auth     �? �?  Business  �? �?�? �?  Panel    �? �?  API      �? �?  Pages     �? �?�? └─────────────�? └─────────────�? └─────────────�? �?└─────────────────────────────────────────────────────�?           �?               �?               �?      ┌────┴────�?     ┌────┴────�?     ┌────┴────�?      �?  D1    �?     �?  KV    �?     �?  R2    �?      �?(SQLite)�?     �?Session)�?     �?Media)  �?      └─────────�?     └─────────�?     └─────────�?```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 6.2.1 (Server Islands) |
| Runtime | Cloudflare Workers |
| Database | D1 (SQLite at edge) |
| Auth | better-auth 1.6.9 |
| ORM | Drizzle 0.45.2 |
| Styling | TailwindCSS v4 |
| Editor | TipTap 3.x |

## Key Features

- Multi-entity support (Business/Gov/NGO)
- Industry-specific SKU specifications
- Admin panel with full CRUD
- OAuth authentication (Google, Facebook)
- R2 media storage with Cloudflare Images
- Server Islands for minimal server costs
- Weekly auto-cleanup for expired data

## Deployment

- **Production URL**: https://TimorLink.jasonwill.workers.dev
- **Database**: TimorLink-db (D1)
- **Storage**: TimorLink-media (R2)

---
*Generated 2026-04-30*
