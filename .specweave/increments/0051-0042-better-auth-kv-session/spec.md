---
increment: 0051-0042-better-auth-kv-session
title: Better Auth KV Session Cache
type: feature
priority: P1
status: completed
created: 2026-05-13T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Better Auth KV Session Cache

## Overview

Configure Better Auth secondaryStorage with KV for faster session lookups. Sessions currently stored only in D1 (slow), KV cache reduces read latency.

## User Stories

### US-001: KV Session Cache (P1)
**Project**: timorlist

**As a** user
**I want** faster session validation
**So that** page loads feel instant

**Acceptance Criteria**:
- [x] **AC-US1-01**: Better Auth configured with secondaryStorage using SESSION KV
- [x] **AC-US1-02**: Session reads hit KV before D1
- [x] **AC-US1-03**: Cache TTL matches session expiry
- [x] **AC-US1-04**: New sessions written to both KV and D1

### US-002: Cache Invalidation (P1)
**Project**: timorlist

**As a** system
**I want** cache invalidation on logout
**So that** sessions die immediately when revoked

**Acceptance Criteria**:
- [x] **AC-US2-01**: Logout deletes session from KV
- [x] **AC-US2-02**: Session expiry removes KV entry via TTL
- [x] **AC-US2-03**: D1 remains source of truth

## Functional Requirements

### FR-001: Better Auth Config
```typescript
database: drizzleAdapter(wrappedDb, {
  provider: 'sqlite',
  schema: { ... },
  secondaryStorage: {
    sessions: {
      store: kvStore(env.SESSION),
      ttl: 86400, // 24 hours in seconds
    }
  }
})
```

### FR-002: KV Store Interface
Better Auth expects: `{ get, set, delete, list }`

## Out of Scope

- Custom session storage schema
- Session data encryption in KV
- Manual cache warming

## Dependencies

- Better Auth 1.6.x (installed)
- SESSION KV namespace (existing)
- `src/lib/auth.ts` (existing)
