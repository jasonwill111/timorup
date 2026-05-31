---
increment: 0088-xss-sanitization-a11y
title: "XSS Sanitization & Accessibility"
type: feature
priority: P1
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: XSS Sanitization & Accessibility

## Overview

Fix XSS vulnerabilities in user-generated content by adding DOMPurify sanitization, and fix accessibility issues with missing alt text.

## User Stories

### US-001: XSS Protection for User Content (P1)
**Project**: timorup

**As a** system administrator
**I want** all user-generated content sanitized before storage
**So that** XSS attacks via malicious scripts are prevented

**Acceptance Criteria**:
- [x] **AC-US1-01**: Business updates content is sanitized with DOMPurify
- [x] **AC-US1-02**: Blog post content is sanitized with DOMPurify
- [x] **AC-US1-03**: Review comments are sanitized with DOMPurify
- [x] **AC-US1-04**: Sanitization removes `<script>`, `<iframe>`, and event handlers

---

### US-002: Accessibility for Images (P1)
**Project**: timorup

**As a** accessibility compliance officer
**I want** all images properly marked for screen readers
**So that** visually impaired users can navigate the site

**Acceptance Criteria**:
- [x] **AC-US2-01**: Decorative images have `aria-hidden="true"`
- [x] **AC-US2-02**: Meaningful images have descriptive alt text
- [x] **AC-US2-03**: No images have empty `alt=""` without `aria-hidden`

## Dependencies

- `DOMPurify` npm package for HTML sanitization
- Existing XSS protection tests in `src/lib/security.test.ts`