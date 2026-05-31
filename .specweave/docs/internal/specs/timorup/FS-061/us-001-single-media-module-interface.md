---
id: US-001
feature: FS-061
title: "Single Media Module Interface"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: TimorLink
---

# US-001: Single Media Module Interface

**Feature**: [FS-061](./FEATURE.md)

**As a** developer
**I want** one module with consistent interface for all R2 operations
**So that** I don't have to remember which file has which function

---

## Acceptance Criteria

- [x] **AC-US1-01**: All R2 utilities consolidated in `src/lib/media.ts`
- [x] **AC-US1-02**: `buildR2Key(params: MediaUploadParams)` signature consistent across all callers
- [x] **AC-US1-03**: All `getR2Bucket()`, `deleteFromR2()`, `getPublicUrl()` calls use consolidated module
- [x] **AC-US1-04**: `media/index.ts` and `media/r2.ts` removed after migration

---

## Implementation

**Increment**: [0061-media-module-consolidation](../../../../../increments/0061-media-module-consolidation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
