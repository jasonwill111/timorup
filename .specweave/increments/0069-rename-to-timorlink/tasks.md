# Tasks: Rename TimorLink to TimorLink

## Phase 1: Frontend Text Replacement

### T-001: Rename Page Titles
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [ ] pending

**Files**: `src/pages/**/*.astro`

**Test Plan**:
- **TC-001**: Page titles contain "TimorLink"
  - Given viewing any page
  - When page renders
  - Then title contains "TimorLink" not "TimorLink"

---

### T-002: Rename Navigation Text
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02 | **Status**: [ ] pending

**Files**: `src/components/**/*.astro`, `src/layouts/**/*.astro`

**Test Plan**:
- **TC-002**: Navigation shows "TimorLink"
  - Given viewing header/footer
  - When header/footer renders
  - Then brand name shows "TimorLink"

---

### T-003: Update Meta Tags
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [ ] pending

**Files**: `src/layouts/*.astro`, `src/pages/index.astro`

**Test Plan**:
- **TC-003**: Meta tags contain "TimorLink"
  - Given checking page source
  - When page loads
  - Then meta content shows "TimorLink"

---

## Phase 2: Backend Code Replacement

### T-004: Rename Type Definitions
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [ ] pending

**Files**: `src/types/*.ts`, `src/lib/**/*.ts`

**Test Plan**:
- **TC-004**: Type names use "TimorLink"
  - Given TypeScript compilation
  - When type checking runs
  - Then no "TimorLink" type references exist

---

### T-005: Rename Constants/Variables
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [ ] pending

**Files**: `src/lib/**/*.ts`, `src/stores/*.ts`

**Test Plan**:
- **TC-005**: Code uses "TimorLink" naming
  - Given codebase
  - When searching for "TimorLink"
  - Then only in exclusions (external services)

---

## Phase 3: Configuration Updates

### T-006: Update Wrangler Config
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [ ] pending

**Files**: `wrangler.jsonc`, `dist/server/wrangler.json`

**Test Plan**:
- **TC-006**: Wrangler uses "timorlink" name
  - Given wrangler config
  - When reading name field
  - Then value is "timorlink"

---

### T-007: Update CI/CD Workflows
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [ ] pending

**Files**: `.github/workflows/*.yml`

**Test Plan**:
- **TC-007**: Workflow names updated
  - Given CI/CD workflows
  - When checking workflow names
  - Then "timorlink" used

---

## Phase 4: Static Assets

### T-008: Update Favicon References
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01 | **Status**: [ ] pending

**Files**: `src/pages/**/*.astro`

**Test Plan**:
- **TC-008**: Favicon alt text updated
  - Given viewing any page
  - When page renders
  - Then favicon text shows "TimorLink"

---

## Phase 5: Verification

### T-009: Full Search Verification
**User Story**: All | **Satisfies ACs**: All | **Status**: [ ] pending

**Test Plan**:
- **TC-009**: No remaining "TimorLink" references
  - Given all source files
  - When searching for "TimorLink" (case insensitive)
  - Then only in exclusions (GitHub, npm, external services)

- **TC-010**: Build succeeds
  - Given running `pnpm build`
  - When build completes
  - Then build succeeds without errors

---

## Execution Order

1. T-001: Page titles â†?T-002 â†?T-003 (Frontend sequential)
2. T-004 â†?T-005 (Backend sequential)
3. T-006 â†?T-007 (Config parallel)
4. T-008 (Static assets)
5. T-009 (Verification)

---

## Files to Modify

| Category | Pattern | Replacement |
|----------|---------|-------------|
| Page titles | `TimorLink` | `TimorLink` |
| Navigation | `TimorLink` | `TimorLink` |
| Meta tags | `TimorLink` | `TimorLink` |
| Types | `TimorLink` | `TimorLink` |
| Wrangler | `TimorLink` | `timorlink` |
| Workflows | `TimorLink` | `timorlink` |

## Exclusions (Do NOT change)

- GitHub repository name: `jasonwill111/TimorLink`
- npm package name: `TimorLink` (would break installs)
- Cloudflare resources: D1 database name, R2 bucket names
- Database table/column names
- External integrations (Cloudflare workers domain)
