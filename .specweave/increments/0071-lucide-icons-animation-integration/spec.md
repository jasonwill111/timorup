---
increment: 0071-lucide-icons-animation-integration
title: Lucide Icons & Motion Animation Integration
type: feature
priority: P1
status: completed
created: 2026-05-20T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Lucide Icons & Motion Animation Integration

## Overview

统一项目中所有图标为 Lucide，并增强 MotionAnimations 组件的集成使用。消除内联 SVG 混用，统一图标管理，同时提升 UI 动效体验。

## User Stories

### US-001: Unified LucideIcon Component
**Project**: timorup
**As a** frontend developer
**I want** a unified LucideIcon component
**So that** I can replace all inline SVGs with consistent Lucide icons across the codebase

**Acceptance Criteria**:
- [x] **AC-US1-01**: `LucideIcon.astro` component created in `src/components/ui/` with props: `name`, `size` (default 24), `class`, `strokeWidth`
- [x] **AC-US1-02**: ThemeToggle refactored to use Lucide icons (Sun, Moon from lucide-astro)
- [x] **AC-US1-03**: ToastContainer refactored to use Lucide icons instead of inline SVGs
- [x] **AC-US1-04**: Header refactored to use Lucide ChevronDown for dropdown indicators
- [x] **AC-US1-05**: Footer refactored to use Lucide icons for social media (Facebook, Instagram, MessageCircle for WhatsApp)
- [x] **AC-US1-06**: Homepage entity cards (Businesses, Listings, Non-Profits, Public Sectors) refactored to use Lucide icons (Building2, Tag, Heart, Building)

---

### US-002: MotionAnimations Integration in Core Layouts
**Project**: timorup
**As a** user
**I want** smooth animations on navigation and page elements
**So that** the interface feels polished and responsive

**Acceptance Criteria**:
- [x] **AC-US2-01**: Header navigation dropdowns animate with `dropdownIn`/`dropdownOut` on hover
- [x] **AC-US2-02**: Header mobile menu slides down with `slideInLeft` effect
- [x] **AC-US2-03**: Footer social links have hover scale animation
- [x] **AC-US2-04**: Homepage hero section uses `textReveal` for main title
- [x] **AC-US2-05**: Homepage entity cards entrance with staggered `fadeInUp` on load
- [x] **AC-US2-06**: Page transition uses `pageTransitionIn` on main content areas

---

### US-003: Scroll-Triggered Animations for List Pages
**Project**: timorup
**As a** user
**I want** cards to animate into view as I scroll
**So that** browsing feels engaging and content reveals progressively

**Acceptance Criteria**:
- [x] **AC-US3-01**: List page (businesses, listings, non-profits, public-sectors) cards use `sectionReveal` on scroll
- [x] **AC-US3-02**: Filter/tabs section uses `animateFilters` for staggered tag appearance
- [x] **AC-US3-03**: Pagination nav uses `animatePagination` for button stagger
- [x] **AC-US3-04**: Entity cards use `addHoverLift` and `addCardGlow` for interactive feedback
- [x] **AC-US3-05**: Hero section on list pages uses `initParallax` for scroll parallax effect

---

## Functional Requirements

### FR-001: LucideIcon Component
- Props: `name` (icon name), `size` (px, default 24), `class` (additional classes), `strokeWidth` (default 2)
- SSR-compatible Astro component
- Accepts any Lucide icon name from lucide-astro

### FR-002: Animation Orchestration
- MotionAnimations.astro loaded in Layout.astro (already in `src/components/ui/`)
- Header/Footer animations triggered after DOMContentLoaded
- Scroll animations use IntersectionObserver via `inView`

### FR-003: Performance
- Use `will-change: transform, opacity` on animated elements
- Lazy-load animations below fold
- Respect `prefers-reduced-motion` media query

---

## Out of Scope

- Creating new icons (only using existing Lucide library)
- Complex animation sequences (beyond existing MotionAnimations functions)
- Admin dashboard animations
- Mobile-specific scroll animations (keep simple for low-end devices)

---

## Dependencies

- `@lucide/astro` (already installed)
- `motion` library (already installed via MotionAnimations.astro)
- `MotionAnimations.astro` (already exists in `src/components/ui/`)

---

## Technical Notes

### Files to Modify
| File | Change |
|------|--------|
| `src/components/ui/LucideIcon.astro` | New component |
| `src/components/ui/ThemeToggle.astro` | Replace inline SVGs with LucideIcon |
| `src/components/ui/ToastContainer.astro` | Replace inline SVGs with LucideIcon |
| `src/components/Header.astro` | Lucide icons for dropdown chevrons |
| `src/components/Footer.astro` | Lucide icons for social media |
| `src/pages/index.astro` | Lucide icons for entity cards |
| `src/layouts/Layout.astro` | Ensure MotionAnimations loaded |
| `src/pages/businesses/index.astro` | Scroll animations |
| `src/pages/listings/index.astro` | Scroll animations |
| `src/pages/non-profits/index.astro` | Scroll animations |
| `src/pages/public-sectors/index.astro` | Scroll animations |
