---
increment: 0029-role-based-auth
title: "Role-Based Auth System Fixes"
type: feature
priority: P1
status: active
created: 2026-05-07
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# SPEC: Role-Based Auth System Fixes

**Increment**: 0029-role-based-auth
**Project**: timorlist
**Type**: feature
**Priority**: P1

## Context

Current auth system has solid backend infrastructure (better-auth, D1 sessions, role field) but missing frontend role-based UI and permission enforcement:
- Admin pages render same UI regardless of `user.role`
- No role management UI
- `super_admin` role defined but unused
- `editor` role allowed by API but no frontend differentiation
- No sign-up page despite better-auth supporting registration
- Ownership check uses fragile `session.userId === ownerId` with no admin override

## User Stories

### US-001: Permission Model Definition
**Project**: timorlist

**As a** system architect
**I want** a clear 4-tier permission model
**So that** each role has explicit, non-overlapping capabilities

**Acceptance Criteria**:
- [x] **AC-US1-01**: `user` role: read own listings, manage own content
- [x] **AC-US1-02**: `editor` role: create listings (business/non-profit), SKUs, blogs; cannot modify subscriptions; cannot see other admin pages
- [x] **AC-US1-03**: `admin` role: full CRUD on all listings, products, categories, banners, media, reviews, skus, blogs, subscriptions; can see all users (user, editor, admin)
- [x] **AC-US1-04**: `super_admin` role: admin + can delete other admins
- [x] **AC-US1-05**: Permission constants centralized in `src/lib/permissions.ts`

---

### US-002: Role-Based Admin Sidebar
**Project**: timorlist

**As a** logged-in admin user
**I want** to see only menu items I have permission to access
**So that** I don't see confusing unauthorized options

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Sidebar hides "Users" link from non-super_admin roles
- [ ] **AC-US2-02**: Sidebar hides "AI Tools" link from non-super_admin roles
- [ ] **AC-US2-03**: Sidebar shows "Categories" and "Heroes" only to admin+
- [ ] **AC-US2-04**: Sidebar shows "Subscriptions" and "Reviews" only to admin+
- [ ] **AC-US2-05**: Logged-in user role displayed in sidebar footer
- [ ] **AC-US2-06**: Sidebar component lazy-loads role check (client-side session read)

---

### US-003: Role Management UI
**Project**: timorlist

**As a** super_admin
**I want** to view and edit user roles
**So that** I can assign appropriate access levels

**Acceptance Criteria**:
- [ ] **AC-US3-01**: `/admin/users` page shows role badge for each user
- [ ] **AC-US3-02**: Dropdown to change role on each user row (super_admin only)
- [ ] **AC-US3-03**: API endpoint `PATCH /api/admin/users/[id]/role` updates role
- [ ] **AC-US3-04**: Role change requires super_admin auth check
- [ ] **AC-US3-05**: Cannot demote own super_admin role (self-protection)
- [ ] **AC-US3-06**: Success/error toast on role change

---

### US-004: Sign-Up Page
**Project**: timorlist

**As a** new user
**I want** to register an account
**So that** I can create and manage my business listings

**Acceptance Criteria**:
- [ ] **AC-US4-01**: `/auth/sign-up` page with name, email, password fields
- [ ] **AC-US4-02**: Client-side validation (email format, password min 8 chars)
- [ ] **AC-US4-03**: POST to `/api/auth/sign-up` creates user with `role: 'user'`
- [ ] **AC-US4-04**: Redirect to `/admin` on success
- [ ] **AC-US4-05**: Error display on failure (email taken, etc.)
- [ ] **AC-US4-06**: Link from login page to sign-up page

---

### US-005: Admin Override for Ownership Checks
**Project**: timorlist

**As a** admin/super_admin
**I want** to edit any listing regardless of owner
**So that** I can manage content without transfer requests

**Acceptance Criteria**:
- [ ] **AC-US5-01**: `src/lib/business-logic.ts` `canEditBusiness(user, business)` checks role first
- [ ] **AC-US5-02**: admin/super_admin can edit any listing (ownerId check bypassed)
- [ ] **AC-US5-03**: editor can only edit their own listings
- [ ] **AC-US5-04**: `/business/[slug]/edit` page renders edit form for authorized users
- [ ] **AC-US5-05**: `/business/[slug]/products` shows add-product button based on role
- [ ] **AC-US5-06**: All edit/delete API endpoints check role before ownership

---

### US-006: Route-Level Permission Guards
**Project**: timorlist

**As a** security system
**I want** protected routes to redirect unauthorized users
**So that** no one accesses admin pages without proper role

**Acceptance Criteria**:
- [ ] **AC-US6-01**: `/admin/*` routes redirect to `/admin/login` if no session
- [ ] **AC-US6-02**: `/admin/users` redirects to dashboard if not super_admin
- [ ] **AC-US6-03**: `/admin/ai-tools` redirects to dashboard if not super_admin
- [ ] **AC-US6-04**: API endpoints return 403 for insufficient role (not just 401)

## Out of Scope

- OAuth provider setup (already configured, just not enabled)
- Password reset flow
- Email verification
- Session expiry configuration
- Rate limiting for auth endpoints
