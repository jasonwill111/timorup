---
id: US-002
feature: FS-051
title: "Cache Invalidation (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** system."
project: timorlist
---

# US-002: Cache Invalidation (P1)

**Feature**: [FS-051](./FEATURE.md)

**As a** system
**I want** cache invalidation on logout
**So that** sessions die immediately when revoked

---

## Acceptance Criteria

- [x] **AC-US2-01**: Logout deletes session from KV
- [x] **AC-US2-02**: Session expiry removes KV entry via TTL
- [x] **AC-US2-03**: D1 remains source of truth

---

## Implementation

**Increment**: [0051-0042-better-auth-kv-session](../../../../../increments/0051-0042-better-auth-kv-session/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
