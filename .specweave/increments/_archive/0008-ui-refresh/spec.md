---
increment: 0008-ui-refresh
title: UI Color & Layout Refresh
type: feature
priority: P1
status: completed
created: 2026-04-19T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: UI Color & Layout Refresh

## Overview

Unified UI styling across frontend and backend based on design reference screenshots - dark theme, golden yellow primary (#FFD700), enhanced cards, improved search, pill-style tags, admin sidebar.

## Design Reference

Design inspiration from screenshots:
- **Background**: Dark `#1E1E2E` / `#2A2A3E`
- **Primary**: Golden yellow `#FFD700` (brighter than current `#FFD150`)
- **Cards**: Rounded-xl, subtle shadows, hover lift effect
- **Search**: Floating rounded design with icon
- **Tags**: Pill/capsule style with rounded corners
- **Admin Sidebar**: Dark background with icons

---

## User Stories

### US-001: Unified Color Theme (P1)
**Project**: timorlist

**As a** a business owner or visitor
**I want** consistent golden yellow branding across all pages
**So that** I immediately recognize TMBIZ's visual identity

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Primary color updated to `#FFD700` in light mode
- [ ] **AC-US1-02**: Primary color `#FFD700` maintained in dark mode
- [ ] **AC-US1-03**: All buttons, links, and accents use the new primary
- [ ] **AC-US1-04**: Ring/focus states use `#FFD700`

---

### US-002: Dark Theme Background (P1)
**Project**: timorlist

**As a** a user browsing at night
**I want** a comfortable dark theme
**So that** I can use the site without eye strain

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Dark background uses `#1E1E2E` (not current `#0A0F1A`)
- [ ] **AC-US2-02**: Card backgrounds use `#2A2A3E` in dark mode
- [ ] **AC-US2-03**: Muted backgrounds use `#33334D` in dark mode
- [ ] **AC-US2-04**: Border colors updated to `#3A3A4E` for dark mode

---

### US-003: Enhanced Card Styling (P1)
**Project**: timorlist

**As a** a user browsing businesses
**I want** visually appealing cards with hover effects
**So that** the interface feels modern and responsive

**Acceptance Criteria**:
- [ ] **AC-US3-01**: Cards use `rounded-xl` corners (16px radius)
- [ ] **AC-US3-02**: Cards have subtle `shadow-sm` by default
- [ ] **AC-US3-03**: Cards lift on hover with `shadow-lg` and `translate-y-[-2px]`
- [ ] **AC-US3-04**: Card borders use `border-border` token

---

### US-004: Improved Search Design (P1)
**Project**: timorlist

**As a** a visitor looking for businesses
**I want** a prominent, styled search box
**So that** I can quickly find what I'm looking for

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Search input has `rounded-full` corners
- [ ] **AC-US4-02**: Search input has generous padding (`px-6 py-3`)
- [ ] **AC-US4-03**: Search icon present inside or beside input
- [ ] **AC-US4-04**: Search has subtle shadow for floating effect

---

### US-005: Pill-Style Category Tags (P2)
**Project**: timorlist

**As a** a user filtering businesses
**I want** pill-shaped category buttons
**So that** filters are visually clear and touch-friendly

**Acceptance Criteria**:
- [ ] **AC-US5-01**: Category tags use `rounded-full` pill shape
- [ ] **AC-US5-02**: Selected tags show primary color background
- [ ] **AC-US5-03**: Tags have consistent padding (`px-4 py-2`)
- [ ] **AC-US5-04**: Tags in grid use `flex-wrap` for mobile

---

### US-006: Admin Sidebar Navigation (P1)
**Project**: timorlist

**As an** admin user
**I want** a dark-themed sidebar with icons
**So that** navigation is clear and professional

**Acceptance Criteria**:
- [ ] **AC-US6-01**: Sidebar uses dark background `#1E1E2E`
- [ ] **AC-US6-02**: Sidebar items show Lucide icons
- [ ] **AC-US6-03**: Active nav item highlighted with primary color
- [ ] **AC-US6-04**: Sidebar collapsible on mobile

---

### US-007: Unified Typography (P2)
**Project**: timorlist

**As a** user reading content
**I want** consistent, readable typography
**So that** content is easy to consume

**Acceptance Criteria**:
- [ ] **AC-US7-01**: Headings use Oswald font family
- [ ] **AC-US7-02**: Body text uses DM Sans font family (local, modern sans-serif)
- [ ] **AC-US7-03**: Consistent heading scale (h1: 3rem, h2: 2rem, h3: 1.5rem)

---

## Technical Approach

### CSS Variables Update
Update `src/styles/globals.css`:
```css
:root {
  --color-primary: #FFD700;  /* Brighter gold */
  /* ... other light theme colors */
}

.dark {
  --color-background: #1E1E2E;
  --color-card: #2A2A3E;
  --color-muted: #33334D;
  --color-border: #3A3A4E;
  --color-primary: #FFD700;
}
```

### Component Updates
1. **Cards**: Add hover effects via Tailwind classes
2. **Buttons**: Ensure consistent primary color usage
3. **Search**: Redesign with rounded-full and shadow
4. **Tags**: Apply pill styling via `rounded-full`
5. **Admin**: Update AdminLayout with dark sidebar

### Files to Modify
- `src/styles/globals.css` - Color tokens
- `src/layouts/AdminLayout.astro` - Sidebar styling
- `src/components/Header.astro` - Search design
- `src/components/ui/Card.astro` - Enhanced card styles
- Business listing pages - Card grid improvements

---

## Out of Scope
- Backend API changes
- Database schema changes
- New feature functionality
- Font file changes (keep DM Sans + Oswald)

---

## Dependencies
- None (purely visual/CSS changes)
