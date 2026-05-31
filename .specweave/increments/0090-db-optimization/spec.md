---
increment: 0090-db-optimization
title: "Database Optimization"
type: feature
priority: P1
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 85
---

# Feature: Database Optimization

## Overview

Add transactions for multi-step ops, fix N+1 queries, add missing indexes, add pagination to list endpoints.

## User Stories

### US-001: Add Database Transactions (P1)
**Project**: timorup

**As a** developer
**I want** multi-step database operations wrapped in transactions
**So that** data consistency is maintained on partial failures

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Business creation uses transaction for slug check + insert
- [ ] **AC-US1-02**: Admin listing creation uses transaction
- [ ] **AC-US1-03**: Transaction rollback on error

---

### US-002: Fix N+1 Queries (P1)
**Project**: timorup

**As a** developer
**I want** list queries using JOINs instead of N+1
**So that** database roundtrips are minimized

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Account businesses API uses JOIN for category
- [ ] **AC-US2-02**: Admin businesses list uses JOIN for category
- [ ] **AC-US2-03**: Performance improvement verified

---

### US-003: Add Missing Indexes (P2)
**Project**: timorup

**As a** developer
**I want** frequently queried columns indexed
**So that** query performance is optimized

**Acceptance Criteria**:
- [ ] **AC-US3-01**: `latest_updates` table has (typeId, createdAt) index
- [ ] **AC-US3-02**: `reviews` table has (businessId, status) index
- [ ] **AC-US3-03**: `listings` table has (ownerId) index

---

### US-004: Add Pagination to List Endpoints (P2)
**Project**: timorup

**As a** developer
**I want** list endpoints paginated
**So that** large datasets don't cause memory issues

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Admin businesses list supports page/limit params
- [ ] **AC-US4-02**: Admin listings list supports page/limit params
- [ ] **AC-US4-03**: Default limit of 20, max limit of 100

## Dependencies

- Drizzle ORM with transaction support
- Existing query layer in `src/lib/db/queries/`