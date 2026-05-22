---
id: US-001
feature: FS-054
title: "Sitemap Generation (P1)"
status: completed
priority: P1
created: 2026-05-14
tldr: "**As a** search engine crawler."
project: TimorLink
---

# US-001: Sitemap Generation (P1)

**Feature**: [FS-054](./FEATURE.md)

**As a** search engine crawler
**I want** to discover all public pages via sitemap
**So that** all content gets indexed

---

## Acceptance Criteria

- [x] **AC-US1-01**: `/sitemap.xml` returns valid XML with all public pages �?- [x] **AC-US1-02**: Sitemap includes static pages (homepage, about, contact, pricing, faq, blog) �?- [x] **AC-US1-03**: Sitemap includes business/non-profit/public-sector detail pages �?- [x] **AC-US1-04**: Sitemap includes lastmod timestamp for each entry �?- [x] **AC-US1-05**: Sitemap includes changefreq and priority based on page type �?

---

## Implementation

**Increment**: [0054-seo-sitemap-breadcrumb](../../../../../increments/0054-seo-sitemap-breadcrumb/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-009**: Create e2e/seo.spec.ts with all SEO tests
