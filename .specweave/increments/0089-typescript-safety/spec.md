---
increment: 0089-typescript-safety
title: "TypeScript Type Safety"
type: feature
priority: P1
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 95
---

# Feature: TypeScript Type Safety

## Overview

Fix TypeScript type safety issues: replace `any` types in in-memory-adapter, add type guards for unsafe `as` assertions, convert enums to const objects.

## User Stories

### US-001: Fix In-Memory Adapter Types (P1)
**Project**: timorup

**As a** developer
**I want** in-memory adapter to use proper return types
**So that** TypeScript catches type errors at compile time

**Acceptance Criteria**:
- [x] **AC-US1-01**: `select()` method returns typed query builder
- [x] **AC-US1-02**: `insert()`, `update()`, `delete()` methods return proper types
- [x] **AC-US1-03**: `from()` and `values()` methods use proper generics

---

### US-002: Add Type Guards for As Assertions (P1)
**Project**: timorup

**As a** developer
**I want** unsafe type assertions protected by type guards
**So that** runtime type safety is ensured

**Acceptance Criteria**:
- [x] **AC-US2-01**: `env as Record<string, unknown>` wrapped in type guard
- [x] **AC-US2-02**: `workersEnv as ...` checked before use
- [x] **AC-US2-03**: API response assertions validated

---

### US-003: Convert Enums to Const Objects (P2)
**Project**: timorup

**As a** developer
**I want** enums replaced with const objects
**So that** TypeScript conventions are followed and bundle size is reduced

**Acceptance Criteria**:
- [ ] **AC-US3-01**: `ErrorCode` enum converted to const object
- [ ] **AC-US3-02**: `EventType` enum converted to const object
- [ ] **AC-US3-03**: All imports updated to use new const pattern

## Dependencies

- TypeScript strict mode enabled
- Existing types in `src/lib/adapters.ts`