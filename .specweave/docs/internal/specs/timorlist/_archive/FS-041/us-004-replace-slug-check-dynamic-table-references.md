---
id: US-004
feature: FS-041
title: "Replace Slug Check Dynamic Table References"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-004: Replace Slug Check Dynamic Table References

**Feature**: [FS-041](./FEATURE.md)

**As a** developer
**I want** the slug-check API to use proper Drizzle table types
**So that** database operations are type-safe

---

## Acceptance Criteria

- [x] **AC-US4-01**: `table` variable uses `typeof businessPages | typeof blogPosts | typeof landingPages` type
- [x] **AC-US4-02**: `slugField` variable uses proper field reference types

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
