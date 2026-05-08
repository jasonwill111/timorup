# Tasks: Type Refactor (0036)

## Task Notation
- `[T-###]`: Task ID
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Isolated Files (9 files, 14 any)

### T-001: Fix CategoryFilter.astro any usage
**Satisfies AC**: AC-US3-01
**Status**: [x] completed

**Implementation**:
- Read src/components/islands/CategoryFilter.astro
- Replaced `(cat: any)` with `{ id: number; name: string; slug: string }`

### T-002: Fix MediaGallery.astro any usage
**Satisfies AC**: AC-US3-02
**Status**: [x] completed

**Implementation**:
- Read src/components/ui/MediaGallery.astro
- Replaced `(item: any, idx: number)` with `(item: MediaItem, idx: number)` - uses existing interface

### T-003: Fix AdminLayout.astro any usage
**Satisfies AC**: AC-US3-03
**Status**: [x] completed

**Implementation**:
- Created src/types/global.d.ts with Window interface
- Replaced `(window as any)` with `window.` - uses Window interface

### T-004: Fix search.astro any usage
**Satisfies AC**: AC-US2-01 (partial)
**Status**: [x] completed

**Implementation**:
- Added BusinessSearchResult interface
- Replaced `(business: any)` with `(business: BusinessSearchResult)`

### T-005: Fix admin/heroes.astro any usage
**Satisfies AC**: AC-US1-10
**Status**: [x] completed

**Implementation**:
- Added HeroData interface to global.d.ts
- Replaced 5 any usages with HeroData type

### T-006: Fix admin/plans.astro any usage
**Satisfies AC**: AC-US1-08
**Status**: [x] completed

**Implementation**:
- Added PlanData interface
- Replaced any with PlanData

### T-007: Fix admin/index.astro any usage
**Satisfies AC**: AC-US1-04 (partial)
**Status**: [x] completed

**Implementation**:
- Added OrderData interface
- Replaced any with OrderData

### T-008: Fix business/[slug]/products.astro any usage
**Satisfies AC**: AC-US2-02
**Status**: [x] completed

**Implementation**:
- Added ProductData interface
- Replaced 5 any usages with ProductData

## Phase 2: Medium Complexity (6 files, 46 any)

### T-009: Fix admin/categories.astro any usage
**Satisfies AC**: AC-US1-01
**Status**: [x] completed

**Implementation**:
- Added CategoryData interface
- Replaced 13 any with CategoryData type

### T-010: Fix admin/skus.astro any usage
**Satisfies AC**: AC-US1-02
**Status**: [x] completed

**Implementation**:
- Replaced 6 any with SkuData type

### T-011: Fix admin/blogs.astro any usage
**Satisfies AC**: AC-US1-07
**Status**: [x] completed

**Implementation**:
- Replaced 4 any with BlogData type

### T-012: Fix admin/users.astro any usage
**Satisfies AC**: AC-US1-04
**Status**: [x] completed

**Implementation**:
- Replaced 4 any with UserData type

### T-013: Fix admin/reviews.astro any usage
**Satisfies AC**: AC-US1-05
**Status**: [x] completed

**Implementation**:
- Replaced 1 any with ReviewData type

### T-014: Fix admin/subscriptions.astro any usage
**Satisfies AC**: AC-US1-06
**Status**: [x] completed

**Implementation**:
- Replaced 3 any with SubscriptionData type

## Phase 3: Complex Pages (3 files, 24 any)

### T-015: Fix business/[slug]/edit/index.astro any usage
**Satisfies AC**: AC-US2-01
**Status**: [x] completed

**Implementation**:
- Added BusinessFormData, LeafletMap, LeafletMarker, LeafletEvent, LeafletStatic interfaces
- Replaced 14 any (13 remaining, 1 aboutUsEditor kept as any for tiptap dynamic import)

### T-016: Fix business/[slug]/product/new/index.astro any usage
**Satisfies AC**: AC-US2-03
**Status**: [x] completed

**Implementation**:
- Replaced 2 any with ProductData type

### T-017: Fix business/[slug]/product/[id]/edit/index.astro any usage
**Satisfies AC**: AC-US2-04
**Status**: [x] completed

**Implementation**:
- Replaced 5 any with ProductData type

## Phase 4: Admin Complex (2 files, 18 any)

### T-018: Fix admin/media.astro any usage
**Satisfies AC**: AC-US1-11 (partial)
**Status**: [x] completed

**Implementation**:
- Replaced 4 any with MediaData type

### T-019: Fix admin/ai-tools.astro any usage
**Satisfies AC**: AC-US1-11
**Status**: [x] completed

**Implementation**:
- Replaced 9 any with AgentResponse type

## Phase 5: Verification

### T-020: Run build verification
**Satisfies AC**: AC-US4-01, AC-US4-02
**Status**: [x] completed

**Implementation**:
- Ran `pnpm build` - PASSED
- Counted remaining any: 1 (aboutUsEditor - tiptap dynamic import, acceptable exception)
- Total removed: 83/84

## Summary

| Metric | Value |
|--------|-------|
| Total any usages | 84 |
| Remaining | 1 (tiptap dynamic import - acceptable) |
| Removed | 83 |
| Build status | PASSED |
| Type interfaces added | 18 |

## Verification Commands

```bash
# Count any usages (should be 1 - tiptap exception)
grep -rn ": any\| as any" src/ \
  --include="*.ts" --include="*.tsx" --include="*.astro" \
  | grep -v ".test." | wc -l

# Build check
pnpm build
```