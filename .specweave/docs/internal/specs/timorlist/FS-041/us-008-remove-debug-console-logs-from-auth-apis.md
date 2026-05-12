---
id: US-008
feature: FS-041
title: "Remove Debug Console Logs from Auth APIs"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-008: Remove Debug Console Logs from Auth APIs

**Feature**: [FS-041](./FEATURE.md)

**As a** developer
**I want** the sign-in API to not log user-specific debug data
**So that** sensitive information is not leaked to logs

---

## Acceptance Criteria

- [x] **AC-US8-01**: `pages/api/auth/sign-in.ts` removes `console.log` statements that log user data
- [x] **AC-US8-02**: Keep error logging for failed operations

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
