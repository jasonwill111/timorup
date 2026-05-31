---
increment: 0071-lucide-icons-animation-integration
title: Lucide Icons & CSS Animation Integration
type: feature
priority: P1
status: completed
created: 2026-05-20T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Lucide Icons & CSS Animation Integration

## Overview

统一项目中所有图标为 Lucide，并增强 CSS 动画集成。消除内联 SVG 混用，统一图标管理，同时使用 Tailwind-first 的 CSS 动画方案。

**2026-05-30 更新**: Motion.js 已移除，改用纯 CSS 动画方案。

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

### US-002: CSS Animation Integration in Core Layouts
**Project**: timorup
**As a** user
**I want** smooth animations on navigation and page elements
**So that** the interface feels polished and responsive

**Acceptance Criteria**:
- [x] **AC-US2-01**: Header navigation dropdowns animate with CSS classes `dropdown-enter`/`dropdown-exit`
- [x] **AC-US2-02**: Header mobile menu animates in
- [x] **AC-US2-03**: Footer social links have hover animation via CSS
- [x] **AC-US2-04**: Homepage cards entrance with CSS stagger animation via `stagger-children`
- [x] **AC-US2-05**: Page transition uses CSS class `page-enter`
- [x] **AC-US2-06**: Scroll reveal uses `reveal-on-scroll` class + IntersectionObserver

---

### US-003: Scroll-Triggered Animations for List Pages
**Project**: timorup
**As a** user
**I want** cards to animate into view as I scroll
**So that** browsing feels engaging and content reveals progressively

**Acceptance Criteria**:
- [x] **AC-US3-01**: List page cards use CSS class `reveal-on-scroll` for scroll reveal
- [x] **AC-US3-02**: Filter/tabs use CSS stagger animation
- [x] **AC-US3-03**: Pagination nav uses CSS animation
- [x] **AC-US3-04**: Entity cards use `.card-hover` and `.card-glow` for interactive feedback
- [x] **AC-US3-05**: Parallax effect via CSS class `data-parallax` + JS handler

---

## Functional Requirements

### FR-001: LucideIcon Component
- Props: `name` (icon name), `size` (px, default 24), `class` (additional classes), `strokeWidth` (default 2)
- SSR-compatible Astro component
- Accepts any Lucide icon name from lucide-astro

### FR-002: CSS Animation Architecture
- **Priority**: Tailwind CSS utilities → Pure CSS for complex cases
- `CSSAnimations.astro` provides CSS classes and keyframes
- `css-animations.ts` provides JS utilities for triggers

### FR-003: Performance
- Use CSS transitions (Tailwind `transition-*`) for simple animations
- Use `will-change: transform, opacity` sparingly
- Lazy-load animations below fold
- Respect `prefers-reduced-motion` media query

---

## Out of Scope

- Creating new icons (only using existing Lucide library)
- Complex animation sequences (CSS sufficient for most cases)
- Admin dashboard animations
- Mobile-specific scroll animations (keep simple for low-end devices)

---

## Dependencies

- `@lucide/astro` (already installed)
- `motion` library - **REMOVED** (2026-05-30)

---

## Technical Notes

### Files Modified (2026-05-30)
| File | Change |
|------|--------|
| `src/components/ui/CSSAnimations.astro` | Pure CSS animations (replaces MotionAnimations.astro) |
| `src/lib/css-animations.ts` | JS utilities for CSS animation triggers |
| `src/lib/motion-utils.ts` | **DELETED** |
| `src/components/ui/MotionAnimations.astro` | **DELETED** |

### Animation System
```
┌─────────────────────────────────────────────────┐
│  Tailwind CSS (priority)                        │
│  transition-*, hover:*, animate-*              │
└─────────────────────────────────────────────────┘
                       ↓ (only when Tailwind insufficient)
┌─────────────────────────────────────────────────┐
│  CSSAnimations.astro (CSS classes + keyframes) │
│  .reveal-on-scroll, .stagger-children, etc.   │
└─────────────────────────────────────────────────┘
                       ↓ (only for triggers)
┌─────────────────────────────────────────────────┐
│  css-animations.ts (JS utilities)              │
│  initScrollReveal(), initLazyLoad(), etc.      │
└─────────────────────────────────────────────────┘
```

### Files to Modify
| File | Change |
|------|--------|
| `src/components/ui/LucideIcon.astro` | New component |
| `src/components/ui/ThemeToggle.astro` | Replace inline SVGs with LucideIcon |
| `src/components/ui/ToastContainer.astro` | Replace inline SVGs with LucideIcon |
| `src/components/Header.astro` | Lucide icons for dropdown chevrons |
| `src/components/Footer.astro` | Lucide icons for social media |
| `src/pages/index.astro` | Lucide icons for entity cards |
| `src/layouts/Layout.astro` | CSSAnimations loaded |
| `src/pages/businesses/index.astro` | CSS scroll animations |
| `src/pages/listings/index.astro` | CSS scroll animations |
| `src/pages/non-profits/index.astro` | CSS scroll animations |
| `src/pages/public-sectors/index.astro` | CSS scroll animations |
