---
increment: 0061-media-module-consolidation
title: "Media Module Consolidation"
generated: "2026-05-18"
version: "1.0"
status: planned
---

# Quality Contract: Media Module Consolidation

## Overview

This increment consolidates fragmented R2 utilities into single source of truth. Quality gates ensure no regressions.

## Quality Gates

### Gate 1: Compilation
- [ ] TypeScript compiles without errors
- [ ] No `any` types in consolidated module
- [ ] All interfaces properly exported

### Gate 2: Test Coverage
- [ ] Unit tests pass for `buildR2Key`
- [ ] Unit tests pass for `listByPrefix`
- [ ] Unit tests pass for `isAllowedImageType/VideoType`
- [ ] Existing tests still pass (`pnpm test -- src/lib/media.test.ts`)
- [ ] Coverage target: 80%

### Gate 3: Import Verification
- [ ] No imports from `src/lib/media/index.ts`
- [ ] No imports from `src/lib/media/r2.ts`
- [ ] No imports from `src/pages/api/media/upload.ts`
- [ ] All R2 operations use `src/lib/media.ts`

### Gate 4: Functional Verification
- [ ] Upload action works with new interface
- [ ] Delete action works with new interface
- [ ] Cleanup endpoints work with new interface
- [ ] `buildR2Key` generates correct paths for all entity types

## Acceptance Criteria Summary

| AC | Description | Test |
|----|-------------|------|
| AC-US1-01 | All R2 utilities consolidated in src/lib/media.ts | Type check + import grep |
| AC-US1-02 | buildR2Key signature consistent | Unit tests |
| AC-US1-03 | All callers use consolidated module | Import verification |
| AC-US1-04 | media/index.ts and media/r2.ts removed | File existence check |
| AC-US2-01 | Enums properly exported | Type check |
| AC-US2-02 | MediaUploadParams interface defined | Type check |
| AC-US2-03 | Functions return typed results | Type check |
| AC-US3-01 | Legacy upload route deleted | File existence check |
| AC-US3-02 | No remaining imports | Import grep |
| AC-US4-01 | _cleanup.ts uses consolidated module | Import verification |
| AC-US4-02 | _cleanup-orphan-media.ts uses consolidated module | Import verification |
| AC-US4-03 | No inline R2 helpers | Code review |

## Rollback Plan

If issues detected:
1. Revert deleted files from git: `git checkout HEAD -- src/lib/media/index.ts src/lib/media/r2.ts`
2. Revert import changes in affected files
3. Re-run tests to verify restored state

## Success Metrics

- 0 type errors after consolidation
- All 14 unit tests pass
- Import grep returns 0 results for deleted files
- No functional regressions in upload/delete flows