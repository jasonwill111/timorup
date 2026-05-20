# Tasks: Loading States & Color Contrast Fix (0073)

## US-001: Skeleton Loading States

### T-001: Add skeleton loading to /businesses page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given user visits /businesses page with slow network When page starts loading Then 12 skeleton cards with `bg-muted animate-pulse` classes appear matching BusinessCard dimensions
- **TC-002**: Given skeleton cards are displayed When real content finishes loading Then skeletons are replaced without layout shift
- **TC-003**: Given skeleton variant is used When inspecting DOM Then class matches existing Skeleton.astro component pattern (`bg-muted rounded animate-pulse`)

### T-002: Add skeleton loading to /non-profits page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given user visits /non-profits page with slow network When page starts loading Then 12 skeleton cards appear matching entity card layout
- **TC-002**: Given skeleton cards are displayed When real content finishes loading Then skeletons are replaced without layout shift
- **TC-003**: Given skeleton uses bg-muted animate-pulse When inspected in DevTools Then matches existing Skeleton.astro component classes

### T-003: Add skeleton loading to /public-sectors page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03, AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given user visits /public-sectors page with slow network When page starts loading Then 12 skeleton cards appear with matching dimensions
- **TC-002**: Given skeleton cards are displayed When real content finishes loading Then skeletons are replaced without CLS
- **TC-003**: Given skeleton uses existing Skeleton.astro utilities When rendering Then consistent class usage across all list pages

### T-004: Add skeleton loading to /listings page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04, AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given /listings page is created When loading Then 12 skeleton cards render in grid layout
- **TC-002**: Given skeleton cards use bg-muted animate-pulse When viewed in dark mode Then visible against dark background
- **TC-003**: Given skeleton matches ListingCard dimensions When real data loads Then no visible layout shift

### T-005: Add skeleton loading to /products-services page
**User Story**: US-001 | **Satisfies ACs**: AC-US1-05, AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given user visits /products-services page When initial render begins Then 12 skeleton product cards appear in grid
- **TC-002**: Given skeleton cards render in client-side JS grid When inspected Then each has aspect-square bg-muted animate-pulse structure
- **TC-003**: Given products use productCardSkeleton() utility When data arrives Then smooth transition from skeleton to content

---

## US-002: Dark Mode Contrast Fix

### T-006: Fix dark mode muted-foreground contrast
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given dark mode is active When measuring contrast of `--color-muted-foreground` against `--color-background` (#09090b) Then contrast ratio is >= 4.5:1 (WCAG AA)
- **TC-002**: Given current value is #a1a1aa When tested against #09090b background Then contrast ratio = ~3.2:1 (FAILS WCAG AA)
- **TC-003**: Given new value is set in globals.css dark mode block When recalculated Then value >= #71717a (zinc-500) for 4.5:1

### T-007: Verify muted-foreground usage across components
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given business card has location text with text-muted-foreground When viewed in dark mode Then text is readable and meets 4.5:1
- **TC-002**: Given card has category label with text-muted-foreground When viewed in dark mode Then sufficient contrast against card background
- **TC-003**: Given any text uses text-muted-foreground class When in dark mode Then all instances verified readable

### T-008: Ensure light mode muted-foreground unchanged
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given light mode is active When checking --color-muted-foreground Then value remains #52525b (zinc-600) providing ~7:1 contrast
- **TC-002**: Given dark mode update is applied When light mode renders Then no visual regression in text contrast

---

## US-003: Card Hover Enhancement

### T-009: Update BusinessCard hover styles
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given BusinessCard is rendered in browser When user hovers over card Then border changes from `border-primary/30` to `border-primary/60`
- **TC-002**: Given BusinessCard is rendered in browser When user hovers over card Then shadow changes from `shadow-sm hover:shadow-md` to `shadow-sm hover:shadow-lg`
- **TC-003**: Given BusinessCard has both hover transitions When inspected in DevTools Then both style changes are visible in computed styles

### T-010: Update inline card styles in /businesses page
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given /businesses page inline cards When user hovers over any card Then border becomes `border-primary/60`
- **TC-002**: Given /businesses page inline cards When user hovers over any card Then shadow becomes `hover:shadow-lg`
- **TC-003**: Given /businesses page inline cards When inspected Then hover classes match updated spec

### T-011: Update inline card styles in /non-profits page
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given /non-profits page inline cards When user hovers over any card Then border becomes `border-primary/60`
- **TC-002**: Given /non-profits page inline cards When user hovers over any card Then shadow becomes `hover:shadow-lg`
- **TC-003**: Given /non-profits page inline cards When inspected Then hover classes match BusinessCard standards

### T-012: Update inline card styles in /public-sectors page
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given /public-sectors page inline cards When user hovers over any card Then border becomes `border-primary/60`
- **TC-002**: Given /public-sectors page inline cards When user hovers over any card Then shadow becomes `hover:shadow-lg`
- **TC-003**: Given /public-sectors page inline cards When inspected Then consistent with other entity cards

### T-013: Update product card hover styles in /products-services page
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given /products-services page product cards in JS When user hovers over any card Then border becomes `border-primary/60`
- **TC-002**: Given /products-services page product cards in JS When user hovers over any card Then shadow becomes `hover:shadow-lg`
- **TC-003**: Given /products-services page product cards When inspected in DOM Then consistent with entity card hover styles

---

## US-004: BusinessCard Full Star Rating Display

### T-014: Add 5-star SVG icon row to BusinessCard
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given BusinessCard has rating > 0 When rendered Then 5 star SVG icons display in a row
- **TC-002**: Given BusinessCard has rating = 0 When rendered Then no star row displays
- **TC-003**: Given BusinessCard has rating = 3.5 When rendered Then 3 filled + 2 empty stars display

### T-015: Apply correct star colors based on filled/empty state
**User Story**: US-004 | **Satisfies ACs**: AC-US4-02
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given star is filled (n <= rating) When rendered Then color is `text-amber-400 fill-amber-400`
- **TC-002**: Given star is empty (n > rating) When rendered Then color is `text-gray-300 fill-gray-300` in light mode
- **TC-003**: Given star is empty in dark mode When rendered Then color is `dark:text-gray-600` for dark mode compatibility

### T-016: Display rating badge with stars and numeric value
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given business has rating 4.5 with 23 reviews When card renders Then badge shows "4.5 (23 reviews)"
- **TC-002**: Given business has rating 5.0 with 0 reviews When card renders Then numeric display shows "5.0" without review count
- **TC-003**: Given rating badge is displayed When inspected Then both star icons and text content visible

### T-017: Ensure star display scales on mobile and desktop
**User Story**: US-004 | **Satisfies ACs**: AC-US4-04
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given BusinessCard on mobile viewport (<640px) When stars render Then size is smaller (text-xs equivalent)
- **TC-002**: Given BusinessCard on desktop viewport (>=640px) When stars render Then size is standard (text-sm equivalent)
- **TC-003**: Given responsive classes are applied When browser resized Then star size adapts without breaking layout
