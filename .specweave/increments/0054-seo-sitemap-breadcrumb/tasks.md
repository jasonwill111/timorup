# Tasks: SEO Sitemap & Breadcrumb

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Sitemap Generator

### T-001: Create sitemap.xml.ts endpoint
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05 | **Status**: [x] completed

**Description**: Create SSR endpoint that queries D1 for all public entities and generates valid XML sitemap.

**Implementation Details**:
1. Create `src/pages/sitemap.xml.ts`
2. Import getDb() from src/lib/db
3. Query businesses (status='active'), non_profits, public_sectors, listings
4. Generate XML with proper XML declaration and urlset namespace
5. Set Content-Type: application/xml header
6. Add static pages: homepage, about, contact, pricing, faq, blog

**Test Plan**:
- **File**: `e2e/seo.spec.ts`
- **Tests**:
  - **TC-001**: Sitemap returns valid XML
  - **TC-002**: Sitemap includes all entity types
  - **TC-003**: Sitemap has lastmod for each entry

**Dependencies**: None
**Model**: opus

---

### T-002: Add changefreq and priority to sitemap
**User Story**: US-001 | **Satisfies ACs**: AC-US1-05 | **Status**: [x] completed

**Description**: Add changefreq and priority attributes based on page type.

**Test Plan**:
- **File**: `e2e/seo.spec.ts`
- **Tests**:
  - **TC-004**: Homepage has priority 1.0

**Dependencies**: T-001
**Model**: haiku

---

## Phase 2: Breadcrumb Helper

### T-003: Create src/lib/seo.ts with breadcrumb function
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05 | **Status**: [x] completed

**Description**: Create reusable helper function for BreadcrumbList JSON-LD schema.

**Implementation Details**:
1. Create `src/lib/seo.ts`
2. Export `BreadcrumbItem` interface
3. Export `createBreadcrumbSchema(items: BreadcrumbItem[])` function
4. Function returns proper schema.org BreadcrumbList object

**Test Plan**:
- **File**: `tests/unit/seo.test.ts` (new)
- **Tests**:
  - **TC-005**: createBreadcrumbSchema returns valid JSON-LD
  - **TC-006**: Items have correct position numbers
  - **TC-007**: Last item has no item property

**Dependencies**: None
**Model**: haiku

---

## Phase 3: Detail Pages

### T-004: Add breadcrumb to business/[slug].astro
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed

**Description**: Add BreadcrumbList JSON-LD script to business detail page.

**Test Plan**:
- **File**: `e2e/seo.spec.ts`
- **Tests**:
  - **TC-008**: Business page has BreadcrumbList

**Dependencies**: T-003
**Model**: haiku

---

### T-005: Add breadcrumb to non-profit/[slug].astro
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Description**: Add BreadcrumbList JSON-LD script to non-profit detail page.

**Test Plan**:
- **Tests**:
  - **TC-009**: Non-profit page has BreadcrumbList

**Dependencies**: T-003
**Model**: haiku

---

### T-006: Add breadcrumb to public-sector/[slug].astro
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Description**: Add BreadcrumbList JSON-LD script to public sector detail page.

**Test Plan**:
- **Tests**:
  - **TC-010**: Public sector page has BreadcrumbList

**Dependencies**: T-003
**Model**: haiku

---

### T-007: Add breadcrumb to product detail page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04 | **Status**: [x] completed

**Description**: Add BreadcrumbList JSON-LD script to product detail page.

**Implementation Details**:
1. Update `src/pages/business/[slug]/product/[id]/index.astro`
2. Breadcrumb: Home > Businesses > [Business] > Products > [Product Name]

**Test Plan**:
- **Tests**:
  - **TC-011**: Product page has BreadcrumbList with 5 items

**Dependencies**: T-003
**Model**: haiku

---

### T-008: Add breadcrumb to blog/[slug].astro
**User Story**: US-002 | **Satisfies ACs**: AC-US2-05 | **Status**: [ ] pending

**Description**: Add BreadcrumbList JSON-LD script to blog article page.

**Test Plan**:
- **Tests**:
  - **TC-012**: Blog page has BreadcrumbList with 3 items

**Dependencies**: T-003
**Model**: haiku

---

## Phase 4: E2E Testing

### T-009: Create e2e/seo.spec.ts with all SEO tests
**User Story**: US-001, US-002 | **Satisfies ACs**: All | **Status**: [x] completed

**Description**: Create comprehensive E2E test file for sitemap and breadcrumb.

**Implementation Details**:
1. Create `e2e/seo.spec.ts`
2. Add tests for sitemap XML validity
3. Add tests for breadcrumb on all detail page types
4. Test with actual URLs from test data

**Test Plan**:
- **File**: `e2e/seo.spec.ts`
- Run: `npx playwright test e2e/seo.spec.ts`

**Dependencies**: T-001, T-003, T-004, T-005, T-006, T-007, T-008
**Model**: opus

---

### T-010: Update robots.txt to point to correct sitemap
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed

**Description**: Verify robots.txt points to `/sitemap.xml` (not sitemap-index.xml).

**Test Plan**:
- **Tests**:
  - **TC-013**: robots.txt points to correct sitemap URL

**Dependencies**: T-001
**Model**: haiku

---

## Summary

| Task | Status | Dependencies |
|------|--------|--------------|
| T-001: sitemap.xml.ts | [x] completed | - |
| T-002: changefreq/priority | [x] completed | T-001 |
| T-003: seo.ts helper | [x] completed | - |
| T-004: business breadcrumb | [x] completed | T-003 |
| T-005: non-profit breadcrumb | [x] completed | T-003 |
| T-006: public-sector breadcrumb | [x] completed | T-003 |
| T-007: product breadcrumb | [x] completed | T-003 |
| T-008: blog breadcrumb | [ ] pending | T-003 |
| T-009: e2e tests | [x] completed | all above |
| T-010: robots.txt | [x] completed | T-001 |