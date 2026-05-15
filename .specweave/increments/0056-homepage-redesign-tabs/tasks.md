# Tasks: Homepage Redesign - Tabs + 12 Cards

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[x]`: Completed

---

## Phase 1: Layout Structure (US-001)

### T-001: Add tab navigation buttons (Desktop)
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**:
```html
<div class="hidden md:flex items-center gap-1 border-b">
  <button class="tab-btn" data-tab="businesses" data-active="true">Featured Businesses</button>
  <button class="tab-btn" data-tab="listings" data-active="false">Classified Ads</button>
  <button class="tab-btn" data-tab="products" data-active="false">Products & Services</button>
</div>
```

---

### T-002: Add dropdown select (Mobile)
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**:
```html
<div class="md:hidden">
  <select id="content-select" class="w-full p-3 rounded-lg border bg-card">
    <option value="businesses">Featured Businesses</option>
    <option value="listings">Classified Ads</option>
    <option value="products">Products & Services</option>
  </select>
</div>
```

---

### T-003: Add tab switching logic
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro` (script block)

**Changes**:
```javascript
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.setAttribute('data-active', b.getAttribute('data-tab') === tab ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('hidden', panel.getAttribute('data-panel') !== tab);
    });
  });
});
```

---

## Phase 2: Content Display (US-002)

### T-004: Query featured businesses
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**:
- Updated query to include both 'live' and 'published' status
- Limit increased from 6 to 12 cards
- Removed `.slice(0, 6)` to show all queried cards

---

### T-005: Query featured listings
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**:
- Query listings with 'published' status (local DB uses 'published')
- Removed expiry filter (expires_at is nullable)
- Limit set to 12 cards

---

### T-006: Query featured products
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**:
- Products joined with businesses on businessId
- Filter by businesses.status = 'live'
- Limit set to 12 cards

---

### T-007: Create ListingCard component
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Files**: `src/components/business/ListingCard.astro`

**Features**:
- Props: title, slug, price, listingType, location, thumbnail, imageIds, likes
- Color themes per listing type (product=emerald, job=blue, service=purple, property=amber, vehicle=red, wanted=cyan)
- Price badge overlay
- Type label badge
- Location + likes stats

---

## Phase 3: Removed Sections (US-003)

### T-008: Remove skeleton fallback
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**Files**: `src/pages/index.astro`

**Changes**: Removed `<div slot="fallback">` section with skeleton cards

---

### T-009: Remove Browse by Category
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [x] completed

**Files**: `src/pages/index.astro`, `src/components/islands/HomepageContent.astro`

**Changes**:
- Removed categories query from HomepageContent.astro
- Removed "Browse by Category" section from index.astro
- Removed businessCategories import

---

### T-010: Remove Government/NGO sections
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Changes**: Removed featuredGovs and featuredNgos sections, simplified to 3 tabs only

---

## Phase 4: Verification

### T-011: Run build
**Status**: [x] completed

`pnpm build` - Build completed successfully.

---

### T-012: Test tab switching
**Status**: [x] completed

**Test**: Given homepage → When clicked tab buttons → Then panels toggle correctly

---

## Summary

| Phase | Tasks | Completed |
|-------|-------|-----------|
| 1: Layout | 3 | 3 |
| 2: Content | 4 | 4 |
| 3: Removed | 3 | 3 |
| 4: Verification | 2 | 2 |
| **Total** | **12** | **12** |

## Files Modified

1. `src/pages/index.astro` - Removed skeleton + Browse by Category
2. `src/components/islands/HomepageContent.astro` - Tab navigation + 3 content queries
3. `src/components/business/ListingCard.astro` - New component

## Files Created

1. `.specweave/increments/0056-homepage-redesign-tabs/metadata.json`
2. `.specweave/increments/0056-homepage-redesign-tabs/spec.md`
3. `.specweave/increments/0056-homepage-redesign-tabs/tasks.md`