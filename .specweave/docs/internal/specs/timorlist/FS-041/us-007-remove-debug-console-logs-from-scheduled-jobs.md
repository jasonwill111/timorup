---
id: US-007
feature: FS-041
title: "Remove Debug Console Logs from Scheduled Jobs"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** system administrator."
project: timorlist
---

# US-007: Remove Debug Console Logs from Scheduled Jobs

**Feature**: [FS-041](./FEATURE.md)

**As a** system administrator
**I want** scheduled cleanup jobs to log only meaningful events
**So that** I can quickly identify issues in logs

---

## Acceptance Criteria

- [x] **AC-US7-01**: `pages/api/scheduled/_cleanup.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-02**: `pages/api/scheduled/_mark-expired.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-03**: `pages/api/scheduled/_cleanup-orphan-media.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-04**: `pages/api/scheduled/_cleanup-expired.ts` removes routine progress logs, keeps error/warning logs

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
