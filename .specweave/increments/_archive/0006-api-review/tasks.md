# Tasks: 0006-api-review

**Increment**: 0006-api-review
**Generated**: 2026-04-18
**Test Mode**: TDD
**Coverage Target**: Unit 80%, E2E 100% of AC scenarios

---

## Phase 1: Critical Fixes

### T-001: Fix auth stub in pages/api/auth/sign-in.ts
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04
**Status**: [x] Completed

**Description**:
The sign-in endpoint accepts any credentials. It should use better-auth's signIn or be removed if Hono auth is used instead.

**Implementation**:
1. Check if `pages/api/auth/sign-in.ts` is used anywhere
2. If not used: add deprecation comment and redirect to Hono auth
3. If used: verify password using better-auth or bcrypt

**Test Plan**:
- Given an invalid credential
- When POST /api/auth/sign-in is called
- Then return 401 with error

---

### T-002: Standardize error response format
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03
**Status**: [x] Completed

**Description**:
Update all endpoints to use unified error format and Zod v4 error format.

**Implementation**:
1. Create shared error response helpers in `@/lib/api-response`
2. Update Astro endpoints: businesses/create.ts, businesses/index.ts
3. Update Hono endpoints: businesses.ts, auth.ts
4. Verify Zod validation uses v4 format

**Test Plan**:
- Given various error scenarios
- When API is called
- Then response follows standard format

---

## Phase 2: Authentication Standardization

### T-003: Audit all protected endpoints
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-05
**Status**: [x] Completed

**Description**:
Ensure all protected endpoints return 401 for unauthenticated users consistently.

**Implementation**:
1. List all endpoints that should require auth
2. Verify Astro endpoints use `auth.api.getSession()`
3. Verify Hono endpoints use `getCurrentUser()`
4. Add consistent 401 responses

**Files to check**:
- `pages/api/businesses/create.ts`
- `pages/api/admin/*`
- `server/routes/businesses.ts`
- `server/routes/account.ts`

---

## Phase 3: Input Validation

### T-004: Add Zod validation to business endpoints
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Status**: [x] Completed

**Description**:
Add Zod schemas for all business-related POST/PUT endpoints.

**Implementation**:
1. Create business validation schemas
2. Add validation to `pages/api/businesses/create.ts`
3. Add validation to `server/routes/businesses.ts` POST/PUT
4. Return field-level validation errors

**Test Plan**:
- Given invalid/missing required fields
- When POST /api/businesses is called
- Then return 400 with validation errors

---

## Phase 4: Endpoint Consolidation

### T-005: Document API layers and remove duplicates
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03
**Status**: [x] Completed

**Description**:
Document which endpoints live in Astro vs Hono and identify duplicates.

**Implementation**:
1. Create API documentation in `/docs/internal/specs/api/endpoints.md`
2. Check for duplicate business endpoints
3. Check for duplicate product endpoints
4. Mark one as preferred, deprecate other

**Findings**:
- Astro: `pages/api/businesses/create.ts` - form submission
- Hono: `server/routes/businesses.ts` - CRUD API
- Both are used for different purposes - keep both

---

## Phase 5: Performance & Polish

### T-006: Fix category join issue in businesses.ts
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01, AC-US5-02
**Status**: [x] Completed

**Description**:
Fix incorrect property access in category mapping.

**Implementation**:
1. Fix `businesses.ts:151-154` - change `b.category_id` to `b.categories`
2. Verify all leftJoin aliases are correct
3. Add query comments for complex joins

**Test Plan**:
- Given a business with category
- When GET /api/businesses is called
- Then response includes categoryName

---

### T-007: Apply cache headers consistently
**User Story**: US-005 | **Satisfies ACs**: AC-US5-03
**Status**: [x] Completed

**Description**:
Apply consistent cache headers to list endpoints.

**Implementation**:
1. Add cache headers to Hono business list
2. Verify Astro business list has cache headers
3. Document cache strategy in endpoint docs

---

## AC Coverage Summary

| AC-ID | Description | Covered By |
|-------|-------------|-----------|
| AC-US1-01 | Unified error format | T-002 |
| AC-US1-02 | Success format with meta | T-002 |
| AC-US1-03 | Zod v4 error format | T-002 |
| AC-US1-04 | Content-Type header | T-002 |
| AC-US1-05 | HTTP status codes | T-002, T-003 |
| AC-US2-01 | Astro auth pattern | T-003 |
| AC-US2-02 | Hono auth pattern | T-003 |
| AC-US2-03 | Session token property | T-001 |
| AC-US2-04 | Fix auth stub | T-001 |
| AC-US2-05 | 401 for unauthenticated | T-003 |
| AC-US3-01 | Zod validation | T-004 |
| AC-US3-02 | 400 with field details | T-004 |
| AC-US3-03 | Required field checks | T-004 |
| AC-US3-04 | Slug uniqueness | T-004 |
| AC-US4-01 | API layer docs | T-005 |
| AC-US4-02 | Duplicate business endpoints | T-005 |
| AC-US4-03 | Duplicate product endpoints | T-005 |
| AC-US4-04 | Cache headers | T-007 |
| AC-US5-01 | N+1 query issues | T-006 |
| AC-US5-02 | Index documentation | T-006 |
| AC-US5-03 | Pagination | T-007 |
| AC-US5-04 | Query optimization | T-006 |

---

## Task Dependencies

```
T-001: Fix auth stub
  ↓
T-002: Standardize error format (depends on T-001)
  ↓
T-003: Audit auth patterns (depends on T-002)
T-004: Zod validation (depends on T-002)
T-005: Endpoint consolidation (depends on T-002)
  ↓
T-006: Fix category join (depends on T-005)
T-007: Cache headers (depends on T-005)
```

---

## Phase Order

```
Phase 1: Critical (T-001, T-002)
Phase 2: Auth (T-003)
Phase 3: Validation (T-004)
Phase 4: Consolidation (T-005)
Phase 5: Polish (T-006, T-007)
```
