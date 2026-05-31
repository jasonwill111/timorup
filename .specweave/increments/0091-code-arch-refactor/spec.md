---
increment: 0091-code-arch-refactor
title: "Code Architecture Refactor"
type: refactor
priority: P2
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: Code Architecture Refactor

## Overview

Refactor code architecture: unify error handling patterns, merge shallow modules, consolidate duplicated code.

## User Stories

### US-001: Unify getErrorMessage Usage (P1)
**Project**: timorup

**As a** developer
**I want** all action files import getErrorMessage from shared location
**So that** error handling is consistent and DRY

**Acceptance Criteria**:
- [x] **AC-US1-01**: All action files import getErrorMessage from @/lib/errors
- [x] **AC-US1-02**: No duplicate getErrorMessage function definitions
- [x] **AC-US1-03**: All action files use createErrorResponse for error responses

---

### US-002: Merge Shallow Modules (P2)
**Project**: timorup

**As a** developer
**I want** shallow modules merged
**So that** code is easier to navigate

**Acceptance Criteria**:
- [x] **AC-US2-01**: src/lib/errors/ consolidated to 2 files max
- [x] **AC-US2-02**: Dead code indexes removed (monitoring/index.ts, admin/auth/index.ts)

---

### US-003: Consolidate Admin Role Logic (P2)
**Project**: timorup

**As a** developer
**I want** ADMIN_ROLES constant reused across files
**So that** role changes only need one edit

**Acceptance Criteria**:
- [x] **AC-US3-01**: ADMIN_ROLES exported from admin-auth.ts
- [x] **AC-US3-02**: All role checks use imported constant

## Dependencies

- Existing error handling in src/lib/errors/
- Existing admin-auth.ts module