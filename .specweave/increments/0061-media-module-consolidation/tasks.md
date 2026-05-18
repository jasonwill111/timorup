# Tasks: Media Module Consolidation

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[x] Completed`: Not started
- `[x]`: Completed

## Phase 1: Enhance src/lib/media.ts

### T-001: Add buildR2Key from r2.ts
**Description**: Copy `buildR2Key(params: MediaUploadParams)` from `src/lib/media/r2.ts` into `src/lib/media.ts`. Standardize signature.

**References**: AC-US1-01, AC-US1-02

**Implementation Details**:
- Read `src/lib/media/r2.ts` lines 27-45
- Copy function to `src/lib/media.ts`
- Update return type to `string`
- Add JSDoc with usage examples

**Test Plan**:
- **File**: `src/lib/media.test.ts`
- **Tests**:
  - **TC-001**: buildR2Key generates correct path for business entity
    - Given `MediaUploadParams` with `entityType: 'business'`, `entityId: '123'`, `category: 'gallery'`, `filename: 'test.jpg'`
    - When `buildR2Key(params)` called
    - Then returns string matching `business/123/gallery/test.jpg`
  - **TC-002**: buildR2Key handles special characters in filename
    - Given filename with spaces and unicode
    - When `buildR2Key(params)` called
    - Then filename is URL-safe
  - **TC-003**: buildR2Key generates unique keys for different categories
    - Given same entityId but different categories
    - When `buildR2Key()` called for each
    - Then keys are different

**Dependencies**: None
**Status**: [x] Completed

### T-002: Add listByPrefix from r2.ts
**Description**: Copy `listByPrefix(prefix: string, limit?: number)` from `src/lib/media/r2.ts` into `src/lib/media.ts`.

**References**: AC-US1-01, AC-US1-03

**Implementation Details**:
- Read `src/lib/media/r2.ts` lines 80-105
- Copy function, merge with existing `listByPrefix` if exists
- Ensure returns `R2Object[]`

**Test Plan**:
- **File**: `src/lib/media.test.ts`
- **Tests**:
  - **TC-004**: listByPrefix returns empty array when no objects
    - Given empty R2 bucket
    - When `listByPrefix('nonexistent/')` called
    - Then returns `[]`
  - **TC-005**: listByPrefix respects limit parameter
    - Given more than 5 objects with prefix
    - When `listByPrefix('test/', 5)` called
    - Then returns at most 5 objects

**Dependencies**: T-001
**Status**: [x] Completed

### T-003: Add isAllowedImageType/VideoType exports
**Description**: Copy type validation functions from `src/lib/media/r2.ts` into `src/lib/media.ts` and export.

**References**: AC-US2-01, AC-US2-02

**Implementation Details**:
- Read `src/lib/media/r2.ts` lines 47-62
- Copy `isAllowedImageType(mimeType)` and `isAllowedVideoType(mimeType)`
- Ensure return type is `boolean`
- Add to exports

**Test Plan**:
- **File**: `src/lib/media.test.ts`
- **Tests**:
  - **TC-006**: isAllowedImageType accepts valid image types
    - Given mimeTypes: `['image/jpeg', 'image/png', 'image/webp', 'image/gif']`
    - When `isAllowedImageType(type)` called for each
    - Then returns `true`
  - **TC-007**: isAllowedImageType rejects non-image types
    - Given mimeTypes: `['video/mp4', 'application/pdf', 'text/plain']`
    - When `isAllowedImageType(type)` called for each
    - Then returns `false`

**Dependencies**: T-001
**Status**: [x] Completed

### T-004: Ensure isR2Available() exported
**Description**: Verify `isR2Available()` function exists and is exported from `src/lib/media.ts`.

**References**: AC-US1-03

**Implementation Details**:
- Check if `isR2Available()` exists in `src/lib/media.ts`
- If missing, add it (checks `env.MEDIA_BUCKET` existence)
- Ensure exported for use by cleanup endpoints

**Test Plan**:
- **File**: `src/lib/media.test.ts`
- **Tests**:
  - **TC-008**: isR2Available returns false when bucket undefined
    - Given `env.MEDIA_BUCKET` is undefined
    - When `isR2Available()` called
    - Then returns `false`
  - **TC-009**: isR2Available returns true when bucket defined
    - Given `env.MEDIA_BUCKET` is R2Bucket
    - When `isR2Available()` called
    - Then returns `true`

**Dependencies**: None
**Status**: [x] Completed

## Phase 2: Update Callers

### T-005: Update actions/media/upload.ts imports
**Description**: Update `src/actions/media/upload.ts` to import all R2 utilities from `src/lib/media.ts` instead of inline definitions.

**References**: AC-US1-03, AC-US1-04

**Implementation Details**:
- Read current imports in `src/actions/media/upload.ts`
- Remove inline `getR2Bucket()`, `getR2PublicUrl()`, `buildR2Key()` definitions
- Add `import { getR2Bucket, getR2PublicUrl, buildR2Key, isR2Available, isAllowedImageType, isAllowedVideoType } from '@/lib/media'`
- Verify function calls still work with unified interface

**Test Plan**:
- **File**: `src/actions/media/upload.test.ts` (check exists)
- **Tests**:
  - **TC-010**: upload action uses correct buildR2Key signature
    - Given media upload with entityType 'business'
    - When upload action executes
    - Then key generated matches `business/{id}/...`

**Dependencies**: T-001, T-003
**Status**: [x] Completed

### T-006: Update actions/media/delete.ts imports
**Description**: Update `src/actions/media/delete.ts` to import from consolidated `src/lib/media.ts`.

**References**: AC-US1-03, AC-US1-04

**Implementation Details**:
- Read current imports in `src/actions/media/delete.ts`
- Remove inline R2 helpers if any
- Add imports from `src/lib/media.ts`

**Test Plan**:
- **File**: `src/actions/media/delete.test.ts` (check exists)
- **Tests**:
  - **TC-011**: delete action imports from single source
    - Given delete action is imported
    - When module loaded
    - Then no duplicate R2 definitions

**Dependencies**: T-001
**Status**: [x] Completed

### T-007: Update api/scheduled/_cleanup.ts
**Description**: Update `src/pages/api/scheduled/_cleanup.ts` to import from `src/lib/media.ts` instead of inline helpers.

**References**: AC-US4-01

**Implementation Details**:
- Read `src/pages/api/scheduled/_cleanup.ts`
- Find inline `getR2Bucket()` and `deleteFolderFromR2()` definitions
- Replace with imports from `@/lib/media`

**Test Plan**:
- **File**: `src/pages/api/scheduled/_cleanup.test.ts` (check exists)
- **Tests**:
  - **TC-012**: cleanup imports deleteFolderFromR2 from media module
    - Given cleanup endpoint loaded
    - When R2 operations called
    - Then uses `src/lib/media.ts` functions

**Dependencies**: T-001, T-002
**Status**: [x] Completed

### T-008: Update api/scheduled/_cleanup-orphan-media.ts
**Description**: Update `src/pages/api/scheduled/_cleanup-orphan-media.ts` to import from `src/lib/media.ts`.

**References**: AC-US4-02

**Implementation Details**:
- Read `src/pages/api/scheduled/_cleanup-orphan-media.ts`
- Find inline R2 helpers
- Replace with imports from `@/lib/media`

**Test Plan**:
- **File**: `src/pages/api/scheduled/_cleanup-orphan-media.test.ts` (check exists)
- **Tests**:
  - **TC-013**: orphan cleanup imports from media module
    - Given orphan cleanup endpoint loaded
    - When R2 operations called
    - Then uses `src/lib/media.ts` functions

**Dependencies**: T-001, T-002
**Status**: [x] Completed

## Phase 3: Delete Deprecated Files

### T-009: Update src/lib/media/test.ts imports
**Description**: Update test imports in `src/lib/media/test.ts` to point to `src/lib/media.ts` after consolidation.

**References**: AC-US1-04, AC-US2-03

**Implementation Details**:
- Read `src/lib/media/test.ts`
- Update all imports from `@/lib/media` to still work (alias should auto-resolve)
- Verify test functions still import correctly

**Test Plan**:
- **File**: `src/lib/media/test.ts`
- **Tests**:
  - **TC-014**: all imports resolve after consolidation
    - Given test file imports from `@/lib/media`
    - When test runs
    - Then all imports resolve without errors

**Dependencies**: T-001, T-002, T-003, T-004
**Status**: [x] Completed

### T-010: Delete src/lib/media/index.ts
**Description**: Remove `src/lib/media/index.ts` re-export barrel.

**References**: AC-US1-04

**Implementation Details**:
- Verify no remaining imports from `src/lib/media/index.ts`
- Run `grep -r "media/index" src/` to confirm
- Delete file

**Test Plan**:
- **File**: `tests/integration/media-module.test.ts`
- **Tests**:
  - **TC-015**: media/index.ts no longer exists
    - Given file system check
    - When `src/lib/media/index.ts` accessed
    - Then file not found error
  - **TC-016**: no imports from media/index.ts remain
    - Given grep search for imports
    - When searching `src/lib/media/index`
    - Then no results

**Dependencies**: T-005, T-006, T-007, T-008, T-009
**Status**: [x] Completed

### T-011: Delete src/lib/media/r2.ts
**Description**: Remove `src/lib/media/r2.ts` after functions moved to media.ts.

**References**: AC-US1-04

**Implementation Details**:
- Verify all functions from r2.ts are in media.ts
- Run `grep -r "media/r2" src/` to confirm no imports
- Delete file

**Test Plan**:
- **File**: `tests/integration/media-module.test.ts`
- **Tests**:
  - **TC-017**: media/r2.ts no longer exists
    - Given file system check
    - When `src/lib/media/r2.ts` accessed
    - Then file not found error

**Dependencies**: T-001, T-002, T-003, T-010
**Status**: [x] Completed

### T-012: Delete src/pages/api/media/upload.ts
**Description**: Remove legacy API route with no module imports.

**References**: AC-US3-01, AC-US3-02

**Implementation Details**:
- Verify no imports from `src/pages/api/media/upload.ts`
- Run `grep -r "api/media/upload" src/` to confirm
- Delete file

**Test Plan**:
- **File**: `tests/integration/media-module.test.ts`
- **Tests**:
  - **TC-018**: legacy upload route deleted
    - Given file system check
    - When `src/pages/api/media/upload.ts` accessed
    - Then file not found error
  - **TC-019**: no imports from legacy route
    - Given grep search for imports
    - When searching `pages/api/media/upload`
    - Then no results

**Dependencies**: None
**Status**: [x] Completed

## Phase 4: Verification

### T-013: Run all media tests
**Description**: Execute all existing tests to verify consolidation didn't break functionality.

**References**: All ACs

**Test Plan**:
- Run `pnpm test -- src/lib/media.test.ts`
- Run `pnpm test -- src/actions/media/`
- Run `pnpm test -- src/pages/api/scheduled/`

**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012
**Status**: [x] Completed

### T-014: Type check
**Description**: Run TypeScript type check to verify no type errors from consolidation.

**Test Plan**:
- Run `pnpm typecheck` or `npx tsc --noEmit`
- Fix any type errors found

**Dependencies**: T-013
**Status**: [x] Completed