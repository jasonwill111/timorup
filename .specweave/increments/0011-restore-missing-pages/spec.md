---
increment: 0011-restore-missing-pages
title: Restore Missing Pages
type: feature
priority: P1
status: completed
created: 2026-04-19T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Restore Missing Pages

## Overview

Restore /faq and /about pages that were lost during recent changes. These pages are essential for user trust and SEO.

---

## User Stories

### US-001: FAQ Page (P1)
**Project**: TimorLink

**As a** a visitor or business owner
**I want** to find answers to common questions
**So that** I can understand how to use TMBIZ effectively

**Acceptance Criteria**:
- [x] **AC-US1-01**: FAQ page accessible at `/faq`
- [x] **AC-US1-02**: Page includes accordion sections for common questions
- [x] **AC-US1-03**: Questions cover: account creation, business listing, subscription, contact
- [x] **AC-US1-04**: Mobile responsive design

### US-002: About Page (P1)
**Project**: TimorLink

**As a** a visitor
**I want** to learn about TMBIZ
**So that** I can trust the platform and understand its mission

**Acceptance Criteria**:
- [x] **AC-US2-01**: About page accessible at `/about`
- [x] **AC-US2-02**: Page includes platform mission and vision
- [x] **AC-US2-03**: Page includes team or contact information
- [x] **AC-US2-04**: Consistent styling with other static pages

---

## Technical Approach

### Pages to Create
1. `src/pages/faq.astro` - FAQ with accordion
2. `src/pages/about.astro` - About TMBIZ

### Design
- Use same layout pattern as `privacy.astro` and `terms.astro`
- Dark mode compatible
- Responsive
- Consistent typography (Oswald headings, DM Sans body)

---

## Out of Scope
- Backend functionality (static content pages)
- FAQ database (hardcoded questions initially)
- Contact form integration

---

## Dependencies
- None

