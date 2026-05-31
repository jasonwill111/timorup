# Tasks: 0082-media-upload-pipeline

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), opus (complex)

---

## Phase 1: Add Media Error Codes

### T-001: Add MEDIA_* error codes
**Model**: haiku
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05

**Implementation**:
1. Add MEDIA_NO_FILE, MEDIA_TYPE_NOT_ALLOWED, MEDIA_SIZE_TOO_LARGE, MEDIA_LIMIT_REACHED to errorCodes.ts
2. Add status codes for each

**Status**: [x]

---

## Phase 2: Create Media Validator Module

### T-002: Create src/lib/media/validator.ts
**Model**: opus
**AC**: AC-US2-01, AC-US2-02, AC-US2-03

**Implementation**:
1. Create `validateMediaFile(file, entityType)` function
2. Create `buildR2Key()` function (moved from upload.ts)
3. Export MediaValidationResult type

**Status**: [x]

---

### T-003: Create src/lib/media/validator.test.ts
**Model**: opus
**AC**: AC-US4-01, AC-US4-02

**Implementation**:
1. Test file type validation
2. Test size validation
3. Test buildR2Key

**Status**: [x]

---

### T-004: Create src/lib/media/index.ts
**Model**: haiku
**AC**: All

**Implementation**:
1. Create barrel export

**Status**: [x]

---

## Phase 3: Update Upload Action

### T-005: Update upload.ts
**Model**: opus
**AC**: AC-US3-01, AC-US3-02, AC-US3-03

**Implementation**:
1. Import validateMediaFile from @/lib/media/validator
2. Import getErrorMessage, createErrorResponse from @/lib/errors
3. Replace inline validation with validateMediaFile()
4. Replace error returns with createErrorResponse()

**Status**: [x]

---

## Phase 4: Verification

### T-006: Run tests
**Model**: opus
**AC**: AC-US4-03

**Implementation**:
1. Run `pnpm test`
2. Verify 468+ tests pass

**Status**: [x]

---

### T-007: Build
**Model**: opus
**AC**: All

**Implementation**:
1. Run `pnpm build`
2. Verify no errors

**Status**: [x]

---

## Summary

| Task | AC | Model | Status |
|------|----|-------|--------|
| T-001 | AC-US1 | haiku | [x] |
| T-002 | AC-US2 | opus | [x] |
| T-003 | AC-US4 | opus | [x] |
| T-004 | All | haiku | [x] |
| T-005 | AC-US3 | opus | [x] |
| T-006 | AC-US4 | opus | [x] |
| T-007 | All | opus | [x] |

**Total**: 7 tasks