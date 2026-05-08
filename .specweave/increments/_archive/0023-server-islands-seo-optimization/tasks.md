# Tasks: Server Islands + SEO Optimization

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[x]`: Completed
- Model hints: haiku (simple), opus (default)

## Phase 1: Server Island Components

### US-001: Server Islands for Dynamic Content

#### T-001: Create ProductsSection Server Island
**Status**: [x] Completed

**References**: AC-US1-01, AC-US1-02

**Implementation**:
- Created `src/components/islands/ProductsSection.astro`
- Uses `server:defer="2min"` for 2-minute refresh
- Fetches products from D1 database
- Handles empty state

**Test Plan**:
- **File**: `src/pages/business/[slug].astro`
- **TC-001**: Products load correctly
  - Given business with products
  - When page renders
  - Then products display with images

#### T-002: Create BusinessSidebar Server Island
**Status**: [x] Completed

**References**: AC-US1-03

**Implementation**:
- Created `src/components/islands/BusinessSidebar.astro`
- Contains map, tags, hours components
- Ready for future `server:defer`

## Phase 2: SEO/GEO

### US-002: FAQ JSON-LD Schema

#### T-003: Verify FAQ JSON-LD
**Status**: [x] Completed

**References**: AC-US2-01, AC-US2-02

**Implementation**:
- FAQ page already has FAQPage JSON-LD
- Contains 5+ questions
- Valid schema.org structure

### US-003: CDN Cache Optimization

#### T-004: Verify CDN Cache Headers
**Status**: [x] Completed

**References**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04

**Implementation**:
- Homepage: 5min cache (middleware.ts)
- Business: 5min cache
- Listing: 2min cache
- Static: 1h cache

## Phase 3: Integration

#### T-005: Update Business Page
**Status**: [x] Completed

**References**: AC-US1-01

**Implementation**:
- Updated `src/pages/business/[slug].astro`
- Uses `<ProductsSection server:defer="2min" />`
- Imports from new islands directory

#### T-006: Run Tests
**Status**: [x] Completed

**Verification**:
```
Test Files  10 passed (10)
     Tests  177 passed (177)
```

## Summary

| Task | Status |
|------|--------|
| T-001 ProductsSection | ✅ |
| T-002 BusinessSidebar | ✅ |
| T-003 FAQ JSON-LD | ✅ |
| T-004 CDN Cache | ✅ |
| T-005 Business Page | ✅ |
| T-006 Tests | ✅ |

**All tasks completed** | **2026-05-03**