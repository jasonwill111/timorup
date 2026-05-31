# Tasks: 0081-error-handler

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), opus (complex)

---

## Phase 1: Create Error Module

### T-001: Create errorCodes.ts
**Model**: haiku
**AC**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05
**Test Mode**: TDD

**Implementation**:
1. Create `src/lib/errors/errorCodes.ts`
2. Define ErrorCode enum with categories:
   - AUTH_* (1xxx)
   - BUSINESS_* (2xxx)
   - PRODUCT_* (3xxx)
   - VALIDATION_* (4xxx)
   - SUBSCRIPTION_* (5xxx)
   - MEDIA_* (6xxx)
   - SERVER_* (9xxx)

**Test Plan**: N/A (constants only)

**Status**: [x]

---

### T-002: Create AppError.ts
**Model**: opus
**AC**: AC-US1-01
**Test Mode**: TDD

**Implementation**:
1. Create AppError class extending Error
2. Add code and statusCode properties
3. Add toJSON() method
4. Export isAppError helper

**Test Plan**:
- File: `src/lib/errors/errors.test.ts`
- TC-001: AppError has code, message, statusCode
- TC-002: toJSON returns standardized format
- TC-003: isAppError works correctly

**Status**: [x]

---

### T-003: Create errorUtils.ts
**Model**: haiku
**AC**: AC-US1-03, AC-US1-04
**Test Mode**: TDD

**Implementation**:
1. getErrorMessage() — extract message from any error
2. createErrorResponse() — create standardized response
3. getErrorCode() — extract code from AppError

**Test Plan**:
- File: `src/lib/errors/errors.test.ts`
- TC-001: getErrorMessage extracts from Error
- TC-002: createErrorResponse creates valid response
- TC-003: getErrorCode extracts from AppError

**Status**: [x]

---

### T-004: Create index.ts
**Model**: haiku
**AC**: All
**Test Mode**: TDD

**Implementation**:
1. Create barrel export file

**Test Plan**: N/A

**Status**: [x]

---

## Phase 2: Write Tests

### T-005: Write error tests (RED then GREEN)
**Model**: opus
**AC**: AC-US4-01, AC-US4-02, AC-US4-03
**Test Mode**: TDD

**Implementation**:
1. Create `errors.test.ts` with 21 tests
2. Test all ErrorCode values
3. Test AppError class
4. Test utility functions

**Test Plan**:
- File: `src/lib/errors/errors.test.ts`
- TC-001: ErrorCode enum values
- TC-002: AppError status mapping
- TC-003: isAppError type guard
- TC-004: getErrorMessage edge cases
- TC-005: createErrorResponse format

**Status**: [x]

---

## Phase 3: Actions Integration

### T-006: Update signIn.ts
**Model**: haiku
**AC**: AC-US3-01
**Test Mode**: TDD

**Implementation**:
1. Import from @/lib/errors
2. Replace inline getErrorMessage with shared version
3. Replace 'DB_ERROR' with ErrorCode.SERVER_DB_ERROR

**Test Plan**:
- File: `src/actions/auth/signIn.ts`
- TC-001: Sign in works with new error handling

**Status**: [x]

---

### T-007: Update signUp.ts
**Model**: haiku
**AC**: AC-US3-02
**Test Mode**: TDD

**Implementation**:
1. Import from @/lib/errors
2. Replace inline getErrorMessage
3. Replace 'RATE_LIMITED' with ErrorCode.AUTH_RATE_LIMITED
4. Replace 'USER_EXISTS' with ErrorCode.AUTH_USER_EXISTS

**Test Plan**:
- File: `src/actions/auth/signUp.ts`
- TC-001: Sign up works with new error handling

**Status**: [x]

---

### T-008: Update business/create.ts
**Model**: haiku
**AC**: AC-US3-03
**Test Mode**: TDD

**Implementation**:
1. Import from @/lib/errors
2. Use ErrorCode.SERVER_ERROR for generic errors

**Test Plan**:
- File: `src/actions/business/create.ts`
- TC-001: Business creation works

**Status**: [x]

---

### T-009: Update products/create.ts
**Model**: haiku
**AC**: AC-US3-04
**Test Mode**: TDD

**Implementation**:
1. Review products/create.ts for error handling consistency

**Test Plan**:
- File: `src/actions/products/create.ts`
- TC-001: Product creation works

**Status**: [x]

---

## Phase 4: Verification

### T-010: Run all tests
**Model**: opus
**AC**: AC-US4-04
**Test Mode**: TDD

**Implementation**:
1. Run `pnpm test`
2. Verify 455+ tests pass
3. Fix any failures

**Test Plan**:
- Command: `pnpm test`
- TC-001: All tests pass

**Status**: [x]

---

### T-011: Build verification
**Model**: opus
**AC**: All
**Test Mode**: TDD

**Implementation**:
1. Run `pnpm build`
2. Verify no errors

**Test Plan**:
- Command: `pnpm build`
- TC-001: Build succeeds

**Status**: [x]

---

## Summary

| Task | AC | Model | Status |
|------|----|-------|--------|
| T-001 | AC-US2 | haiku | [x] |
| T-002 | AC-US1 | opus | [x] |
| T-003 | AC-US1 | haiku | [x] |
| T-004 | All | haiku | [x] |
| T-005 | AC-US4 | opus | [x] |
| T-006 | AC-US3 | haiku | [x] |
| T-007 | AC-US3 | haiku | [x] |
| T-008 | AC-US3 | haiku | [x] |
| T-009 | AC-US3 | haiku | [x] |
| T-010 | AC-US4 | opus | [ ] |
| T-011 | All | opus | [ ] |

**Total**: 11 tasks