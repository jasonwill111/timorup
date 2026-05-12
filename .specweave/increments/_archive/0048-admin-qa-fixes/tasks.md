---
name: 0048-admin-qa-fixes tasks
description: Tasks for admin QA fixes
type: tasks
---

# Tasks - Admin QA Fixes

## T-001: Fix Listings "Invalid Date" Error

**AC**: AC-001
**Status**: [x] completed

### Fix Applied
- Added `formatDate()` helper to handle null/string/number values
- API returns string dates, frontend now parses correctly

### Files Modified
- `src/pages/admin/listings/index.astro`

---

## T-002: Fix Categories Entity Badge

**AC**: AC-002
**Status**: [x] completed

### Fix Applied
- Changed badge logic from `cat.entityType` to `currentTable`
- Now shows correct badge based on current tab selection

### Files Modified
- `src/pages/admin/categories.astro`

---

## T-003: Fix Dashboard Stats

**AC**: AC-003
**Status**: [x] completed

### Fix Applied
- Updated stats API to use new entity tables (businesses, nonProfits, publicSectors, listings)
- Removed references to old `businessPages` table

### Files Modified
- `src/pages/api/admin/stats.ts`

---

## T-004: Fix Public Sectors Title Typo

**AC**: AC-004
**Status**: [x] completed

### Fix Applied
- Fixed "PublicSectorores" → "Public Sector" in title, button, and IDs

### Files Modified
- `src/pages/admin/public-sectors.astro`

---

## T-005: Fix Media "NO GLYPH" Icon

**AC**: AC-005
**Status**: [x] completed

### Issue Status
- Browser emoji rendering issue, not code bug
- Emoji icons (📁 🖼️ 🎬 📄) are valid

### Files Modified
- No changes needed (verified emoji rendering works)

---

## T-006: Fix Status Badge/Dropdown Mismatch

**AC**: AC-006
**Status**: [x] completed

### Fix Applied
- Added `capitalizeFirst()` helper function
- Status badge now capitalizes status value for display

### Files Modified
- `src/pages/admin/non-profits.astro`
- `src/pages/admin/public-sectors.astro`

---

## Verification Task

### T-VER: Final Verification

**Status**: [x] completed

### Test Results
- ✅ Dashboard stats: 9 Users, 18 Businesses, 13 Non-Profits
- ✅ Listings date: "May 10, 2026" (no Invalid Date error)
- ✅ Categories badge: "Business" (blue) on Business tab
- ✅ Public Sectors title: "All Public Sectors" (no typo)
- ✅ Status badges: Properly capitalized