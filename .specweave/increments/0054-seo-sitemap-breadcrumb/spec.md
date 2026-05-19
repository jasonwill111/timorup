---
increment: 0054-seo-sitemap-breadcrumb
title: "SEO Sitemap & Breadcrumb"
type: feature
priority: P1
status: completed
created: 2026-05-14
structure: user-stories
test_mode: TDD
coverage_target: 100
---

# Feature: SEO Sitemap & Breadcrumb JSON-LD

## Overview

Add sitemap.xml generator and BreadcrumbList JSON-LD for all detail pages to improve search engine indexing.

## Context

robots.txt references `sitemap-index.xml` but the file doesn't exist. Detail pages lack BreadcrumbList structured data for rich snippets.

## User Stories

### US-001: Sitemap Generation (P1)
**Project**: TimorLink

**As a** search engine crawler
**I want** to discover all public pages via sitemap
**So that** all content gets indexed

**Acceptance Criteria**:
- [x] **AC-US1-01**: `/sitemap.xml` returns valid XML with all public pages ‚ú?- [x] **AC-US1-02**: Sitemap includes static pages (homepage, about, contact, pricing, faq, blog) ‚ú?- [x] **AC-US1-03**: Sitemap includes business/non-profit/public-sector detail pages ‚ú?- [x] **AC-US1-04**: Sitemap includes lastmod timestamp for each entry ‚ú?- [x] **AC-US1-05**: Sitemap includes changefreq and priority based on page type ‚ú?
### US-002: BreadcrumbList JSON-LD (P1)
**Project**: TimorLink

**As a** search engine
**I want** to understand page hierarchy via breadcrumbs
**So that** rich snippets display correctly in search results

**Acceptance Criteria**:
- [x] **AC-US2-01**: Business detail pages include BreadcrumbList JSON-LD ‚ú?- [x] **AC-US2-02**: Non-profit detail pages include BreadcrumbList JSON-LD ‚ú?- [x] **AC-US2-03**: Public sector detail pages include BreadcrumbList JSON-LD ‚ú?- [x] **AC-US2-04**: Product/SKU detail pages include BreadcrumbList JSON-LD ‚ú?- [ ] **AC-US2-05**: Blog article pages include BreadcrumbList JSON-LD ‚ö†Ô∏è (blog pages don't exist)

## Technical Requirements

### Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://TimorLink.com/</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### BreadcrumbList Structure
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://TimorLink.com/"},
    {"@type": "ListItem", "position": 2, "name": "Businesses", "item": "https://TimorLink.com/businesses"},
    {"@type": "ListItem", "position": 3, "name": "Business Name"}
  ]
}
```

## Pages to Add Breadcrumb JSON-LD

| Page | URL Pattern | Breadcrumb Path |
|------|-------------|------------------|
| Business | /business/[slug] | Home > Businesses > [Name] |
| Non-Profit | /non-profit/[slug] | Home > Non-Profits > [Name] |
| Public Sector | /public-sector/[slug] | Home > Public Sectors > [Name] |
| Product | /business/[slug]/product/[id] | Home > Businesses > [Business] > Products > [Name] |
| Blog | /blog/[slug] | Home > Blog > [Title] |

## Success Criteria

- `/sitemap.xml` returns valid XML (validated via curl)
- All detail pages include BreadcrumbList JSON-LD
- Google Rich Results Test passes for all pages
- E2E tests verify sitemap and breadcrumb presence

## Out of Scope

- Image sitemap (separate increment)
- Video sitemap (separate increment)
- Multi-language sitemap (hreflang already implemented)
