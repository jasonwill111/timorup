# Tasks: Lucide Icons & Motion Animation Integration

## US-001: Unified LucideIcon Component

### T-001: Create LucideIcon.astro Foundation Component
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given a page importing LucideIcon When `<LucideIcon name="Heart" size={16} />` is rendered Then an SVG with viewBox="0 0 24 24" and width/height="16" appears in DOM
- **TC-002**: Given LucideIcon with no size prop When rendered Then default size of 24px is applied
- **TC-003**: Given LucideIcon with custom class When rendered Then the class is appended to the SVG element
- **TC-004**: Given LucideIcon with strokeWidth prop When rendered Then the stroke-width attribute is set correctly

---

### T-002: Refactor ThemeToggle to Use Lucide Icons
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given ThemeToggle component When user has light mode preference Then Sun icon from Lucide is displayed
- **TC-002**: Given ThemeToggle component When user has dark mode preference Then Moon icon from Lucide is displayed
- **TC-003**: Given ThemeToggle component When clicked Then theme toggles and correct icon shows for new theme

---

### T-003: Refactor ToastContainer to Use Lucide Icons
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given ToastContainer with success toast When rendered Then CheckCircle icon from Lucide is displayed
- **TC-002**: Given ToastContainer with error toast When rendered Then XCircle icon from Lucide is displayed
- **TC-003**: Given ToastContainer with info toast When rendered Then Info icon from Lucide is displayed
- **TC-004**: Given ToastContainer with warning toast When rendered Then AlertTriangle icon from Lucide is displayed
- **TC-005**: Given ToastContainer with close button When rendered Then X icon from Lucide is displayed

---

### T-004: Refactor Header Dropdown Indicators to Lucide ChevronDown
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Header component with navigation dropdown When dropdown is collapsed Then ChevronDown icon from Lucide is displayed
- **TC-002**: Given Header component When viewport is mobile (<768px) Then dropdown indicators hidden appropriately
- **TC-003**: Given Header component with ChevronDown icon When icon size prop set to 16 Then chevron renders at 16px

---

### T-005: Refactor Footer Social Media Icons to Lucide
**User Story**: US-001 | **Satisfies ACs**: AC-US1-05
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Footer component with Facebook link When rendered Then Facebook icon from Lucide is displayed
- **TC-002**: Given Footer component with Instagram link When rendered Then Instagram icon from Lucide is displayed
- **TC-003**: Given Footer component with WhatsApp link When rendered Then MessageCircle icon from Lucide is displayed
- **TC-004**: Given Footer component with social icons When no social link exists for a platform Then that icon is not rendered

---

### T-006: Refactor Homepage Entity Cards to Lucide Icons
**User Story**: US-001 | **Satisfies ACs**: AC-US1-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Homepage with Business cards section When rendered Then Building2 icon from Lucide is displayed in card header
- **TC-002**: Given Homepage with Listings cards section When rendered Then Tag icon from Lucide is displayed in card header
- **TC-003**: Given Homepage with Non-Profits cards section When rendered Then Heart icon from Lucide is displayed in card header
- **TC-004**: Given Homepage with Public Sectors cards section When rendered Then Building icon from Lucide is displayed in card header
- **TC-005**: Given Homepage entity card When likes count is displayed Then Heart icon from Lucide is used for like indicator

---

## US-002: MotionAnimations Integration in Core Layouts

### T-007: Implement Header Dropdown Animations
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Header with dropdown menu When user hovers over parent item Then dropdown animates in using dropdownIn effect (fade + slide from top)
- **TC-002**: Given Header with dropdown menu When user hovers away from dropdown Then dropdown animates out using dropdownOut effect
- **TC-003**: Given Header with dropdown animation When prefers-reduced-motion is set Then no animation plays, dropdown shows/hides instantly
- **TC-004**: Given Header with dropdown animation When animation is playing Then animation completes without jank or layout shift

---

### T-008: Implement Header Mobile Menu Slide Animation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Header on mobile viewport (<768px) When hamburger menu is clicked Then mobile menu slides down with slideInLeft effect
- **TC-002**: Given Header mobile menu open When user clicks close/menu button Then menu slides out (or slides up to close)
- **TC-003**: Given Header mobile menu with animation When animation completes Then all menu items are visible and interactive
- **TC-004**: Given Header mobile menu When prefers-reduced-motion is set Then menu opens/closes without slide animation

---

### T-009: Implement Footer Social Links Hover Scale Animation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Footer with social icon links When user hovers over a social icon Then icon scales up (1.1x or similar) smoothly
- **TC-002**: Given Footer with social icon links When user moves mouse away Then icon scales back to original size
- **TC-003**: Given Footer with social icon links When prefers-reduced-motion is set Then hover has no scale animation
- **TC-004**: Given Footer with social icon links After animation plays Then transition is smooth (CSS transform, not layout properties)

---

### T-010: Implement Homepage Hero Section Text Reveal Animation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Homepage hero section with main title When page loads Then textReveal animation plays on the main heading
- **TC-002**: Given Homepage hero textReveal animation When animation completes Then all text is fully visible and readable
- **TC-003**: Given Homepage hero textReveal animation When prefers-reduced-motion is set Then text appears without animation (immediately visible)
- **TC-004**: Given Homepage hero textReveal animation On subsequent page loads Then animation replays correctly

---

### T-011: Implement Homepage Entity Cards Staggered Entrance Animation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-05
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given Homepage with entity cards (Businesses, Listings, etc.) When page loads Then cards animate in with staggered fadeInUp (each card delayed 50-100ms after previous)
- **TC-002**: Given Homepage with entity cards When stagger animation is playing Then cards appear one after another without overlap
- **TC-003**: Given Homepage with entity cards After all cards animate in Then all cards are visible and fully interactive
- **TC-004**: Given Homepage with entity cards When prefers-reduced-motion is set Then cards appear without animation, immediately visible

---

### T-012: Implement Page Transition Animation on Main Content
**User Story**: US-002 | **Satisfies ACs**: AC-US2-06
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given main content area using pageTransitionIn When navigating to a new page Then content animates in with the transition effect
- **TC-002**: Given main content area with page transition When transition completes Then content is fully visible and interactive
- **TC-003**: Given main content area with page transition When prefers-reduced-motion is set Then content appears immediately without transition animation
- **TC-004**: Given main content area with page transition On fast navigation (quick clicks) Then animations do not stack or cause visual glitches

---

## US-003: Scroll-Triggered Animations for List Pages

### T-013: Implement Scroll-Reveal on List Page Cards
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given businesses list page with cards When cards scroll into viewport (IntersectionObserver) Then cards animate with sectionReveal effect
- **TC-002**: Given listings list page with cards When cards scroll into viewport Then cards animate with sectionReveal effect
- **TC-003**: Given non-profits list page with cards When cards scroll into viewport Then cards animate with sectionReveal effect
- **TC-004**: Given public-sectors list page with cards When cards scroll into viewport Then cards animate with sectionReveal effect
- **TC-005**: Given list page with sectionReveal When user scrolls up Then already-revealed cards stay visible (no reverse animation)

---

### T-014: Implement Filter/Tabs Staggered Appearance Animation
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given filter/tabs section on list page When section scrolls into viewport Then filter tags animate with staggered animateFilters effect
- **TC-002**: Given filter/tabs section with animateFilters When animation plays Then tags appear sequentially with small delay between each
- **TC-003**: Given filter/tabs section with animateFilters When prefers-reduced-motion is set Then all tags appear immediately without staggered animation

---

### T-015: Implement Pagination Button Stagger Animation
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given pagination nav on list page When pagination scrolls into viewport Then buttons animate with staggered animatePagination effect
- **TC-002**: Given pagination nav with animatePagination When animation plays Then buttons appear sequentially
- **TC-003**: Given pagination nav with animatePagination When user clicks a page Then correct page content loads without animation delay
- **TC-004**: Given pagination nav with animatePagination When prefers-reduced-motion is set Then buttons appear immediately

---

### T-016: Implement Interactive Card Feedback Animations
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given entity card with addHoverLift When user hovers over card Then card lifts slightly (translateY -2px to -4px) with shadow increase
- **TC-002**: Given entity card with addCardGlow When user hovers over card Then subtle glow/border effect appears around card
- **TC-003**: Given entity card with hover effects When user moves mouse away Then card returns to normal state smoothly
- **TC-004**: Given entity card with hover effects When prefers-reduced-motion is set Then hover effects are instant (no animation duration)
- **TC-005**: Given entity card with hover effects After animation plays Then no layout shift occurs on other nearby cards

---

### T-017: Implement Hero Parallax Effect on List Pages
**User Story**: US-003 | **Satisfies ACs**: AC-US3-05
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given hero section on list pages (businesses, listings, non-profits, public-sectors) When user scrolls Then hero has parallax movement via initParallax
- **TC-002**: Given hero section with initParallax When user scrolls down Then hero content moves at different rate than background
- **TC-003**: Given hero section with initParallax When user scrolls to bottom of hero Then parallax effect stops (no over-scroll issues)
- **TC-004**: Given hero section with initParallax When prefers-reduced-motion is set Then no parallax effect, hero stays static on scroll
- **TC-005**: Given hero section with initParallax On mobile devices Then parallax may be disabled or reduced for performance

---

## Summary

| Task | User Story | ACs Covered | Status |
|------|------------|-------------|--------|
| T-001 | US-001 | AC-US1-01 | [ ] Not Started |
| T-002 | US-001 | AC-US1-02 | [ ] Not Started |
| T-003 | US-001 | AC-US1-03 | [ ] Not Started |
| T-004 | US-001 | AC-US1-04 | [ ] Not Started |
| T-005 | US-001 | AC-US1-05 | [ ] Not Started |
| T-006 | US-001 | AC-US1-06 | [ ] Not Started |
| T-007 | US-002 | AC-US2-01 | [ ] Not Started |
| T-008 | US-002 | AC-US2-02 | [ ] Not Started |
| T-009 | US-002 | AC-US2-03 | [ ] Not Started |
| T-010 | US-002 | AC-US2-04 | [ ] Not Started |
| T-011 | US-002 | AC-US2-05 | [ ] Not Started |
| T-012 | US-002 | AC-US2-06 | [ ] Not Started |
| T-013 | US-003 | AC-US3-01 | [ ] Not Started |
| T-014 | US-003 | AC-US3-02 | [ ] Not Started |
| T-015 | US-003 | AC-US3-03 | [ ] Not Started |
| T-016 | US-003 | AC-US3-04 | [ ] Not Started |
| T-017 | US-003 | AC-US3-05 | [ ] Not Started |

**Total Tasks**: 17
**AC Coverage**: 17/17 (100%)
