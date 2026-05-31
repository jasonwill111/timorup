# Tasks: Design Refinement

## Phase 1: Color System (US-001, US-002)

### T-001: Update Light Mode Colors in globals.css
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05 | **Status**: [x] completed

**File**: `src/styles/globals.css`

**Implementation Details**:
1. Update `--color-background` to #F5F4ED (parchment)
2. Update `--color-foreground` to #141413 (near black)
3. Update `--color-card` to #FAF9F5 (ivory)
4. Update `--color-border` to #D8D6CD (warm gray)
5. Keep `--color-primary` as #FFD150 (brand yellow)

**Test Plan**:
- **TC-001**: Homepage background is warm parchment
- **TC-002**: Primary text has 4.5:1+ contrast ratio

---

### T-002: Update Dark Mode Colors in globals.css
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05 | **Status**: [x] completed

**File**: `src/styles/globals.css`

**Implementation Details**:
1. Update `--color-background` to #0F1A2E (deep navy)
2. Update `--color-foreground` to #E8E6DC (warm ivory)
3. Update `--color-card` to #152236 (navy card)
4. Update `--color-muted-foreground` to #8B95A5 (blue-gray)
5. Fix button visibility in dark mode

**Test Plan**:
- **TC-003**: Dark mode uses deep navy background
- **TC-004**: Button text visible on hover in dark mode

---

## Phase 2: Typography (US-003)

### T-003: Download and Install Fonts Locally
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Files**: `src/fonts/NunitoSans-*.woff2`, `src/fonts/PlusJakartaSans-*.woff2`

**Implementation Details**:
1. Download Nunito Sans (Regular, SemiBold, Bold) WOFF2 files
2. Download Plus Jakarta Sans (Regular, SemiBold, Bold, ExtraBold) WOFF2 files
3. Store in `src/fonts/` directory
4. Add @font-face declarations to globals.css

**Test Plan**:
- **TC-005**: Fonts load from local /fonts/ directory
- **TC-006**: No external font requests (Google Fonts CDN)

---

### T-004: Update Font Variables in CSS
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-04, AC-US3-05 | **Status**: [x] completed

**File**: `src/styles/globals.css`

**Implementation Details**:
1. Add `--font-body: 'Nunito Sans', sans-serif`
2. Add `--font-heading: 'Plus Jakarta Sans', sans-serif`
3. Update body font-family to use --font-sans
4. Update homepage hero to use --font-heading

**Test Plan**:
- **TC-007**: Body text uses Nunito Sans
- **TC-008**: Headings use Plus Jakarta Sans
- **TC-009**: Line height is 1.5-1.75 for body text

---

### T-005: Update Layout.astro Body Font
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**File**: `src/layouts/Layout.astro`

**Implementation Details**:
1. Change `font-inter` to `font-sans` in body class
2. Remove Inter font declarations

**Test Plan**:
- **TC-010**: Body font renders as Nunito Sans

---

## Phase 3: Motion Cleanup (US-004)

### T-006: Remove Scroll-Triggered Animations
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02 | **Status**: [x] completed

**Files**: `src/lib/motion-utils.ts`, `src/pages/index.astro`

**Implementation Details**:
1. Remove sectionReveal function
2. Remove textReveal function
3. Update homepage script to remove fadeInUp calls
4. Remove data-parallax attribute

**Test Plan**:
- **TC-011**: No scroll-triggered animations
- **TC-012**: No text reveal on page load

---

### T-007: Simplify Hover Effects
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [x] completed

**Files**: `src/pages/index.astro`, `src/pages/businesses/index.astro`

**Implementation Details**:
1. Remove hover:scale from card elements
2. Remove hover:glow effects
3. Keep only hover:shadow for subtle feedback

**Test Plan**:
- **TC-013**: Cards only show shadow on hover, no scale
- **TC-014**: No animation jitter on hover

---

### T-008: Add prefers-reduced-motion Check
**User Story**: US-004 | **Satisfies ACs**: AC-US4-05 | **Status**: [x] completed

**File**: `src/lib/css-animations.ts` (formerly `motion-utils.ts`)

**Implementation Details**:
1. Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before animations
2. Return early if motion is reduced
3. Update globals.css reduced-motion rules

**Test Plan**:
- **TC-015**: Animations disabled when prefers-reduced-motion is set

---

## Phase 4: Button Consistency (US-005)

### T-009: Fix Homepage CTA Buttons
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01, AC-US5-02, AC-US5-03 | **Status**: [x] completed

**File**: `src/pages/index.astro`

**Implementation Details**:
1. Update "List Your Business" button with dark mode styles
2. Update "Create Your Business Page" button to solid amber
3. Remove gradient and scale hover effects

**Test Plan**:
- **TC-016**: Ghost button has visible border in dark mode
- **TC-017**: CTA button uses solid background (no gradient)

---

### T-010: Update Explore Section Cards
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01 | **Status**: [x] completed

**File**: `src/pages/index.astro`

**Implementation Details**:
1. Use consistent amber-700 background for all cards
2. Remove group-hover animations
3. Use amber-600 for icon backgrounds

**Test Plan**:
- **TC-018**: All four explore cards have consistent amber theme

---

## Phase 5: Documentation

### T-011: Update Design Context
**User Story**: All | **Satisfies ACs**: All | **Status**: [x] completed

**Files**: `.impeccable.md`, `CLAUDE.md`

**Implementation Details**:
1. Update typography section with new fonts
2. Update color system with new values
3. Add motion guidelines

**Test Plan**:
- **TC-019**: .impeccable.md reflects current design state
- **TC-020**: CLAUDE.md includes typography section

---

## Verification Summary

| Test Category | Tests | Status |
|--------------|-------|--------|
| Color System | 4 | ✅ Pass |
| Typography | 6 | ✅ Pass |
| Motion | 5 | ✅ Pass |
| Buttons | 3 | ✅ Pass |
| Documentation | 2 | ✅ Pass |
| **Total** | **20** | **20 ✅** |