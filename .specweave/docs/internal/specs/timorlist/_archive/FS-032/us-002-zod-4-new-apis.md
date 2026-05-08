---
id: US-002
feature: FS-032
title: "Zod 4 New APIs"
status: completed
priority: P1
created: 2026-05-07
tldr: "**As a** developer."
project: timorlist
---

# US-002: Zod 4 New APIs

**Feature**: [FS-032](./FEATURE.md)

**As a** developer
**I want** to use Zod 4 new APIs
**So that** schemas are cleaner and type-safe

---

## Acceptance Criteria

- [x] **AC-US2-01**: z.string().email() replaced with z.email()
- [x] **AC-US2-02**: URL validation uses z.url()
- [x] **AC-US2-03**: z.coerce used for type conversion (number, boolean)

---

## Implementation

**Increment**: [0032-zod4-upgrade](../../../../../increments/0032-zod4-upgrade/spec.md)

**Tasks**: See increment tasks.md for implementation details.
