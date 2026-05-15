# Tasks: Entity Detail Pages

## Task Summary

| Task | Title | Status | US |
|------|-------|--------|-----|
| T-001 | Create Public Sector Detail Page | [x] | US-001 |
| T-002 | Fix Non-Profit Detail Page | [x] | US-002 |
| T-003 | Browser Verification | [x] | US-001, US-002 |
| T-004 | Build Verification | [x] | All |
| T-005 | Living Docs Sync | [x] | All |

## Phase 1: Implementation

### T-001: Create Public Sector Detail Page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05 | **Status**: [x] completed

**Test Plan**:
```gherkin
Given user navigates to /public-sector/ministerio-das-financas
When page loads
Then banner displays with blue gradient
And header card shows organization name and contact info
And About Us section displays
And Photo Gallery shows
And Location map displays
And Hours section displays
And Share button copies URL
And WhatsApp link opens chat
And JSON-LD includes GovernmentOrganization
```

**Implementation Notes**:
- Created `/src/pages/public-sector/[slug].astro`
- Uses `publicSectors` table with SSR
- Imports: Card, LocationMap, MediaGallery, UpdatesSection
- Color scheme: blue (GovernmentOrganization)

---

### T-002: Fix Non-Profit Detail Page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed

**Test Plan**:
```gherkin
Given user navigates to /non-profit/care-timor
When page loads
Then page uses business-style layout (not ListingHeader/ListingBanner)
And banner displays with green gradient
And header card shows organization name and contact info
And JSON-LD uses correct type based on organizationType
```

**Implementation Notes**:
- Updated `/src/pages/non-profit/[slug].astro`
- Removed ListingHeader, ListingBanner components
- Added business-style header card with inline HTML
- Color scheme: green (NGO)

---

### T-003: Browser Verification
**User Story**: US-001, US-002 | **Satisfies ACs**: All | **Status**: [x] completed

**Test Plan**:
```gherkin
Given dev server running on localhost:8787
When user opens /non-profit/care-timor
Then page title is "CARE International Timor-Leste - TimorList"
And heading displays organization name
And About Us section visible
And Share button clickable
And WhatsApp link present

Given user opens /public-sector/ministerio-das-financas
Then page title is "Ministerio das Financas - TimorList"
And heading displays organization name
And About Us section visible
And Share button clickable
And WhatsApp link present
```

**Verification Results**:
- Non-profit page: ✅ 200 OK, content renders correctly
- Public Sector page: ✅ 200 OK, content renders correctly
- Console: No errors (only [debug] astro prefetch logs)

---

### T-004: Build Verification
**User Story**: All | **Satisfies ACs**: All | **Status**: [x] completed

**Test Plan**:
```bash
pnpm build
```

**Verification Results**:
- Build completed successfully
- Build time: 27.62s

---

### T-005: Living Docs Sync
**User Story**: All | **Status**: [x] completed

**Test Plan**:
```bash
specweave sync-living-docs 0047
```

**Verification Results**:
- Feature folder: `FS-047/` created
- Files synced successfully

## Verification Summary

| Check | Result |
|-------|--------|
| Build | ✅ Pass |
| Non-Profit Detail | ✅ 200 OK |
| Public Sector Detail | ✅ 200 OK |
| Console Errors | ✅ None |
| Living Docs | ✅ Synced |