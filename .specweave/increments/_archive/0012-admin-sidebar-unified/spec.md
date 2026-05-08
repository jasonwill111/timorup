---
increment: 0012-admin-sidebar-unified
title: Admin Sidebar Unified Theme
type: feature
priority: P1
status: completed
created: 2026-04-19T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Sidebar Unified Theme

## Overview

Fix admin sidebar dark/light theme sync and integrate sidebar with content area. The sidebar already exists in AdminLayout.astro but has three issues: (1) theme toggle doesn't sync properly between sidebar and content, (2) inconsistent styling across admin pages, and (3) mobile-responsive sidebar behavior needs improvement.

---

## User Stories

### US-001: Theme Toggle Sync
**Project**: timorlist

**As an** admin user **I want** the theme to remain consistent between sidebar and content area **So that** I have a cohesive experience regardless of which toggle I use

**Acceptance Criteria**:
- [x] **AC-US1-01**: Clicking theme toggle in desktop sidebar changes the entire page theme (sidebar + content) instantly
- [x] **AC-US1-02**: Clicking theme toggle in mobile header changes the entire page theme (header + sidebar overlay + content) instantly
- [x] **AC-US1-03**: Theme preference persists in localStorage and is restored on page reload without flash of wrong theme
- [x] **AC-US1-04**: System preference (`prefers-color-scheme`) is respected for new users without localStorage

---

### US-002: Consistent Admin Styling
**Project**: timorlist

**As an** admin user **I want** all admin pages to have consistent visual styling **So that** the admin dashboard feels cohesive and professional

**Acceptance Criteria**:
- [x] **AC-US2-01**: Desktop sidebar background matches content area background (both use `bg-card` CSS variable)
- [x] **AC-US2-02**: Mobile header background matches sidebar background (`bg-card` in both light and dark mode)
- [x] **AC-US2-03**: Active navigation item has clear visual indicator (currently uses `bg-primary`)
- [x] **AC-US2-04**: All admin pages use `bg-card` for their content containers, not custom background colors

---

### US-003: Mobile Sidebar UX
**Project**: timorlist

**As an** admin user on mobile **I want** the sidebar menu to be easily accessible and dismissible **So that** I can navigate the admin panel comfortably on my phone

**Acceptance Criteria**:
- [x] **AC-US3-01**: Tapping hamburger menu opens sidebar overlay with smooth slide-in animation (200ms)
- [x] **AC-US3-02**: Tapping outside the sidebar or pressing back button closes the sidebar overlay
- [x] **AC-US3-03**: Sidebar overlay includes a semi-transparent backdrop (`bg-black/50`)
- [x] **AC-US3-04**: Navigation links in mobile sidebar are easily tappable (minimum 44x44px touch target)
- [x] **AC-US3-05**: Keyboard navigation (Tab, Escape) works correctly for mobile sidebar

---

## Functional Requirements

### FR-001: Theme Initialization
The admin layout MUST initialize theme before page render to prevent flash of wrong theme:

```typescript
// Inline script in <head> (before any CSS loads)
const theme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');
```

### FR-002: Unified Theme State
Theme state is controlled by a single source of truth:
- `document.documentElement.classList.contains('dark')` determines theme
- All components (sidebar, header, content) read this state via CSS variables
- No separate theme state for mobile vs desktop

### FR-003: Shared Navigation
Both mobile and desktop navigation must:
- Render identical nav items
- Use same `data-section` attributes for active highlighting
- Share click handlers for logout, theme toggle

### FR-004: Animation
Mobile sidebar animations:
- Open: `transform: translateX(-100%)` to `transform: translateX(0)`, 200ms ease-out
- Close: Reverse of open, 150ms ease-in
- Backdrop: Opacity 0 to 1, 200ms

---

## Out of Scope

- Changes to public site theme (Layout.astro) - unrelated to this feature
- Adding new admin pages or navigation items
- Backend authentication changes
- Performance optimization beyond current baseline

---

## Dependencies

- CSS variables defined in `src/styles/globals.css` (already exist)
- `AdminLayout.astro` as base layout (already exists)
- localStorage API for theme persistence (browser-native)

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Theme toggle response time | < 50ms |
| No theme flash on page reload | 100% of loads |
| Mobile sidebar animation FPS | 60fps |
| Touch target size compliance | 100% of nav items |
| Cross-browser theme consistency | Chrome, Firefox, Safari |
