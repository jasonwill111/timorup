---
increment: 0076-design-refinement
title: Design Refinement
type: feature
priority: P2
status: completed
created: 2026-05-25T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Design Refinement

## Overview

UI/UX design system refinement based on kami.tw93.fun inspired warm paper theme. Focus on readability, accessibility, and brand consistency across all pages.

---

## User Stories

### US-001: Warm Color Theme for Light Mode (P1)
**Project**: TimorUp

**As a** Visitor
**I want** to see warm, easy-to-read backgrounds and text
**So that** I can comfortably browse the site for extended periods

**Acceptance Criteria**:
- [x] **AC-US1-01**: Light mode background uses warm parchment (#F5F4ED) not pure white
- [x] **AC-US1-02**: Primary text uses near-black (#141413) for high contrast (4.5:1+)
- [x] **AC-US1-03**: Card backgrounds use ivory (#FAF9F5)
- [x] **AC-US1-04**: Borders use warm gray (#D8D6CD) not neutral gray
- [x] **AC-US1-05**: Brand yellow (#FFD150) preserved for interactive elements

---

### US-002: Deep Navy Theme for Dark Mode (P1)
**Project**: TimorUp

**As a** Visitor
**I want** dark mode to use deep navy instead of pure black
**So that** I can read comfortably in low-light environments without eye strain

**Acceptance Criteria**:
- [x] **AC-US2-01**: Dark mode background uses deep navy (#0F1A2E) not #09090b
- [x] **AC-US2-02**: Dark mode text uses warm ivory (#E8E6DC) not pure white
- [x] **AC-US2-03**: Dark mode cards use navy (#152236)
- [x] **AC-US2-04**: Muted text uses readable blue-gray (#8B95A5)
- [x] **AC-US2-05**: Buttons have proper contrast in dark mode (text visible on hover)

---

### US-003: Readable Typography System (P1)
**Project**: TimorUp

**As a** Visitor
**I want** clear, comfortable typography that aids reading
**So that** I can easily consume information on any page

**Acceptance Criteria**:
- [x] **AC-US3-01**: Body text uses Nunito Sans (warm, rounded, readable)
- [x] **AC-US3-02**: Headings use Plus Jakarta Sans (modern, bold)
- [x] **AC-US3-03**: Fonts loaded locally from /src/fonts/ (not Google CDN)
- [x] **AC-US3-04**: Font size minimum 16px for body text
- [x] **AC-US3-05**: Line height 1.5-1.75 for body text readability

---

### US-004: Minimal Motion for Performance (P2)
**Project**: TimorUp

**As a** Visitor
**I want** smooth but subtle interactions that don't distract
**So that** I can focus on content without visual clutter

**Acceptance Criteria**:
- [x] **AC-US4-01**: No scroll-triggered animations (causes jank)
- [x] **AC-US4-02**: No text reveal animations (delays LCP)
- [x] **AC-US4-03**: Hover effects use subtle shadow only, no scale/glow
- [x] **AC-US4-04**: Modal/dropdown transitions max 150-200ms
- [x] **AC-US4-05**: All animations respect `prefers-reduced-motion`

---

### US-005: Unified Button & Interactive Colors (P2)
**Project**: TimorUp

**As a** Visitor
**I want** consistent button colors across all pages
**So that** I can easily identify interactive elements

**Acceptance Criteria**:
- [x] **AC-US5-01**: Primary buttons use amber-700/amber-900 background
- [x] **AC-US5-02**: Ghost buttons have visible borders in dark mode
- [x] **AC-US5-03**: Button text contrast ratio minimum 4.5:1
- [x] **AC-US5-04**: CTA sections use solid amber background (no gradient)

---

## Functional Requirements

### FR-001: Color System Implementation
- Update `src/styles/globals.css` with new color tokens
- Ensure CSS variables work for both light and dark modes
- Test contrast ratios on all text/background combinations

### FR-002: Typography System Implementation
- Download and store fonts locally in `src/fonts/`
- Update `@font-face` declarations in globals.css
- Replace all references to Inter/Oswald with Nunito Sans/Plus Jakarta Sans

### FR-003: Motion Cleanup
- Remove all scroll-triggered animations from components
- Remove text reveal from homepage hero
- Simplify card hover effects to shadow-only
- Add prefers-reduced-motion check to motion-utils.ts

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Light mode background | Warm parchment (#F5F4ED) |
| Dark mode background | Deep navy (#0F1A2E) |
| Body font | Nunito Sans |
| Heading font | Plus Jakarta Sans |
| Motion animations | Minimal (150-200ms max) |
| Contrast ratio | 4.5:1 minimum for all text |

---

## Out of Scope

- Layout structure changes
- Component architecture changes
- New features or functionality
- Database schema changes
- API endpoint changes

---

## Dependencies

- None (self-contained design changes)

---

## Verification

### Visual Testing
- Take screenshots of homepage in light/dark mode
- Verify color consistency across all pages
- Check button hover states in both modes

### Accessibility Testing
- Run Lighthouse accessibility audit (target 90+)
- Verify color contrast with browser DevTools
- Test with `prefers-reduced-motion: reduce`

### Performance Testing
- Verify fonts load from local `/fonts/` directory
- Check no motion-related LCP delays
- Verify build output size not significantly increased
