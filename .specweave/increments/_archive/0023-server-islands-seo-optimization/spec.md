---
increment: 0023-server-islands-seo-optimization
title: "Server Islands + SEO Optimization"
type: feature
priority: P1
status: active
created: 2026-05-03
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Server Islands + SEO Optimization

## Overview

Componentize dynamic pages using Astro Server Islands, add FAQ JSON-LD structured data, optimize CDN caching strategy.

## User Stories

### US-001: Server Islands for Dynamic Content
**Project**: timorlist

**As a** developer
**I want** to componentize dynamic content using Server Islands
**So that** static content is cached at CDN while dynamic parts refresh independently

**Acceptance Criteria**:
- [x] **AC-US1-01**: Business detail page uses Server Island for Products section
- [x] **AC-US1-02**: Products refresh every 2 minutes independently
- [x] **AC-US1-03**: Static parts (header, address, hours) remain cached

---

### US-002: FAQ JSON-LD Schema
**Project**: timorlist

**As a** SEO specialist
**I want** FAQ page to have proper JSON-LD structured data
**So that** Google displays FAQ rich results and AI citation improves

**Acceptance Criteria**:
- [x] **AC-US2-01**: FAQ page includes FAQPage JSON-LD schema
- [x] **AC-US2-02**: Schema contains at least 5 questions
- [x] **AC-US2-03**: Organization + WebSite JSON-LD on all pages

---

### US-003: CDN Cache Optimization
**Project**: timorlist

**As a** performance engineer
**I want** static pages to have optimal CDN cache
**So that** edge performance is maximized

**Acceptance Criteria**:
- [x] **AC-US3-01**: Homepage: 5min cache (matches server island refresh)
- [x] **AC-US3-02**: Static pages: 1 hour cache
- [x] **AC-US3-03**: Business pages: 5min cache
- [x] **AC-US3-04**: Listing pages: 2min cache

## Verification Results

| Test | Result |
|------|--------|
| pnpm build | ✅ Exit 0 |
| Homepage 200 | ✅ |
| FAQ JSON-LD present | ✅ |
| Business page SSR | ✅ 302→200 |
| CDN Cache headers | ✅ max-age=300 |
| Products Server Island | ✅ server:defer="2min" |

**Final Score**: 90/100