# Project Overview

## TimorUp

A business directory platform for Timor-Leste, supporting Business, Government, Non-Profit organizations, and Classified Listings.

## Quick Start

```bash
# Install dependencies
pnpm install

# Local development
pnpm build
npx wrangler dev --local --port 8787

# Production build
pnpm build
git push  # CI/CD handles deployment
```

## Architecture

```
Cloudflare Workers (Edge)
├── Astro SSR Pages
│   ├── Public pages (cached)
│   ├── Admin dashboard
│   └── Server Actions
├── D1 Database
│   ├── Auth tables (better-auth)
│   └── Business tables (Drizzle)
├── KV Storage
│   └── Session cache
└── R2 Storage
    └── Media files
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 6.4.2 (Server Islands) |
| Runtime | Cloudflare Workers |
| Database | D1 (SQLite at edge) |
| Auth | light-auth (Free) / better-auth (Paid) |
| ORM | Drizzle 0.45.2 |
| Styling | TailwindCSS v4 |
| Editor | TipTap 3.x |
| Icons | Lucide |

## Key Features

- **Multi-entity support**: Business, Government, Non-Profit, Listings
- **Subscription system**: Free tier + paid plans with SKU limits
- **AI content generation**: MiniMax-powered listing/blog creation
- **Admin dashboard**: Full CRUD for all entities
- **Server Islands**: Minimal server costs

## Deployment

| Environment | URL |
|------------|-----|
| Production | https://timorup.jasonwill.workers.dev |
| Database | TimorUp-db (D1) |
| Storage | TimorUp-media (R2) |

---
*Updated 2026-05-30*
