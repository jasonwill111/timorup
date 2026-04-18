# Tasks: 0002-p0-compliance-fix

**Increment**: 0002-p0-compliance-fix
**Generated**: 2026-03-23
**Test Mode**: TDD (Red -> Green -> Refactor)
**Coverage Target**: Unit 95%, Integration 90%, E2E 100% of AC scenarios

---

## Phase 1: Public Settings API (US-001 foundation)

### T-001: Create `GET /api/settings/public` endpoint
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03
**Status**: [x] Completed (GREEN ✅ — 3/3 tests pass)

---

### T-002: Write unit tests for `GET /api/settings/public` (RED)
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03
**Status**: [x] Completed (RED ✅ — 3 tests written first, then T-001 implemented)

**Test**: Given the site settings table has `payment_qr` set to a valid URL (`"https://r2.example.com/qr.png"`) → When a GET request is made to `/api/settings/public` → Then the response status is 200 and body is `{ success: true, data: { payment_qr: "https://r2.example.com/qr.png" } }`

**Test**: Given the site settings table has no `payment_qr` key (row does not exist) → When a GET request is made to `/api/settings/public` → Then the response status is 200 and body is `{ success: true, data: { payment_qr: null } }` (not an error)

**Test**: Given the DB throws an error during the select query → When a GET request is made to `/api/settings/public` → Then the response status is 500 and body is `{ success: false, error: { message: "..." } }`

**Implementation Notes**:
- File: `src/pages/api/settings/public/index.test.ts`
- Use Vitest
- Mock `db.select().from(siteSettings).where(...)` to return controlled data
- Test both null-result and populated-result cases
- Mock `c.env` for Cloudflare Workers runtime context

**Dependencies**: T-001

---

## Phase 2: Subscribe Page Dynamic QR (US-001)

### T-003: Update `subscribe.astro` to fetch QR from API with placeholder UX
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, NFR-QR-01, NFR-QR-02
**Status**: [x] Completed

**Description**:
Replace the hardcoded `<img id="qr-code" src="/images/payment-qr.png">` in `src/pages/subscribe.astro` with dynamic fetching from `/api/settings/public`. Add a loading skeleton state, null/empty handling with a user-friendly placeholder, and `loading="lazy"` on the img tag.

**Implementation Notes**:
- File: `src/pages/subscribe.astro`
- In the `<script>` block, on DOMContentLoaded fetch `/api/settings/public`
- Loading state: show a gray pulsing skeleton div (matching the size of the QR area) while fetching — NFR-QR-02
- Null/empty state (`payment_qr === null || payment_qr === ''`): replace the QR section with `<p class="text-muted-foreground text-sm py-4">Payment QR code not yet configured. Please contact us for payment details.</p>`
- Configured state: render `<img>` inside the existing div with `loading="lazy"` and `class="w-48 h-48 object-contain"` — NFR-QR-01
- The rest of the subscribe page (plan display, WhatsApp link, confirmation card) remains unchanged
- AC-US1-04 is satisfied passively — the existing admin settings API at `src/pages/api/admin/settings/index.ts` already handles saving `payment_qr` via the PUT/POST methods; this task does not modify it

**Dependencies**: T-001

---

### T-004: Write E2E test for subscribe page QR behavior
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, NFR-QR-01, NFR-QR-02
**Status**: [x] Done (GREEN ✅ — 8/8 tests pass)

**Test**: Given the subscribe page is loaded → When the API returns `{ success: true, data: { payment_qr: null } }` → Then the QR `<img>` element is not rendered and the placeholder text "Payment QR code not yet configured" is visible

**Test**: Given the subscribe page is loaded → When the API returns `{ success: true, data: { payment_qr: "https://r2.example.com/qr.png" } }` → Then the QR `<img>` element is visible with `src` equal to that URL and the `loading` attribute is `"lazy"`

**Test**: Given the subscribe page is loaded → When the `/api/settings/public` request is still in flight → Then a skeleton/loading placeholder is visible in the QR area

**Test**: Given the subscribe page is loaded → When the API returns `{ success: true, data: { payment_qr: "" } }` (empty string) → Then the placeholder message is shown (not the broken empty img)

**Implementation Notes**:
- File: `tests/e2e/subscribe.spec.ts` (Playwright)
- Use `page.route('/api/settings/public', ...)` to intercept and mock responses
- Assert visibility and absence of elements using Playwright locators
- Cover all three render states: loading skeleton, null placeholder, configured img

**Dependencies**: T-003

---

## Phase 3: Geo Utility + Create Page (US-002)

### T-005: Create `src/lib/geo.ts` with debounced Nominatim geocoding
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-06, NFR-GEO-01, NFR-GEO-02
**Status**: [x] Completed (GREEN ✅ — 6/6 tests pass)

**Description**:
Create the centralized geocoding utility at `src/lib/geo.ts` that encapsulates all Nominatim API calls. Implements 1100ms debouncing, `User-Agent` header, and Timor-Leste query suffix. This module must be client-side compatible (no Node-only APIs) so it can be imported directly in Astro `<script>` blocks.

**Implementation Notes**:
- File: `src/lib/geo.ts`
- Export: `geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null>`
- Internal state: `lastCallTime` (number, milliseconds from `Date.now()`)
- Minimum interval: 1100ms between actual network requests
- If called before 1100ms has elapsed since the last call: wait out the remaining time, then fire the request (do not skip or ignore — block to respect rate limit)
- URL: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Timor-Leste')}` — NFR-GEO-02
- Headers: `{ 'User-Agent': 'TMBIZ/1.0' }` — NFR-GEO-01 (Nominatim requires this)
- Parse `result[0].lat` and `result[0].lon` from JSON response
- Network error (fetch throws): return `null`
- Zero-length results array: return `null`
- Export result type: `GeocodeResult = { lat: number; lng: number } | null`
- No server-only imports — uses only standard browser APIs (`fetch`, `Promise`, `Date`)

**Dependencies**: None (greenfield)

---

### T-006: Write unit tests for `src/lib/geo.ts`
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-06, NFR-GEO-01, NFR-GEO-02
**Status**: [x] Completed (RED ✅ — 6 tests written first, then T-005 implemented)

**Test**: Given `geocodeAddress("Aileu, Timor-Leste")` is called → When Nominatim returns `[{"lat": "-8.4", "lon": "125.6"}]` → Then the promise resolves to `{ lat: -8.4, lng: 125.6 }`

**Test**: Given `geocodeAddress("NonExistentPlaceXYZ999")` is called → When Nominatim returns `[]` → Then the promise resolves to `null`

**Test**: Given `geocodeAddress("Dili")` is called twice within 500ms → When both calls fire → Then the second call waits at least 1100ms before sending the actual network request (debounce blocking)

**Test**: Given `geocodeAddress("Dili")` is called → When the Nominatim fetch fails with a network error → Then the promise resolves to `null`

**Test**: Given `geocodeAddress("Dili")` is called → When the fetch request is made → Then the request includes header `User-Agent: TMBIZ/1.0` — NFR-GEO-01

**Test**: Given `geocodeAddress("Dili")` is called → When the fetch request URL is inspected → Then the `q` parameter is `Dili%2C%20Timor-Leste` (Timor-Leste suffix encoded) — NFR-GEO-02

**Implementation Notes**:
- File: `src/lib/geo.test.ts`
- Use Vitest with `vi.spyOn(globalThis, 'fetch')`
- For debounce test: either use `vi.useFakeTimers()` with `vi.spyOn(Date, 'now')`, or call `geocodeAddress` twice and check that `fetch` was called twice with 1100ms+ apart (using real timers, accept small variance)
- Verify headers object in the fetch call for NFR-GEO-01

**Dependencies**: T-005

---

### T-007: Update `business/create.astro` to use `src/lib/geo.ts`
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03, AC-US2-04, AC-US2-05, AC-US2-06, NFR-GEO-01, NFR-GEO-02
**Status**: [x] Completed

**Description**:
Refactor the existing inline Nominatim fetch call in `create.astro`'s `<script>` block to use the centralized `geocodeAddress()` from `src/lib/geo.ts`. Remove the inline `fetch('https://nominatim.openstreetmap.org/...')` call and wire the button handler to the new module with proper loading and error UX.

**Implementation Notes**:
- File: `src/pages/business/create.astro`
- In the `<script>` block: remove the inline `fetch('https://nominatim.openstreetmap.org/search?...')` call (lines ~627-652 of existing file)
- Import `geocodeAddress` from `src/lib/geo.ts` at the top of the `<script>` block — since the module uses only browser APIs, it works client-side without bundler issues
- Replace the button click handler body:
  - Get address from `addressInput.value`
  - If empty: `alert('Please enter an address first')` and return early
  - Set button text to `"Searching..."` and set `disabled` attribute — AC-US2-05
  - Call `geocodeAddress(address)`
  - On result `{ lat, lng }`: call `initMap()` if map not initialized, then `setMarker(lat, lng)` — AC-US2-03
  - On `null`: display user-friendly message in a `<p>` element or `alert` — AC-US2-04: `"Address not found. Please try a more specific address or enter coordinates manually."`
  - `finally`: reset button text to `"Get coordinates from address"` and remove `disabled` attribute
- The existing Leaflet map (`setMarker`, `initMap`) already handles AC-US2-03 — no map changes needed

**Dependencies**: T-005, T-006

---

## Phase 4: Edit Page + Integration Tests (US-002)

### T-008: Create `src/pages/business/[slug]/edit/index.astro`
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05, AC-US2-06, NFR-GEO-01, NFR-GEO-02
**Status**: [x] Done (file already existed with full implementation)

**Description**:
Create a new business edit page at `src/pages/business/[slug]/edit/index.astro` that mirrors the structure of `create.astro` but pre-populates all fields from existing business data. Uses the same `geocodeAddress` integration for the location section.

**Implementation Notes**:
- File: `src/pages/business/[slug]/edit/index.astro`
- Mirror the card/section HTML structure of `create.astro` (re-use the same form markup)
- Add `export const prerender = false` at the top for SSR
- In `<script>`:
  - Fetch `/api/businesses/my-business` to load existing business data
  - If no business returned: redirect to `/business/create`
  - Pre-populate all form fields: title, slug, category (set `selected` on matching option), contactName, contactNumber, email, address, aboutUs, yearOfEstablishment, tags
  - Pre-populate lat/lng fields; if both have values, call `initMap()` and `setMarker()` on load to show existing marker
  - Opening hours: populate time inputs and checkboxes from the stored hours object
  - Gallery images: call `updateGallerySlot()` for each stored image URL
  - Wire the "Get coordinates from address" button to `geocodeAddress()` from `src/lib/geo.ts` — same UX as create.astro (loading state, null message)
  - On form submit: call `PUT /api/businesses/[slug]` (check if existing `src/pages/api/businesses/[slug].ts` supports PUT; if only POST, adapt)
  - On success: redirect to `/business/[slug]`
- The slug is read from the URL param (`Astro.params.slug`) for the API call

**Dependencies**: T-005, T-007

---

### T-009: Write integration test for geocoding UX flow
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03, AC-US2-04, AC-US2-05
**Status**: [x] Done (GREEN ✅ — 5/5 tests pass)

**Test**: Given the business create page is loaded with an address field containing "Aileu" → When the user clicks "Get coordinates from address" → Then the button becomes disabled, its text changes to "Searching...", and after the Nominatim response the latitude and longitude input fields are auto-populated with numeric values and a Leaflet marker appears on the map

**Test**: Given the business create page is loaded with an address field containing "InvalidPlaceXYZ999" → When the user clicks "Get coordinates from address" → Then the button is re-enabled after the request completes and the message "Address not found. Please try a more specific address or enter coordinates manually" is displayed

**Test**: Given the edit page at `/business/my-business/edit` is loaded → When the page loads with existing business data → Then all form fields are pre-populated with the business's current values

**Test**: Given the create page is loaded → When the "Get coordinates from address" button is clicked → Then the actual Nominatim API is not called more than once within any 1100ms window (debounce enforced)

**Implementation Notes**:
- File: `tests/e2e/geo.spec.ts` (Playwright)
- Mock Nominatim responses using `page.route('https://nominatim.openstreetmap.org/**', ...)`
- Verify button disabled state with `await expect(btn).toBeDisabled()`
- Check Leaflet marker appears: `await expect(page.locator('.leaflet-marker-icon')).toBeVisible()`
- Verify lat/lng inputs have numeric values after geocoding
- For debounce test: intercept fetch calls and count them within a time window, or use `vi.useFakeTimers()` in the unit test (T-006 covers this)

**Dependencies**: T-007, T-008

---

## AC Coverage Summary

| AC-ID | Description | Covered By |
|-------|-------------|-----------|
| AC-US1-01 | Subscribe page fetches QR from API | T-003, T-004 |
| AC-US1-02 | Placeholder shown when QR not configured | T-003, T-004 |
| AC-US1-03 | Public `/api/settings/public` endpoint | T-001, T-002 |
| AC-US1-04 | Existing admin settings API still works | T-001 (passive — no changes) |
| AC-US2-01 | `geocodeAddress()` calls Nominatim | T-005, T-006 |
| AC-US2-02 | 1100ms debounce between requests | T-005, T-006 |
| AC-US2-03 | Auto-populate lat/lng and Leaflet marker | T-007, T-009 |
| AC-US2-04 | User-friendly "not found" message | T-007, T-009 |
| AC-US2-05 | Button disabled during geocoding | T-007, T-009 |
| AC-US2-06 | All geocoding logic in `src/lib/geo.ts` | T-005, T-007, T-008 |
| NFR-GEO-01 | User-Agent header `TMBIZ/1.0` | T-005, T-006 |
| NFR-GEO-02 | Timor-Leste query suffix | T-005, T-006 |
| NFR-QR-01 | QR img has `loading="lazy"` | T-003 |
| NFR-QR-02 | Subscribe page skeleton/loading state | T-003, T-004 |

---

## Phase Order & Dependency Graph

```
Phase 1: Public Settings API
  T-001: Create GET /api/settings/public        [greenfield — no deps]
  T-002: Unit tests for public settings API     [blocked by T-001]

Phase 2: Subscribe Page
  T-003: Update subscribe.astro                  [blocked by T-001]
  T-004: E2E tests for subscribe QR            [blocked by T-003]

Phase 3: Geo Utility + Create Page
  T-005: Create src/lib/geo.ts                 [greenfield — no deps, parallel with Phase 1]
  T-006: Unit tests for geo.ts                 [blocked by T-005]
  T-007: Update create.astro                   [blocked by T-005, T-006]

Phase 4: Edit Page + Integration Tests
  T-008: Create business/[slug]/edit/index.astro  [blocked by T-005]
  T-009: Integration tests for geo UX             [blocked by T-007, T-008]
```

**Parallelization opportunities**:
- T-001 and T-005 are fully independent — implement in parallel
- T-002 and T-006 are independent of each other — implement in parallel
- T-008 (edit page) can start after T-005 lands, even while T-007 (create update) is still in progress
