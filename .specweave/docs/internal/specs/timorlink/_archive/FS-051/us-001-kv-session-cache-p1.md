---
id: US-001
feature: FS-051
title: "KV Session Cache (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** user."
project: TimorLink
---

# US-001: KV Session Cache (P1)

**Feature**: [FS-051](./FEATURE.md)

**As a** user
**I want** faster session validation
**So that** page loads feel instant

---

## Acceptance Criteria

- [x] **AC-US1-01**: Better Auth configured with secondaryStorage using SESSION KV
- [x] **AC-US1-02**: Session reads hit KV before D1
- [x] **AC-US1-03**: Cache TTL matches session expiry
- [x] **AC-US1-04**: New sessions written to both KV and D1

---

## Implementation

**Increment**: [0051-0042-better-auth-kv-session](../../../../../increments/0051-0042-better-auth-kv-session/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

