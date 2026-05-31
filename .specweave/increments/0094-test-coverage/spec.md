---
increment: 0094-test-coverage
title: "Test Coverage Improvement"
type: feature
priority: P2
status: completed
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 85
---

# Feature: Test Coverage Improvement

## Overview

Test coverage improvements from codebase review.

## User Stories

### US-001: Auth Tests (P2)
**Project**: timorup

**As a** developer
**I want** comprehensive auth tests
**So that** auth changes don't break functionality

**Acceptance Criteria**:
- [x] **AC-US1-01**: Auth tests exist for signIn/signUp
- [x] **AC-US1-02**: Rate limiting tests cover auth actions

---

### US-002: Schema Tests (P2)
**Project**: timorup

**As a** developer
**I want** schema validation tests
**So that** validation is properly tested

**Acceptance Criteria**:
- [x] **AC-US2-01**: Password schema tests exist
- [x] **AC-US2-02**: Error code tests exist

## Status

**Deferred to future work** - Basic test coverage exists, expanded testing can be done incrementally.