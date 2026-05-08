# Tasks: 一人一店限制 (BS-013)

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- Model hints: haiku (simple), sonnet (default)

## Phase 1: Shared Utility + `GET /my-business` Endpoint

### T-001: Create shared `hasUserBusiness` utility
**Description**: Create `src/lib/business-logic.ts` with a reusable `hasUserBusiness(db, userId)` function that queries `businessPages` by `ownerId` using the indexed column. Returns the business record if found, null otherwise.

**References**: AC-US1-03, AC-US3-01

**Implementation Details**:
- Create `src/lib/business-logic.ts`
- Export `hasUserBusiness(db, userId): Promise<BusinessPage | null>`
- Use `db.select().from(businessPages).where(eq(businessPages.ownerId, userId)).limit(1)`

**Test Plan**:
- **File**: `src/lib/business-logic.test.ts`
- **Tests**:
  - **TC-001**: `hasUserBusiness` returns business when user has one
    - Given a mock db where `businessPages` query returns `[{ id: 'biz-1', ownerId: 'user-1' }]`
    - When `hasUserBusiness(mockDb, 'user-1')` is called
    - Then it returns `{ id: 'biz-1', ownerId: 'user-1' }`
  - **TC-002**: `hasUserBusiness` returns null when user has no business
    - Given a mock db where `businessPages` query returns `[]`
    - When `hasUserBusiness(mockDb, 'user-1')` is called
    - Then it returns `null`

**Dependencies**: None
**Status**: [x] Completed

### T-002: Add `GET /my-business` Hono endpoint
**Description**: Add a `GET /my-business` route to `src/server/routes/businesses.ts` that uses `getCurrentUser(c)` to identify the authenticated user and returns their business via `hasUserBusiness`, or 404 if none.

**References**: AC-US3-01, AC-US3-02, AC-US3-03

**Implementation Details**:
- Add `businessesApp.get('/my-business', ...)` handler in `src/server/routes/businesses.ts`
- Use `getCurrentUser(c)` for auth
- Use `hasUserBusiness(db, user.id)` for the lookup
- Return minimal payload: `{ id, title, slug, status }`
- Handle 401 (unauthenticated), 200 (found), 404 (not found)

**Test Plan**:
- **File**: `src/lib/business-logic.test.ts`
- **Tests**:
  - **TC-003**: `GET /my-business` returns 401 when unauthenticated
    - Given no session cookie
    - When `GET /my-business` is called
    - Then HTTP 401 with `{ code: 'UNAUTHORIZED' }`
  - **TC-004**: `GET /my-business` returns 200 with business data
    - Given authenticated user `user-1` who owns `biz-1`
    - When `GET /my-business` is called
    - Then HTTP 200 with `{ success: true, data: { id: 'biz-1', title: 'My Cafe', slug: 'my-cafe', status: 'live' } }`
  - **TC-005**: `GET /my-business` returns 404 when user has no business
    - Given authenticated user `user-2` who owns no business
    - When `GET /my-business` is called
    - Then HTTP 404 with `{ code: 'NOT_FOUND' }`

**Dependencies**: T-001
**Status**: [x] Completed

## Phase 2: Fix Astro API Route

### T-003: Add session auth to Astro create route
**Description**: Update `src/pages/api/businesses/create.ts` to authenticate the request via better-auth session. Remove `ownerId` from the request body -- derive it from the session instead. This fixes a security issue where the current implementation trusts `ownerId` from the client.

**References**: AC-US1-04

**Implementation Details**:
- Import `auth` from `@/lib/auth`
- Read `better-auth.session_token` cookie from the request
- Call `auth.api.getSession()` to get the user
- Return 401 if session is invalid
- Use `user.id` from session as `ownerId`, ignoring any `ownerId` from request body

**Dependencies**: None
**Status**: [x] Completed

### T-004: Add LIMIT_REACHED check to Astro create route
**Description**: Update `src/pages/api/businesses/create.ts` to check `hasUserBusiness(db, userId)` before inserting. Return 400 `LIMIT_REACHED` if the user already has a business.

**References**: AC-US1-02, AC-US1-04

**Implementation Details**:
- Call `hasUserBusiness(db, userId)` after session auth
- If business exists, return:
  ```json
  { "success": false, "error": { "code": "LIMIT_REACHED", "message": "You can only create one business page" } }
  ```
  with HTTP 400
- Use the same error shape as the Hono route

**Test Plan**:
- **File**: `src/lib/business-logic.test.ts`
- **Tests**:
  - **TC-006**: `POST /api/businesses/create` returns 400 `LIMIT_REACHED` when user already has business
    - Given authenticated user `user-1` who already owns a business
    - When `POST /api/businesses/create` is called with valid body
    - Then HTTP 400 with `{ code: 'LIMIT_REACHED' }`
  - **TC-007**: `POST /api/businesses/create` returns 201 when user has no business
    - Given authenticated user `user-1` who owns no business
    - When `POST /api/businesses/create` is called with valid body
    - Then HTTP 201 with `{ success: true, data: { id, title, slug, ownerId: 'user-1' } }`
  - **TC-008**: `POST /api/businesses/create` returns 401 when unauthenticated
    - Given no session cookie
    - When `POST /api/businesses/create` is called
    - Then HTTP 401 with `{ code: 'UNAUTHORIZED' }`

**Dependencies**: T-001, T-003
**Status**: [x] Completed

## Phase 3: Frontend Guard

### T-005: Add pre-check to create.astro
**Description**: Update `src/pages/business/create.astro` to check if the user already has a business before rendering the form. If yes, replace the form with a friendly message showing the existing business name.

**References**: AC-US2-01, AC-US2-02, AC-US2-03

**Implementation Details**:
- After `getSession()` resolves, fetch `GET /api/businesses/my-business`
- If response is 200, set a `hasExistingBusiness = true` state and store `existingBusiness` data
- In the template (after the `<div class="container">`), conditionally render:
  - If `hasExistingBusiness`: show message card with existing business name and link to dashboard
  - If not: render the existing form as-is
- Add a `<div id="already-have-business" class="hidden">` container

**Dependencies**: T-002
**Status**: [x] Completed

### T-006: Add LIMIT_REACHED error handling in form submit
**Description**: Update the form submit handler in `create.astro` to show a user-friendly alert when the server returns `LIMIT_REACHED`.

**References**: AC-US2-04

**Implementation Details**:
- In the `fetch` result handler, check `result.error?.code === 'LIMIT_REACHED'`
- If true, show: "You already have a business page: [name]. Visit your dashboard to manage it."
- Link to `/account` or `/dashboard`

**Dependencies**: T-005
**Status**: [x] Completed

## Phase 4: Testing

### T-007: Run unit tests
**Description**: Run `pnpm test` to verify all new unit tests pass.

**Test Plan**:
- **File**: `src/lib/business-logic.test.ts`
- Run all 8 test cases from T-001, T-002, T-004
- Verify 0 failures

**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006
**Status**: [x] Completed

### T-008: Run e2e tests
**Description**: Run `pnpm test:e2e` to verify the BS-013 e2e test passes.

**Test Plan**:
- **File**: `e2e/business-complete.spec.ts`
- Update existing BS-013 test to match new UX (form replaced with message vs error alert)
- Add new test: user without business can create form
- Run Playwright tests

**Dependencies**: T-005, T-006
**Status**: [x] Completed

### T-009: Verify acceptance criteria
**Description**: Review all 9 acceptance criteria from spec.md and confirm each is implemented and tested.

**References**: AC-US1-01 through AC-US4-04

**Dependencies**: T-007, T-008
**Status**: [x] Completed
