# Tasks: UI Color & Layout Refresh

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

---

## US-001: Unified Color Theme

### T-001: Update primary color to #FFD700
**Satisfies AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04

**Implementation**:
1. Edit `src/styles/globals.css`
2. Change `--color-primary` from `#FFD150` to `#FFD700`
3. Change `--color-brand-500` from `#FFD150` to `#FFD700`
4. Update all brand color scale (`brand-100` through `brand-950`)

**Test Plan**:
- **File**: Visual inspection via browser
- **TC-001**: Primary color visibility
  - Given light mode is active
  - When viewing any primary-colored element (buttons, links)
  - Then color appears as vibrant gold `#FFD700`

**Dependencies**: None
**Status**: [x] ✅

---

### T-002: Update dark mode primary
**Satisfies AC**: AC-US1-02

**Implementation**:
1. In `.dark` class of `globals.css`
2. Ensure `--color-primary` and `--color-ring` use `#FFD700`

**Test Plan**:
- **TC-001**: Dark mode primary
  - Given dark mode is active
  - When viewing any primary-colored element
  - Then color appears as vibrant gold `#FFD700`

**Dependencies**: T-001
**Status**: [x] ✅

---

## US-002: Dark Theme Background

### T-003: Update dark background colors
**Satisfies AC**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04

**Implementation**:
1. Update `--color-background` to `#1E1E2E`
2. Update `--color-card` to `#2A2A3E`
3. Update `--color-muted` to `#33334D`
4. Update `--color-border` to `#3A3A4E`
5. Update `--color-secondary` to `#2A2A3E`
6. Update `--color-accent` to `#33334D`

**Test Plan**:
- **TC-001**: Dark background
  - Given dark mode is active
  - When viewing the page background
  - Then background appears as `#1E1E2E`

- **TC-002**: Card surfaces
  - Given dark mode is active
  - When viewing cards
  - Then card background appears as `#2A2A3E`

**Dependencies**: T-001
**Status**: [x] ✅

---

## US-003: Enhanced Card Styling

### T-004: Update Card component
**Satisfies AC**: AC-US3-01, AC-US3-02, AC-US3-03

**Implementation**:
1. Edit `src/components/ui/Card.astro`
2. Add `rounded-xl` to card class
3. Add `shadow-sm` for default shadow
4. Add Tailwind classes for hover: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`

**Test Plan**:
- **TC-001**: Card corners
  - Given a Card component is rendered
  - When viewing the card
  - Then corners appear as rounded-xl (16px)

- **TC-002**: Card hover
  - Given a Card component is rendered
  - When hovering over the card
  - Then card lifts slightly and shadow increases

**Dependencies**: T-001
**Status**: [x] ✅

---

### T-005: Update business listing cards
**Satisfies AC**: AC-US3-04

**Implementation**:
1. Edit business listing pages (`src/pages/businesses/index.astro`, etc.)
2. Apply card hover styling classes

**Test Plan**:
- **TC-001**: Business card grid
  - Given business listing page is loaded
  - When viewing business cards
  - Then all cards have consistent rounded-xl styling

**Dependencies**: T-004
**Status**: [x] ✅

---

## US-004: Improved Search Design

### T-006: Redesign header search
**Satisfies AC**: AC-US4-01, AC-US4-02, AC-US4-03, AC-US4-04

**Implementation**:
1. Edit `src/components/Header.astro`
2. Update search input styling:
   - Add `rounded-full`
   - Add `px-6 py-3` padding
   - Add `shadow-md` for floating effect
3. Add search icon (using Lucide `Search` icon)

**Test Plan**:
- **TC-001**: Search rounded corners
  - Given the search input is rendered
  - When viewing the search box
  - Then it appears as rounded-full pill shape

- **TC-002**: Search shadow
  - Given the search input is rendered
  - When viewing the search box
  - Then it has a subtle shadow for floating effect

**Dependencies**: T-001
**Status**: [x] ✅

---

## US-005: Pill-Style Category Tags

### T-007: Update category tag styling
**Satisfies AC**: AC-US5-01, AC-US5-02, AC-US5-03, AC-US5-04

**Implementation**:
1. Create or update tag/category component
2. Apply `rounded-full px-4 py-2` classes
3. Add selected state: `bg-primary text-primary-foreground`
4. Use `flex-wrap` for mobile responsiveness

**Test Plan**:
- **TC-001**: Tag pill shape
  - Given a category tag is rendered
  - When viewing the tag
  - Then it appears as rounded-full pill

- **TC-002**: Selected tag
  - Given a category tag is selected
  - When viewing the selected tag
  - Then it shows primary color background

**Dependencies**: T-001
**Status**: [x] ✅

---

## US-006: Admin Sidebar Navigation

### T-008: Update AdminLayout sidebar
**Satisfies AC**: AC-US6-01, AC-US6-02, AC-US6-03, AC-US6-04

**Implementation**:
1. Edit `src/layouts/AdminLayout.astro`
2. Update sidebar background to `#1E1E2E`
3. Add Lucide icons to nav items
4. Style active nav item with `bg-primary/10 text-primary`
5. Add mobile collapse functionality

**Test Plan**:
- **TC-001**: Sidebar background
  - Given admin page is loaded
  - When viewing the sidebar
  - Then sidebar background appears as `#1E1E2E`

- **TC-002**: Active nav item
  - Given user is on dashboard page
  - When viewing sidebar navigation
  - Then Dashboard item is highlighted with primary color

**Dependencies**: T-001
**Status**: [x] ✅

---

## US-007: Unified Typography

### T-009: Verify font consistency
**Satisfies AC**: AC-US7-01, AC-US7-02, AC-US7-03

**Implementation**:
1. Verify Inter font loads for body text
2. Verify Oswald font loads for headings
3. Ensure `font-oswald` class applied to headings

**Test Plan**:
- **TC-001**: Heading font
  - Given a page with headings
  - When viewing h1, h2, h3 elements
  - Then they use Oswald font family

- **TC-002**: Body font
  - Given a page with body text
  - When viewing paragraph elements
  - Then they use Inter font family

**Dependencies**: None
**Status**: [x] ✅

---

## Verification

### T-010: Build verification
**Implementation**:
1. Run `pnpm build`
2. Verify no CSS errors

**Test Plan**:
- **TC-001**: Build success
  - Given code changes are complete
  - When running `pnpm build`
  - Then build completes without errors

**Dependencies**: T-001, T-003, T-004, T-006, T-007, T-008, T-009
**Status**: [x] ✅

---

### T-011: Visual regression check
**Implementation**:
1. Start dev server
2. Capture screenshots of key pages
3. Compare with design reference

**Pages to verify**:
- Homepage
- Businesses listing
- Business detail page
- Admin dashboard
- Admin businesses page

**Dependencies**: T-010
**Status**: [x] ✅

**Verification Screenshots**:
- Homepage: homepage.png ✅
- Businesses listing: businesses.png ✅
- Admin dashboard: admin-dashboard.png ✅

**Visual Check Results**:
- Primary color #FFD700: ✅
- Dark theme background #1E1E2E: ✅
- Card rounded-xl: ✅
- Search rounded-full: ✅
- Admin sidebar dark: ✅
