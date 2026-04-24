---
increment: 0015-hono-removal
title: "Remove Hono - Pure Astro API"
type: refactor
priority: P1
status: in-progress
created: 2026-04-23
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Remove Hono - Pure Astro API Architecture

## Overview

Remove all Hono server code and migrate all API routes to Astro API endpoints. This simplifies the architecture by using only Astro 6's built-in API capabilities.

## User Stories

### US-001: Remove Hono Server
**Project**: timorlist

**As a** developer **I want** to remove Hono server code **So that** the codebase uses only Astro API routes

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Delete `src/server/` directory completely
- [ ] **AC-US1-02**: Remove Hono imports from `astro.config.mjs`
- [ ] **AC-US1-03**: No `src/server/` references in any file

---

### US-002: Migrate Auth API Routes
**Project**: timorlist

**As a** developer **I want** auth endpoints in Astro API **So that** authentication works via Astro

**Acceptance Criteria**:
- [ ] **AC-US2-01**: `/api/auth/*` routes work via Astro API
- [ ] **AC-US2-02**: Session management via better-auth
- [ ] **AC-US2-03**: All auth flows (login, register, logout) functional

---

### US-003: Migrate Business API Routes
**Project**: timorlist

**As a** developer **I want** business endpoints in Astro API **So that** CRUD operations work

**Acceptance Criteria**:
- [ ] **AC-US3-01**: GET/POST/PUT/DELETE `/api/businesses` work
- [ ] **AC-US3-02**: Business search and filtering functional
- [ ] **AC-US3-03**: Business categories and products work

---

### US-004: Migrate Admin API Routes
**Project**: timorlist

**As a** admin **I want** admin endpoints in Astro API **So that** dashboard works

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Admin stats endpoint functional
- [ ] **AC-US4-02**: Admin CRUD for businesses, users, categories work
- [ ] **AC-US4-03**: Admin settings endpoint functional

---

### US-005: Migrate Remaining API Routes
**Project**: timorlist

**As a** developer **I want** all remaining endpoints in Astro API **So that** full functionality works

**Acceptance Criteria**:
- [ ] **AC-US5-01**: Products API (`/api/products`) functional
- [ ] **AC-US5-02**: Reviews API (`/api/reviews`) functional
- [ ] **AC-US5-03**: Media upload endpoint functional
- [ ] **AC-US5-04**: Orders API functional
- [ ] **AC-US5-05**: Sitemap endpoint functional

---

## Technical Approach

### Migration Strategy

1. **Identify all Hono routes** in `src/server/routes/`
2. **Create equivalent Astro API routes** in `src/pages/api/`
3. **Test each endpoint** before deleting Hono route
4. **Delete `src/server/` directory** when all migrated

### API Route Mapping

| Hono Route | Astro API Route |
|------------|----------------|
| `/api/auth/*` | `/api/auth/*` |
| `/api/businesses/*` | `/api/businesses/*` |
| `/api/admin/*` | `/api/admin/*` |
| `/api/products/*` | `/api/products/*` |
| `/api/reviews/*` | `/api/reviews/*` |
| `/api/media/*` | `/api/media/*` |
| `/api/categories/*` | `/api/categories/*` |
| `/api/orders/*` | `/api/orders/*` |
| `/api/blogs/*` | `/api/blogs/*` |
| `/api/banners/*` | `/api/banners/*` |
| `/cron/*` | `/api/cron/*` |

## Out of Scope

- Changing database schema
- Modifying business logic
- UI component changes

## Dependencies

- Astro 6 API routes (already available)
- better-auth (already configured)
- Drizzle ORM (already configured)
