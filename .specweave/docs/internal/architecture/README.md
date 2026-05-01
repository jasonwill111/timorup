# Architecture Documentation

## System Overview

TimorList is a multi-tenant business listing platform built on Cloudflare Workers with edge-native databases.

## High-Level Architecture

```
                    ┌─────────────────────────────┐
                    │     Cloudflare Workers     │
                    │                             │
                    │  ┌────────────────────────┐ │
                    │  │      Astro SSR         │ │
                    │  │  (Pages + API Routes) │ │
                    │  └────────────────────────┘ │
                    │                             │
                    │  ┌────────────────────────┐ │
                    │  │     better-auth        │ │
                    │  │   (Session + OAuth)    │ │
                    │  └────────────────────────┘ │
                    └─────────────────────────────┘
                              │    │    │
                    ┌─────────┴┐  ┌┴────────┐
                    │    D1    │  │   KV    │
                    │  (SQLite)│  │(Session)│
                    └──────────┘  └─────────┘
                              │
                         ┌────┴────┐
                         │   R2    │
                         │ (Media) │
                         └─────────┘
```

## Key Design Decisions

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-0001 | Cloudflare Workers runtime | ✅ Implemented |
| ADR-0010 | Server Islands (hybrid mode) | ✅ Implemented |
| ADR-0011 | Industry-specific product specs | ✅ Implemented |

## Module Structure

```
src/
├── pages/          # Astro pages + API routes
├── components/    # Reusable UI components
├── db/           # Drizzle schema
├── lib/          # Utilities (auth, media, constants)
└── server/       # Hono route handlers
```

## Data Flow

1. **Request** → Cloudflare Workers
2. **Auth** → better-auth validates session
3. **Route** → Astro page or API handler
4. **DB** → Drizzle ORM → D1
5. **Response** → JSON or HTML

## External Services

| Service | Binding | Purpose |
|---------|---------|---------|
| D1 | `DB` | Primary database |
| KV | `SESSION` | Session storage |
| R2 | `MEDIA_BUCKET` | Media uploads |
| Images | `IMAGES` | Cloudflare Image resizing |

## Environment Configuration

| Env Var | Description |
|---------|-------------|
| BETTER_AUTH_SECRET | Session signing key |
| GOOGLE_CLIENT_ID/SECRET | OAuth |
| FACEBOOK_CLIENT_ID/SECRET | OAuth |
| APP_URL | Canonical URL |

---
*Updated 2026-04-30*