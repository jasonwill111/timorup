# Tasks: Admin Dashboard Enhancement

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Dashboard Stats & Charts

- [x] **T-001**: Implement stats API endpoint with MTD metrics
- [x] **T-002**: Add dashboard stats cards with total counts
- [x] **T-003**: Add responsive grid layout for mobile
- [x] **T-004**: Add clickable stat cards linking to admin pages

## Phase 2: Plans Page

- [x] **T-010**: Add prominent warning banner to plans page
- [x] **T-011**: Implement role-based edit access (super_admin only)
- [x] **T-012**: Show "View only" for admin/editor roles
- [x] **T-013**: Implement Create Plan modal and API
- [x] **T-014**: Implement Delete plan with confirmation
- [x] **T-015**: Add plan deletion protection (cannot delete if business uses plan)

## Phase 3: Pricing Page

- [x] **T-020**: Simplify pricing page UI, focus on SKU differences
- [x] **T-021**: Dynamic price loading from API
- [x] **T-022**: Add "All Plans Include" section for shared features

## Phase 4: Plan Limits Enforcement

- [x] **T-030**: Add maxBusinessImages/maxBusinessVideos to plans schema
- [x] **T-031**: Update getPlanLimits() with tier name fallback
- [x] **T-032**: Enforce limits in media upload API
- [x] **T-033**: Verify SKU limits work via subscription.ts

## Phase 5: Documentation

- [x] **T-040**: Update spec.md with implementation details
- [x] **T-041**: Document plans data model and enforcement points

## Test Coverage

### Unit Tests
- `src/lib/subscription.test.ts` - SKU limit enforcement
- `src/lib/media.test.ts` - Plan limits parsing

### Integration Tests
- `/api/admin/plans` - CRUD operations
- `/api/media` - Upload limit enforcement

## Acceptance Criteria Verification

| AC | Status | Verification |
|----|--------|--------------|
| AC-US1-01 | ✅ | Stats API returns all counts |
| AC-US1-02 | ✅ | MTD metrics included |
| AC-US1-03 | ✅ | Expiring soon count in stats |
| AC-US1-04 | ✅ | Cards link to admin pages |
| AC-US1-05 | ✅ | Mobile responsive grid |
| AC-US2-01 | ✅ | Revenue chart (6 months) |
| AC-US2-02 | ✅ | Subscriptions chart |
| AC-US2-03 | ✅ | Users chart |
| AC-US2-04 | ✅ | Chart tooltips |
| AC-US3-01 | ✅ | Warning banner shown |
| AC-US3-02 | ✅ | super_admin edit only |
| AC-US3-03 | ✅ | View only for others |
| AC-US4-01 | ✅ | Recent subscriptions list |
| AC-US4-02 | ✅ | Quick actions panel |

## Grill Findings - All Fixed (2026-05-09)

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| GF-001 | HIGH | XSS in categories/index.astro | ✅ FIXED |
| GF-002 | HIGH | XSS in products.astro | ✅ FIXED |
| GF-003 | MEDIUM | Media API auth check | ✅ FIXED |
| GF-004 | MEDIUM | Memory pagination | ✅ FIXED |
| GF-005 | MEDIUM | Usage indicator | ✅ FIXED |

## Test Coverage (2026-05-09)

### Unit Tests Added
| File | Tests | Coverage |
|------|-------|----------|
| `src/lib/security.test.ts` | 27 | XSS防护、Media权限验证 |
| `src/lib/api.test.ts` | 29 | API格式、Stats、Plans、Auth |
| `src/lib/subscription-expiry.test.ts` | 27 | US-006订阅过期、US-007清理任务 |

### Total: 223+ Vitest tests passing
