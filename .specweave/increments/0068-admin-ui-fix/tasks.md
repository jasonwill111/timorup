# Tasks: Admin UI Fix

## Phase 1: Categories formFields Support

### T-001: Add formFields to Categories Form
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03 | **Status**: [x] completed

**File**: `src/pages/admin/categories.astro`

**Implementation Details**:
1. Add formFields textarea to category edit/create form
2. Only show for listing_categories and product_categories
3. Parse/validate JSON input
4. Save formFields to database

**Test Plan**:
- **TC-001**: Form shows formFields for listing_categories
  - Given editing a listing_category
  - When form renders
  - Then formFields textarea is visible

- **TC-002**: Form shows formFields for product_categories
  - Given editing a product_category
  - When form renders
  - Then formFields textarea is visible

- **TC-003**: Form hides formFields for other categories
  - Given editing business_category
  - When form renders
  - Then formFields textarea is hidden

---

### T-002: Display formFields in Category List
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed

**Implementation Details**:
1. Show formFields preview in category list table
2. Display as truncated JSON or field count

**Test Plan**:
- **TC-004**: List shows formFields info
  - Given categories with formFields set
  - When category list renders
  - Then formFields info is displayed

---

## Phase 2: Products Page Cleanup

### T-003: Remove deprecated businessPageId reference
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed

**File**: `src/pages/admin/products.astro`

**Implementation Details**:
1. Remove any display of businessPageId field
2. Keep businessId (valid field)

**Test Plan**:
- **TC-005**: businessPageId not displayed
  - Given viewing a product
  - When product details render
  - Then businessPageId is not shown

---

### T-004: Replace serviceType with productType
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Implementation Details**:
1. Change dropdown label from "Service Type" to "Product Type"
2. Use productType field only
3. Remove serviceType options from dropdown

**Test Plan**:
- **TC-006**: Dropdown shows productType
  - Given editing a product
  - When form renders
  - Then dropdown label is "Product Type"
  - And options are product type values

---

### T-005: Keep businessId field visible
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Implementation Details**:
1. Ensure businessId is displayed in product form
2. Show business name for reference

**Test Plan**:
- **TC-007**: businessId displayed
  - Given viewing a product
  - When product details render
  - Then businessId and business name are shown

---

## Phase 3: Route Deployment & Testing

### T-006: Deploy to Cloudflare Workers
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Implementation Details**:
1. Run `pnpm deploy` to deploy renamed pages
2. Verify new routes accessible on production

**Test Plan**:
- **TC-008**: /admin/orders accessible
  - Given deployment complete
  - When GET /admin/orders with auth
  - Then returns 200 with Orders page

- **TC-009**: /admin/products accessible
  - Given deployment complete
  - When GET /admin/products with auth
  - Then returns 200 with Products page

- **TC-010**: /admin/ad-banners accessible
  - Given deployment complete
  - When GET /admin/ad-banners with auth
  - Then returns 200 with Ad Banners page

---

### T-007: Update AdminLayout Sidebar Links
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01 | **Status**: [x] completed

**File**: `src/layouts/AdminLayout.astro`

**Implementation Details**:
1. Verify all sidebar nav links use correct paths:
   - /admin/orders (not /admin/subscriptions)
   - /admin/products (not /admin/skus)
   - /admin/ad-banners (not /admin/heroes)

**Test Plan**:
- **TC-011**: Sidebar links correct
  - Given AdminLayout renders
  - When nav links render
  - Then links point to correct routes

---

### T-008: Update Dashboard Links
**User Story**: US-004 | **Satisfies ACs**: AC-US4-02 | **Status**: [x] completed

**File**: `src/pages/admin/index.astro`

**Implementation Details**:
1. Find all links to old routes
2. Update to new route paths

**Test Plan**:
- **TC-012**: Dashboard links correct
  - Given Dashboard renders
  - When stats cards with links render
  - Then links point to correct routes

---

## Phase 4: Final Verification

### T-009: End-to-End Navigation Test
**User Story**: All | **Satisfies ACs**: All | **Status**: [x] completed

**Implementation Details**:
1. Login to admin
2. Navigate all admin pages
3. Verify no broken links

**Test Plan**:
- **TC-013**: All pages accessible
  - Given logged in as admin
  - When navigating via sidebar
  - Then all pages load without 404

---

## Execution Order

1. T-006: Deploy (unblock testing)
2. T-007: Update AdminLayout sidebar
3. T-008: Update Dashboard links
4. T-001: Add formFields to categories form
5. T-002: Display formFields in list
6. T-003: Remove businessPageId reference
7. T-004: Replace serviceType with productType
8. T-005: Keep businessId visible
9. T-009: End-to-end test

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/layouts/AdminLayout.astro` | Update nav links |
| `src/pages/admin/index.astro` | Update dashboard links |
| `src/pages/admin/categories.astro` | Add formFields support |
| `src/pages/admin/products.astro` | Clean up deprecated fields |