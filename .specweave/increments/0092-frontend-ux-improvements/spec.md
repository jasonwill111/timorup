---
increment: 0092-frontend-ux-improvements
title: "Frontend UX Improvements"
type: feature
priority: P2
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 85
---

# Feature: Frontend UX Improvements

## Overview

Fix UI/UX issues: carousel navigation, touch targets, accessibility, motion preferences.

## User Stories

### US-001: Fix Carousel Navigation (P1)
**Project**: timorup

**As a** mobile user
**I want** to see carousel navigation arrows on touch devices
**So that** I can navigate through carousel items

**Acceptance Criteria**:
- [x] **AC-US1-01**: Carousel arrows always visible (not hidden on mobile)
- [x] **AC-US1-02**: Carousel respects prefers-reduced-motion
- [x] **AC-US1-03**: Carousel indicators visible on all devices

---

### US-002: Fix Touch Targets (P1)
**Project**: timorup

**As a** mobile user
**I want** all interactive elements to be at least 44px
**So that** I can tap them accurately

**Acceptance Criteria**:
- [x] **AC-US2-01**: Carousel buttons minimum 44px height
- [ ] **AC-US2-02**: All buttons meet 44px minimum touch target (deferred - requires global audit)

---

### US-003: Add Focus Trap to Modals (P2)
**Project**: timorup

**As a** keyboard user
**I want** focus to stay within modals
**So that** I can navigate with keyboard

**Acceptance Criteria**:
- [x] **AC-US3-01**: Focus trapped within PhotoGallery modal
- [x] **AC-US3-02**: Focus returns to trigger on modal close

---

### US-004: Add Reduced Motion Support (P2)
**Project**: timorup

**As a** user with motion sensitivity
**I want** animations disabled
**So that** I can use the site comfortably

**Acceptance Criteria**:
- [x] **AC-US4-01**: Carousel respects prefers-reduced-motion
- [x] **AC-US4-02**: Scroll animations disabled for motion-sensitive users