---
increment: 0069-rename-to-timorlink
title: "Rename TimorUp to TimorUp"
type: refactor
priority: P1
status: active
created: 2026-05-19
structure: user-stories
test_mode: TDD
coverage_target: 100
---

# Feature: Rename TimorUp to TimorUp

## Overview

Rename all project references from TimorUp to TimorUp across:
- Frontend (UI text, titles, meta tags)
- Backend (variable names, constants)
- Configuration (wrangler, package.json, CI/CD)
- Static assets (favicon, OG images)

## User Stories

### US-001: Rename Frontend Text (P1)
**Project**: TimorUp

**As a** developer
**I want** to replace all visible "TimorUp" text with "TimorUp"
**So that** the branding is consistent across the entire UI

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Page titles updated to "TimorUp"
- [ ] **AC-US1-02**: Navigation text updated (header, footer, sidebar)
- [ ] **AC-US1-03**: Meta tags (OG, Twitter) updated
- [ ] **AC-US1-04**: Button/link text updated

---

### US-002: Rename Backend Code References (P1)
**Project**: TimorUp

**As a** developer
**I want** to rename code references (functions, constants, types)
**So that** the codebase is consistent

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Type names renamed (TimorUpContext â†?TimorUpContext)
- [ ] **AC-US2-02**: Function names renamed
- [ ] **AC-US2-03**: Schema/DB references renamed

---

### US-003: Rename Configuration Files (P1)
**Project**: TimorUp

**As a** developer
**I want** to rename project configurations
**So that** all config references the new name

**Acceptance Criteria**:
- [ ] **AC-US3-01**: wrangler.jsonc name updated
- [ ] **AC-US3-02**: CI/CD workflow names updated
- [ ] **AC-US3-03**: Environment variable references updated

---

### US-004: Rename Static Assets (P2)
**Project**: TimorUp

**As a** developer
**I want** to rename static asset references
**So that** images and icons reference the new name

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Favicon alt text updated
- [ ] **AC-US4-02**: Default OG image references updated

## Functional Requirements

### FR-001: Text Replacement
Replace all occurrences of "TimorUp" with "TimorUp" in:
- Astro components (titles, text)
- TypeScript/TSX files (variables, types)
- JSON configs (names, descriptions)
- Markdown docs (if applicable)

### FR-002: Case Sensitivity
Handle both:
- "TimorUp" (PascalCase)
- "TimorUp" (lowercase)
- "TimorUp.com" (domain)

### FR-003: Exclusions
Do NOT change:
- Database table names (existing data)
- External service names (Cloudflare, R2 bucket names)
- GitHub repository name
- npm package name in package.json (would break installs)

## Success Criteria

1. All UI text shows "TimorUp" instead of "TimorUp"
2. All code references use consistent naming
3. All configurations reference the new name
4. Build succeeds without errors

## Out of Scope

- Database table/column renaming
- User-generated content
- GitHub repository rename
- npm package rename
