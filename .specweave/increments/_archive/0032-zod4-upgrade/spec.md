---
increment: 0032-zod4-upgrade
title: "Zod 4 API Upgrade"
type: feature
priority: P1
status: active
created: 2026-05-07
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Zod 4 API Upgrade

## Overview

Upgrade all Zod schemas to use Zod 4 new APIs: z.email(), z.url(), z.coerce()

## User Stories

### US-001: Centralized Validation Schema
**Project**: timorlist

**As a** developer
**I want** all validation schemas in one place
**So that** maintenance is easier

**Acceptance Criteria**:
- [x] **AC-US1-01**: Validation schemas moved to src/lib/validation.ts
- [x] **AC-US1-02**: All API files import from validation.ts

### US-002: Zod 4 New APIs
**Project**: timorlist

**As a** developer
**I want** to use Zod 4 new APIs
**So that** schemas are cleaner and type-safe

**Acceptance Criteria**:
- [x] **AC-US2-01**: z.string().email() replaced with z.email()
- [x] **AC-US2-02**: URL validation uses z.url()
- [x] **AC-US2-03**: z.coerce used for type conversion (number, boolean)

### US-003: Consistent Error Messages
**Project**: timorlist

**As a** developer
**I want** consistent error messages
**So that** UX is uniform

**Acceptance Criteria**:
- [x] **AC-US3-01**: All error messages use { error: 'message' } format

## Functional Requirements

### FR-001: Email Validation
- Replace z.string().email() with z.email()
- Error: z.email({ error: 'Invalid email address' })

### FR-002: URL Validation
- Replace z.string().url() with z.url()
- Error: z.url({ error: 'Invalid URL' })

### FR-003: Type Coercion
- Use z.coerce.number() for numeric fields
- Use z.coerce.boolean() for boolean fields
- Remove manual parseInt/Boolean conversions

## Files to Modify

| File | Changes |
|------|---------|
| src/lib/validation.ts | Main validation schemas |
| src/pages/api/admin/listing/index.ts | Use validation.ts |
| src/pages/api/admin/listing/[id].ts | Use validation.ts |
| src/pages/api/businesses/index.ts | Use validation.ts |

## Out of Scope

- Changing validation logic (only API updates)
- Adding new validation rules
- Schema restructuring

## Dependencies

- Zod 4.4.1 (already installed)
