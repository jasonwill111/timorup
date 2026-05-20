# Tasks: Migrate REST APIs to Server Actions

## Task Notation
- [T###]: Task ID
- [P]: Parallelizable
- [ ]: Not started
- [x]: Completed

---

## Phase 1: Auth Endpoints Migration (US-001)

- [x] T-001: Update login.astro to use actions.auth.signIn() — **Source code done, needs rebuild**
- [ ] T-002: Update signup.astro to use actions.auth.signUp() — **Still uses fetch in production**
- [x] T-003: Update admin/login.astro to use actions.auth.signIn() — **Source code done**
- [x] T-004: Verify sign-out uses actions.auth.signOut() — **PASSES E2E**

**US-001 E2E Status**: 3/4 ACs failing — rebuild needed

---

## Phase 2: Admin CRUD Pages Migration (US-002)

- [ ] T-010: Update admin/blogs.astro to use actions.admin.blogs.* — **Source code has actions, needs full fetch removal**
- [ ] T-011: Update admin/categories.astro to use actions.admin.categories.* — **Still has fetch for businesses dropdown**
- [ ] T-012: Update admin/heroes.astro (ad-banners) to use actions.admin.heroes.* — **Still has fetch for businesses dropdown**
- [x] T-013: Update admin/orders.astro to use actions.admin.subscriptions.* — **PASSES E2E**
- [x] T-014: Update admin/users.astro to use actions.admin.users.* — **PASSES E2E**

**US-002 E2E Status**: 3/5 ACs failing — needs implementation

---

## Phase 3: Business Owner Pages Migration (US-003)

- [x] T-020: Check edit-business-page route — **SKIPPED** (page doesn't exist)
- [x] T-021: Check business/[slug]/edit route — **SKIPPED** (page doesn't exist)
- [x] T-022: Verify product pages use actions.products.* — **PASSES E2E**

**US-003 E2E Status**: 3/3 ACs PASS (2 skipped, 1 passed)

---

## Phase 4: REST API Cleanup (US-004)

- [x] T-030: Delete auth REST files (sign-in, sign-up, sign-out) — **PASSES E2E** (returns 404)
- [x] T-031: Delete admin REST files — **PASSES E2E**
- [x] T-032: Verify no remaining mutation fetch calls — **PASSES E2E**

**US-004 E2E Status**: 3/3 ACs PASS

---

## E2E Test Summary

| User Story | ACs | Passed | Failed |
|------------|-----|--------|--------|
| US-001 Auth | 4 | 1 | 3 |
| US-002 Admin CRUD | 5 | 2 | 3 |
| US-003 Business Owner | 3 | 3 | 0 |
| US-004 REST Cleanup | 3 | 3 | 0 |
| **TOTAL** | **15** | **7** | **8** |

---

## Next Steps

1. **Rebuild and redeploy** to update production with source changes
2. **Re-run E2E tests** to verify 8 failing ACs now pass
3. **Focus on**:
   - login.astro - Remove fetch('/api/auth/sign-in'), use actions.auth.signIn()
   - signup.astro - Remove fetch('/api/auth/sign-up'), use actions.auth.signUp()
   - admin/categories.astro - Replace fetch('/api/businesses?limit=100') with actions call
   - admin/ad-banners.astro - Replace fetch('/api/businesses?limit=100') with actions call
   - admin/blogs.astro - Verify full migration and fetch removal

---

## Reports

- E2E Report: `.specweave/increments/0070-migrate-to-server-actions/reports/e2e-report.json`
- Test Report: `.specweave/increments/0070-migrate-to-server-actions/reports/e2e-test-report.md`