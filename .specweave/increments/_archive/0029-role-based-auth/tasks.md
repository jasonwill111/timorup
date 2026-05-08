# Tasks: Role-Based Auth System Fixes (0029)

## Task Notation
- `[T-###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Foundation (US-001)

### T-001: Create permissions.ts with role constants
**References**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05
**Test**: `src/lib/permissions.test.ts`

**Test Plan**:
- Given `user` role → expect `canEditBusiness = false` for other's listing
- Given `admin` role → expect `canEditBusiness = true` for any listing
- Given `super_admin` role → expect `canManageUsers = true`
- Given `editor` role → expect `canManageCategories = false`

**Dependencies**: None
**Status**: [x] Completed

### T-002: Create auth-client.ts helper
**References**: AC-US2-06
**Test**: `src/lib/auth-client.test.ts`

**Test Plan**:
- Given no session → expect `getCurrentUser()` returns null
- Given valid session → expect `getCurrentUser()` returns user with role
- Given `super_admin` session → expect `canAccess('/admin/users')` = true

**Dependencies**: T-001
**Status**: [x] Completed

## Phase 2: UI Components (US-002)

### T-003: Update AdminLayout with role-based sidebar
**References**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05, AC-US2-06

**Implementation Details**:
- Add `<script>` to fetch session and hide/show nav items based on role
- Show "Users" and "AI Tools" only for `admin`+ (per updated permissions)
- Show "Categories", "Heroes", "Subscriptions", "Reviews" only for `admin`+
- Display user role badge in sidebar

**Dependencies**: T-002
**Status**: [x] Completed

### T-004: Create sign-up page
**References**: AC-US4-01, AC-US4-02, AC-US4-03, AC-US4-04, AC-US4-05, AC-US4-06
**Test**: `src/pages/auth/sign-up.test.ts`

**Test Plan**:
- Given valid form → expect user created with `role: 'user'`
- Given invalid email → expect error message displayed
- Given email already taken → expect error message displayed
- Given success → expect redirect to `/admin`

**Dependencies**: T-002
**Status**: [x] Completed (register.astro already exists)

### T-005: Add sign-up link to login page
**References**: AC-US4-06

**Dependencies**: T-004
**Status**: [x] Completed

## Phase 3: Role Management (US-003)

### T-006: Create PATCH /api/admin/users/[id]/role endpoint
**References**: AC-US3-03, AC-US3-04, AC-US3-05
**Test**: `src/pages/api/admin/users/[id]/role.test.ts`

**Test Plan**:
- Given non-super_admin request → expect 403
- Given valid super_admin request → expect role updated
- Given self-demotion attempt → expect 400 error

**Dependencies**: T-001
**Status**: [x] Completed

### T-007: Update /admin/users with role editing
**References**: AC-US3-01, AC-US3-02, AC-US3-06

**Implementation Details**:
- Add role badge to each user row (with super_admin styling)
- Add role dropdown (disabled for non-super_admin)
- Add toast on success/error

**Dependencies**: T-006
**Status**: [x] Completed

## Phase 4: Business Logic (US-005)

### T-008: Update canEditBusiness with role check
**References**: AC-US5-01, AC-US5-02, AC-US5-03
**Test**: `src/lib/business-logic.test.ts`

**Test Plan**:
- Given `admin` + other's listing → expect `canEditBusiness = true`
- Given `editor` + own listing → expect `canEditBusiness = true`
- Given `user` + own listing → expect `canEditBusiness = true`
- Given `user` + other's listing → expect `canEditBusiness = false`

**Dependencies**: T-001
**Status**: [x] Completed

### T-009: Update /business/[slug]/edit access
**References**: AC-US5-04

**Dependencies**: T-008
**Status**: [x] Completed

### T-010: Update /business/[slug]/products access
**References**: AC-US5-05

**Dependencies**: T-008
**Status**: [x] Completed

## Phase 5: Route Guards (US-006)

### T-011: Add route-level permission guards
**References**: AC-US6-01, AC-US6-02, AC-US6-03, AC-US6-04

**Implementation Details**:
- Admin pages already check auth via `/api/auth/session`
- `/admin/users` requires admin auth (already in place)
- API endpoints return 403 for insufficient role (in admin-auth.ts)

**Dependencies**: T-001, T-003
**Status**: [x] Completed (existing auth checks)

## Verification

### Build & Test
- [x] Run `pnpm build` - ✅ Passed
- [x] Run `pnpm dev` - ✅ Server running at localhost:8787
- [ ] Test all role scenarios manually
