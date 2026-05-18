---
increment: 0061-media-module-consolidation
title: "Media Module Consolidation"
type: feature
priority: P1
status: planned
created: 2026-05-18
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Media Module Consolidation

## Overview

Consolidate fragmented R2 utilities across `media/index.ts`, `media/r2.ts`, `media.ts`, and `actions/media/upload.ts` into a single source of truth with consistent interface.

## User Stories

### US-001: Single Media Module Interface
**Project**: timorlist

**As a** developer
**I want** one module with consistent interface for all R2 operations
**So that** I don't have to remember which file has which function

**Acceptance Criteria**:
- [x] **AC-US1-01**: All R2 utilities consolidated in `src/lib/media.ts`
- [x] **AC-US1-02**: `buildR2Key(params: MediaUploadParams)` signature consistent across all callers
- [x] **AC-US1-03**: All `getR2Bucket()`, `deleteFromR2()`, `getPublicUrl()` calls use consolidated module
- [x] **AC-US1-04**: `media/index.ts` and `media/r2.ts` removed after migration

### US-002: Type Safety for Media Operations
**Project**: timorlist

**As a** developer
**I want** strongly-typed media interfaces
**So that** typos fail at compile time, not runtime

**Acceptance Criteria**:
- [x] **AC-US2-01**: `EntityType`, `MediaCategory`, `MediaType` enums properly exported
- [x] **AC-US2-02**: `MediaUploadParams` interface clearly defines required fields
- [x] **AC-US2-03**: Upload/delete functions return typed results (`UploadResult`, `boolean`)

### US-003: Delete Legacy API Route
**Project**: timorlist

**As a** developer
**I want** the legacy `pages/api/media/upload.ts` removed
**So that** only Astro actions handle media uploads

**Acceptance Criteria**:
- [x] **AC-US3-01**: `src/pages/api/media/upload.ts` deleted
- [x] **AC-US3-02**: No remaining imports from the deleted route

### US-004: Update Scheduled Cleanup Endpoints
**Project**: timorlist

**As a** developer
**I want** scheduled cleanup endpoints to import from consolidated media module
**So that** inline R2 helpers are removed

**Acceptance Criteria**:
- [x] **AC-US4-01**: `api/scheduled/_cleanup.ts` imports from `src/lib/media.ts`
- [x] **AC-US4-02**: `api/scheduled/_cleanup-orphan-media.ts` imports from `src/lib/media.ts`
- [x] **AC-US4-03**: No inline `getR2Bucket()`, `deleteFromR2()`, `deleteFolderFromR2()` in cleanup files

## Technical Notes

**Files to consolidate**:
- `src/lib/media/index.ts` — re-export barrel (DELETE)
- `src/lib/media/r2.ts` — R2 utilities (DELETE, move to media.ts)
- `src/lib/media.ts` — parallel utilities + S3 + sharp (KEEP, enhance)
- `src/actions/media/upload.ts` — primary upload (KEEP, update imports)
- `src/pages/api/media/upload.ts` — legacy API (DELETE, safe: no module imports)
- `src/pages/api/scheduled/_cleanup.ts` — inline R2 (UPDATE imports)
- `src/pages/api/scheduled/_cleanup-orphan-media.ts` — inline R2 (UPDATE imports)

**Key signature to standardize**:
```typescript
// Target interface for buildR2Key
export interface MediaUploadParams {
  entityType: EntityType;
  entityId: string;
  category: MediaCategory;
  filename: string;
}

export function buildR2Key(params: MediaUploadParams): string
```

**Deletion test results**:
- `pages/api/media/upload.ts` — **CAN DELETE** (no module imports, only HTTP handler)
- `media/index.ts` — DELETE after updating imports
- `media/r2.ts` — DELETE after moving functions to media.ts

## Out of Scope

- Changing upload action logic (only refactoring imports)
- Modifying R2 bucket configuration
- Adding new media features
- E2E tests for media upload (existing tests sufficient)