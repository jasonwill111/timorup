# Implementation Plan: SEO Sitemap & Breadcrumb

## Overview

Create `/sitemap.xml` endpoint that queries D1 database for all public entities and generates valid XML sitemap. Add BreadcrumbList JSON-LD to all detail pages (business, non-profit, public-sector, product, blog).

## Architecture

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Sitemap Endpoint** | Generate XML sitemap from DB | `src/pages/sitemap.xml.ts` |
| **Breadcrumb Helper** | Reusable breadcrumb schema builder | `src/lib/seo.ts` |
| **Detail Pages** | Add breadcrumb JSON-LD | Each detail page |

### Data Flow

```
/sitemap.xml
    │
    ├── Query businesses (status='active')
    ├── Query non_profits
    ├── Query public_sectors
    ├── Query listings (status='active', expiresAt > now)
    └── Generate XML → Response
```

### Sitemap Page (src/pages/sitemap.xml.ts)

```typescript
// SSR endpoint - prerender=false
// Query all public entities from D1
// Generate XML with:
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{url}</loc>
    <lastmod>{updatedAt}</lastmod>
    <changefreq>{daily|weekly|monthly}</changefreq>
    <priority>{1.0|0.8|0.6}</priority>
  </url>
</urlset>
```

### Breadcrumb Helper (src/lib/seo.ts)

```typescript
export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url  // omit for last item
    }))
  };
}
```

## Technology Stack

- **Framework**: Astro 6.3 (SSR for sitemap, prerender for detail pages)
- **Database**: D1 via getDb() query
- **Output**: XML (sitemap), JSON-LD (breadcrumb)

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **SSR for sitemap** | Dynamic content, needs latest data from D1 |
| **JSON-LD via Astro script** | `set:html={JSON.stringify(schema)}` pattern already in use |
| **Helper function for breadcrumb** | DRY - single source of truth for breadcrumb structure |

## Implementation Phases

### Phase 1: Sitemap Generator
1. Create `src/pages/sitemap.xml.ts` (SSR)
2. Query businesses, non_profits, public_sectors from D1
3. Generate valid XML with proper headers
4. Add static pages (homepage, about, contact, pricing, faq, blog)

### Phase 2: Breadcrumb Helper
1. Create `src/lib/seo.ts` with `createBreadcrumbSchema()` function
2. Export types for BreadcrumbItem

### Phase 3: Detail Pages
1. Update `src/pages/business/[slug].astro` - add breadcrumb JSON-LD
2. Update `src/pages/non-profit/[slug].astro`
3. Update `src/pages/public-sector/[slug].astro`
4. Update `src/pages/business/[slug]/product/[id]/index.astro`
5. Update `src/pages/blog/[slug].astro`

### Phase 4: Testing
1. E2E test: Verify `/sitemap.xml` returns valid XML
2. E2E test: Verify detail pages contain BreadcrumbList JSON-LD

## Testing Strategy

| Test | Type | Scope |
|------|------|-------|
| Sitemap XML valid | Unit | sitemap.xml.ts |
| Sitemap includes all entities | E2E | comprehensive.spec.ts |
| Breadcrumb on business page | E2E | comprehensive.spec.ts |
| Breadcrumb on non-profit page | E2E | comprehensive.spec.ts |

## Technical Challenges

### Challenge 1: Large sitemap generation
**Solution**: Stream response, batch queries
**Risk**: Timeout for large datasets → limit to 50,000 URLs (sitemap protocol max)

### Challenge 2: Real-time lastmod
**Solution**: Use `updatedAt` from database
**Risk**: Missing → fallback to current date

### Challenge 3: Product pages not in DB table
**Solution**: Query from products table via business slug join
**Risk**: None - standard join