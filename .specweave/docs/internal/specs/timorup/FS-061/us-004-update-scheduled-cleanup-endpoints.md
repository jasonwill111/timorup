---
id: US-004
feature: FS-061
title: "Update Scheduled Cleanup Endpoints"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: TimorLink
---

# US-004: Update Scheduled Cleanup Endpoints

**Feature**: [FS-061](./FEATURE.md)

**As a** developer
**I want** scheduled cleanup endpoints to import from consolidated media module
**So that** inline R2 helpers are removed

---

## Acceptance Criteria

- [x] **AC-US4-01**: `api/scheduled/_cleanup.ts` imports from `src/lib/media.ts`
- [x] **AC-US4-02**: `api/scheduled/_cleanup-orphan-media.ts` imports from `src/lib/media.ts`
- [x] **AC-US4-03**: No inline `getR2Bucket()`, `deleteFromR2()`, `deleteFolderFromR2()` in cleanup files

---

## Implementation

**Increment**: [0061-media-module-consolidation](../../../../../increments/0061-media-module-consolidation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
