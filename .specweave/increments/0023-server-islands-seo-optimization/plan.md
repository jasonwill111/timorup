# Implementation Plan: Server Islands + SEO Optimization

## Overview

Use Astro Server Islands to separate static/business content from dynamic product listings, enabling independent caching.

## Architecture

### Components
- `ProductsSection.astro`: Server Island with 2min refresh for product list
- `BusinessSidebar.astro`: Reusable sidebar (map, tags, hours)
- `business/[slug].astro`: Main page using SSR + Server Islands

### Data Flow
```
Request → Cloudflare CDN (check cache)
  ├── HIT → Return cached HTML
  └── MISS → Render page
              ├── Static parts → Cached 5min
              └── Server Islands → Fetch fresh data → Cached 2min
```

## CDN Cache Strategy

| Path | Cache-Control | Reason |
|------|--------------|--------|
| `/` | 5min + 1h stale | Matches server island refresh |
| `/business/:slug` | 5min + 1h stale | Business data relatively stable |
| `/listing` | 2min + 10min stale | Search results more dynamic |
| `/faq`, `/pricing` | 1h + 1h stale | Static content |

## Testing Strategy

- Unit: Component rendering
- Integration: API endpoints
- E2E: Critical user flows
- Build: `pnpm build` must pass

## Technical Challenges

### Challenge 1: Server Island hydration
**Solution**: Use `server:defer="2min"` directive
**Risk**: Low — Astro 6 native feature