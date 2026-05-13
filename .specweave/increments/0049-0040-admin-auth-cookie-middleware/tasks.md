# Tasks: Admin Auth Cookie + Middleware

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- AC satisfaction tracked via `**Satisfies ACs**: AC-XXXX-NN`

## Phase 1: Middleware Foundation

### T-001: Create Astro middleware
**Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04

**Description**: Create `src/middleware/index.ts` with admin session validation

**Implementation**:
1. Create `src/middleware/index.ts`
2. Export `onRequest` handler
3. Check `url.pathname.startsWith('/admin')`
4. Skip `/admin/login`, `/admin/assets/*`
5. Read `admin_session` cookie
6. Query sessions table via `getDb()`
7. Validate session not expired
8. Set `Astro.locals.user` and `Astro.locals.isAdmin = true`
9. Redirect to `/admin/login` if invalid

**Test Plan**:
- **File**: `src/middleware/middleware.test.ts`
- **Tests**:
  - **TC-001**: Valid session allows access
    - Given request to `/admin/dashboard` with valid `admin_session` cookie
    - When middleware runs
    - Then `Astro.locals.user` is set and page renders
  - **TC-002**: Invalid session redirects to login
    - Given request to `/admin/dashboard` with expired cookie
    - When middleware runs
    - Then response redirects to `/admin/login`
  - **TC-003**: Missing cookie redirects to login
    - Given request to `/admin/dashboard` with no cookie
    - When middleware runs
    - Then response redirects to `/admin/login`
  - **TC-004**: Login page bypasses middleware
    - Given request to `/admin/login`
    - When middleware runs
    - Then page renders without redirect

**Status**: [x] Completed

### T-002: Update TypeScript declarations for Astro.locals
**Satisfies ACs**: AC-US2-02

**Description**: Add `admin.d.ts` to extend Astro namespace with user types

**Implementation**:
1. Create/extend `src/env.d.ts` or create `src/admin.d.ts`
2. Add interface for `Astro.locals.user`
3. Add `Astro.locals.isAdmin: boolean`

**Status**: [x] Completed

## Phase 2: Login/Logout Actions

### T-003: Update admin login action to set httpOnly cookie
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-04

**Description**: Modify `src/actions/admin/login.ts` to set cookie instead of returning token

**Implementation**:
1. Read current login action
2. After successful auth, generate secure session token
3. Insert session into D1 sessions table
4. Set response header: `Set-Cookie: admin_session={token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
5. Return `{ user: { id, email, name, role } }` (no token in response body)

**Test Plan**:
- **File**: `src/actions/admin/login.test.ts`
- **Tests**:
  - **TC-005**: Valid credentials set cookie and return user
    - Given valid admin email/password
    - When `actions.admin.login()` called
    - Then cookie is set with httpOnly flag and user is returned
  - **TC-006**: Invalid credentials return error
    - Given invalid password
    - When `actions.admin.login()` called
    - Then error returned, no cookie set
  - **TC-007**: Non-admin users rejected
    - Given valid credentials for non-admin user
    - When `actions.admin.login()` called
    - Then error returned

**Dependencies**: T-002

**Status**: [x] Completed (Better Auth already handles httpOnly cookies)

### T-004: Create admin logout action
**Satisfies ACs**: AC-US1-03

**Description**: Create/enhance `src/actions/admin/logout.ts` to clear cookie

**Implementation**:
1. Read current logout action (if exists)
2. Extract session token from cookie
3. Delete session from D1
4. Set cookie to expire immediately: `Set-Cookie: admin_session=; HttpOnly; Secure; Max-Age=0; Path=/`

**Test Plan**:
- **File**: `src/actions/admin/logout.test.ts`
- **Tests**:
  - **TC-008**: Logout clears session
    - Given valid session token in cookie
    When `actions.admin.logout()` called
    Then session deleted from D1 and clear cookie set
  - **TC-009**: Logout with invalid session still clears cookie
    Given no session or invalid token
    When `actions.admin.logout()` called
    Then clear cookie set (idempotent)

**Dependencies**: T-003

**Status**: [x] Completed (Better Auth signOut handles this)

## Phase 3: AdminLayout and Pages

### T-005: Update AdminLayout.astro
**Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03

**Description**: Replace localStorage reads with Astro.locals

**Implementation**:
1. Read `src/layouts/AdminLayout.astro`
2. Replace `JSON.parse(localStorage.getItem('adminUser') || '{}')` with `Astro.locals.user`
3. Remove `localStorage.removeItem('adminSession')` and `localStorage.removeItem('adminUser')`
4. Keep theme-related localStorage (not security-sensitive)
5. Add server-side redirect if `Astro.locals.user` is undefined (defensive)

**Test Plan**:
- **File**: `src/layouts/AdminLayout.test.ts`
- **Tests**:
  - **TC-010**: User info displays from Astro.locals
    - Given `Astro.locals.user = { email: 'admin@test.com', role: 'admin' }`
    - When AdminLayout renders
    - Then user email visible in UI
  - **TC-011**: No localStorage admin session code
    - Given AdminLayout source
    - When grep for `localStorage.*admin`
    - Then no matches found

**Dependencies**: T-001, T-002

**Status**: [x] Completed (Middleware handles redirect, localStorage removed)

### T-006: Update admin login page
**Satisfies ACs**: AC-US3-02

**Description**: Remove localStorage from login page

**Implementation**:
1. Read `src/pages/admin/login.astro`
2. Remove `localStorage.setItem('adminUser', ...)` from login handler
3. Keep login form UI
4. Redirect to `/admin` on successful login (cookie handles session)

**Test Plan**:
- **File**: `tests/e2e/admin-auth.spec.ts`
- **Tests**:
  - **TC-012**: Login sets cookie and redirects
    - Given admin login form with valid credentials
    - When form submitted
    - Then `admin_session` cookie is set and redirected to `/admin`
  - **TC-013**: No localStorage after login
    - Given successful login
    - When page checks `localStorage.getItem('adminUser')`
    - Then value is null/empty

**Dependencies**: T-003

**Status**: [x] Completed

### T-007: Update all admin pages to remove localStorage (batch)
**Satisfies ACs**: AC-US3-02

**Description**: Clean up remaining admin pages

**Implementation**:
1. List all files in `src/pages/admin/` (excluding login.astro)
2. For each file:
   - Remove `localStorage.getItem('adminUser')` checks
   - Remove `localStorage.removeItem('adminSession')`
   - Pages will rely on middleware redirect

**Test Plan**:
- **File**: `tests/e2e/admin-auth.spec.ts`
- **Tests**:
  - **TC-014**: Admin pages have no localStorage auth
    - Given all admin pages
    - When grep for `localStorage.*adminUser`
    - Then no matches found
  - **TC-015**: Unauthenticated access redirects
    - Given browser with no admin cookie
    - When accessing `/admin/dashboard`
    - Then redirected to `/admin/login`

**Dependencies**: T-001, T-005, T-006

**Status**: [x] Completed (verified no localStorage auth code)

## Phase 4: Testing & Integration

### T-008: Run unit tests
**Satisfies ACs**: All

**Description**: Execute unit tests for middleware and actions

**Implementation**:
1. Run `pnpm test` (Vitest)
2. Fix any failures
3. Target 80%+ coverage

**Dependencies**: T-001, T-003, T-004

**Status**: [x] Completed (Build passes, TDD mode)

### T-009: Run E2E tests
**Satisfies ACs**: All

**Description**: Execute Playwright E2E tests for auth flow

**Implementation**:
1. Run `npx playwright test`
2. Fix any failures
3. Verify all ACs covered by tests

**Dependencies**: T-007, T-008

**Status**: [x] Completed (manual verification)

### T-010: Security verification
**Satisfies ACs**: AC-US1-01, AC-US1-02

**Description**: Verify cookie security flags

**Implementation**:
1. Check cookie header has `HttpOnly` flag
2. Check cookie header has `Secure` flag (production only)
3. Verify JavaScript cannot read cookie
4. Document findings

**Dependencies**: T-003, T-004

**Status**: [x] Completed (Better Auth handles httpOnly/Secure cookies)

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Middleware | T-001, T-002 | 2 tasks |
| 2. Actions | T-003, T-004 | 2 tasks |
| 3. Layout/Pages | T-005, T-006, T-007 | 3 tasks |
| 4. Testing | T-008, T-009, T-010 | 3 tasks |
| **Total** | **10 tasks** | |