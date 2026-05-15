---
id: US-002
feature: FS-050
title: "Backward Compatible API (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-002: Backward Compatible API (P1)

**Feature**: [FS-050](./FEATURE.md)

**As a** developer
**I want** `checkRateLimit()` API unchanged
**So that** no changes needed in calling code

---

## Acceptance Criteria

- [x] **AC-US2-01**: `checkRateLimit(identifier)` signature unchanged
- [x] **AC-US2-02**: Returns same `{ allowed, remaining, resetIn }` shape
- [x] **AC-US2-03**: Falls back to in-memory if KV unavailable

---

## Implementation

**Increment**: [0050-0041-rate-limiter-kv](../../../../../increments/0050-0041-rate-limiter-kv/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
