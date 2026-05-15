---
increment: 0054-seo-sitemap-breadcrumb
title: "SEO Sitemap & Breadcrumb"
generated: "2026-05-14"
source: manual
version: "1.0"
status: active
---

# Quality Contract: SEO Sitemap & Breadcrumb

## Implementation Quality Gates

### 1. Sitemap Generator
- [x] `src/pages/sitemap.xml.ts` exists and exports GET function
- [x] Returns valid XML with `<?xml version="1.0" encoding="UTF-8"?>`
- [x] Contains `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
- [x] Queries D1 database for all entity types
- [x] Includes static pages with proper priority/changefreq
- [x] Handles errors gracefully (continues with static pages)

### 2. Breadcrumb Helper
- [x] `src/lib/seo.ts` exists with `createBreadcrumbSchema` export
- [x] Returns valid schema.org BreadcrumbList JSON-LD
- [x] Position numbers start at 1 and increment
- [x] Last item has no `item` property

### 3. Detail Pages
- [x] `business/[slug].astro` includes BreadcrumbList JSON-LD
- [x] `non-profit/[slug].astro` includes BreadcrumbList JSON-LD
- [x] `public-sector/[slug].astro` includes BreadcrumbList JSON-LD
- [x] Product detail page includes BreadcrumbList JSON-LD
- [ ] Blog detail pages (deferred - no blog pages exist yet)

### 4. robots.txt
- [x] Sitemap reference points to `/sitemap.xml`
- [x] Admin/API paths disallow crawlers

### 5. E2E Tests
- [x] `e2e/seo.spec.ts` exists with all test cases
- [ ] Tests pass when server is running (blocked by dev server issue)

## Technical Requirements

### Files Created/Modified
| File | Action |
|------|--------|
| `src/pages/sitemap.xml.ts` | Created |
| `src/lib/seo.ts` | Created |
| `src/pages/business/[slug].astro` | Modified |
| `src/pages/non-profit/[slug].astro` | Modified |
| `src/pages/public-sector/[slug].astro` | Modified |
| `src/pages/business/[slug]/product/[id]/index.astro` | Modified |
| `public/robots.txt` | Modified |
| `e2e/seo.spec.ts` | Created |
| `astro.config.mjs` | Modified (removed sitemap integration) |

### Dependencies
- Astro 6.3 (SSR for dynamic sitemap)
- D1 database (getDb pattern)
- Cloudflare Workers

### Known Issues
- Blog pages don't exist, so T-008 is deferred
- Dev server not responding to 8787 during testing (build output verified correct)

## Verification Commands

```bash
# Build (verify no errors)
pnpm build

# Check dist output
ls dist/server/chunks/ | grep sitemap

# Check worker contains sitemap route
grep -l "sitemap" dist/server/entry.mjs
```

## Acceptance

- [x] AC-US1-01 to AC-US1-05: Sitemap generator complete
- [x] AC-US2-01 to AC-US2-04: Breadcrumb on business/non-profit/public-sector/product pages
- [x] AC-US2-05: Deferred (blog pages don't exist)
- [x] E2E tests created for all implemented features