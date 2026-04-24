# Tasks: Remove Hono - Pure Astro API

## Phase 1: Auth API Migration

### T-001: Create Astro auth API endpoints
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed

**Test**: Given POST `/api/auth/sign-in` → Then returns session cookie

**Implementation**: Created `src/pages/api/auth/[...path].ts` with sign-in, sign-up, sign-out handlers

**Dependencies**: None

---

## Phase 2: Business API Migration

### T-002: Create Astro businesses API endpoints
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Test**: Given GET `/api/businesses` → Then returns business list with pagination

**Implementation**: Created `src/pages/api/businesses/index.ts` and `src/pages/api/businesses/[slug].ts`

**Dependencies**: T-001

---

## Phase 3: Admin API Migration

### T-003: Create Astro admin API endpoints
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03 | **Status**: [x] completed

**Test**: Given GET `/api/admin/stats` → Then returns dashboard statistics

**Implementation**: Created `src/pages/api/admin/stats.ts`, `businesses/index.ts`, `users/index.ts`, `categories/index.ts`, `settings/index.ts`

**Dependencies**: T-002

---

## Phase 4: Remaining API Migration

### T-004: Create Astro products API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01 | **Status**: [x] completed

**Dependencies**: T-003

---

### T-005: Create Astro reviews API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-02 | **Status**: [x] completed

**Dependencies**: T-003

---

### T-006: Create Astro media API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-03 | **Status**: [x] completed

**Implementation**: Created `src/pages/api/media/index.ts`, `[id].ts`, `upload.ts`

**Dependencies**: T-003

---

### T-007: Create Astro orders API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-04 | **Status**: [x] completed

**Dependencies**: T-003

---

### T-008: Create Astro blogs API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-05 | **Status**: [x] completed

**Dependencies**: T-003

---

### T-009: Create Astro banners API
**User Story**: US-005 | **Satisfies ACs**: AC-US5-05 | **Status**: [x] completed

**Implementation**: Created `src/pages/api/banners/index.ts`, `active.ts`, `[id].ts`

**Dependencies**: T-003

---

### T-010: Create Astro sitemap endpoint
**User Story**: US-005 | **Satisfies ACs**: AC-US5-05 | **Status**: [x] completed

**Dependencies**: T-003

---

### T-011: Create Astro cron endpoints
**User Story**: US-005 | **Satisfies ACs**: AC-US5-05 | **Status**: [x] completed

**Dependencies**: T-003

---

## Phase 5: Cleanup

### T-012: Delete src/server directory
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03 | **Status**: [x] completed

**Test**: Given no Hono imports exist → When grep for 'hono' → Then no results

**Implementation**: Deleted `src/server/` directory, updated `tsconfig.json` path alias, updated `CLAUDE.md`

**Dependencies**: T-001 through T-011

---

## Summary

| Task | Status |
|------|--------|
| T-001 Auth API | [x] completed |
| T-002 Businesses API | [x] completed |
| T-003 Admin API | [x] completed |
| T-004 Products API | [x] completed |
| T-005 Reviews API | [x] completed |
| T-006 Media API | [x] completed |
| T-007 Orders API | [x] completed |
| T-008 Blogs API | [x] completed |
| T-009 Banners API | [x] completed |
| T-010 Sitemap | [x] completed |
| T-011 Cron | [x] completed |
| T-012 Delete src/server | [x] completed |
