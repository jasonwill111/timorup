# TimorLink - Business Directory Platform

Timor-Leste's business directory platform built with Astro + Cloudflare Workers.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 6.2.1 |
| Database | Drizzle ORM + D1 |
| Auth | better-auth 1.6.9 |
| AI | Mastra 1.29.1 + Workers AI |
| Validation | Zod 4.4.1 |
| Styling | TailwindCSS 4.2.4 |
| Deploy | Cloudflare Workers |

## Features

- **Business Listings**: Commercial businesses, government agencies, NGOs
- **Server Islands**: Optimized rendering with dynamic content islands
- **AI Tools**: Listing creator, SKU creator, blog generator, landing page creator
- **Admin Dashboard**: Full CRUD for all entities
- **Media Management**: R2 storage with video compression
- **Type Safety**: Strict TypeScript with proper types throughout

## Commands

```bash
pnpm dev          # Start dev server (wrangler dev --local)
pnpm build        # Build for production
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests
pnpm db:push       # Push schema to D1
pnpm db:seed       # Seed database
```

## Project Structure

```
src/
├── actions/          # Astro Server Actions
├── components/        # UI components
├── db/                # Drizzle schema + migrations
├── layouts/           # Layout components
├── lib/               # Utilities (auth, AI, media, etc.)
├── mastra/            # AI agents
├── pages/             # Astro pages + API routes
└── types/             # TypeScript type definitions
```

## Documentation

- [SpecWeave Increments](.specweave/docs/internal/specs/TimorLink/)
- [Feature Catalog](.specweave/docs/internal/specs/TimorLink/)

## License

MIT

