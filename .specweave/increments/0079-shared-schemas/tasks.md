# Tasks: 0079-shared-schemas

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), opus (complex)

---

## Phase 1: Create Schema Module

### T-001: Create src/lib/schemas/common.ts
**Model**: haiku
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05

**Implementation**:
1. Create `src/lib/schemas/` directory
2. Create `common.ts` with:
```typescript
import * as z from 'zod';

export const emailSchema = z.email({ error: 'Valid email required' });
export const requiredString = (message = 'Required') => z.string().min(1, message);
export const optionalString = () => z.string().optional();
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');
export const countryCodeSchema = z.string().default('+670');
```

**Test Plan**:
- File: `src/lib/schemas/common.ts`
- Verify: Schema exports correctly

**Status**: [x]

---

### T-002: Create src/lib/schemas/common.test.ts
**Model**: opus
**AC**: AC-US3-01, AC-US3-02, AC-US3-03

**Implementation**:
1. Create test file with tests for all schemas
2. Test email validation (valid/invalid)
3. Test phone validation (Timor format)
4. Test requiredString with custom messages

**Test Plan**:
- File: `src/lib/schemas/common.test.ts`
- TC-001: emailSchema accepts valid emails
- TC-002: emailSchema rejects invalid emails
- TC-003: phoneSchema accepts +670 format
- TC-004: requiredString produces correct errors

**Status**: [x]

---

## Phase 2: Update Actions

### T-003: Update signIn.ts
**Model**: haiku
**AC**: AC-US2-01

**Implementation**:
1. Import `emailSchema`, `requiredString`
2. Replace inline z.email() with emailSchema
3. Replace inline z.string().min(1) with requiredString()

**Test Plan**:
- File: `src/actions/auth/signIn.ts`
- TC-001: Sign in works with valid email
- TC-002: Sign in shows validation error for invalid email

**Status**: [x]

---

### T-004: Update signUp.ts
**Model**: haiku
**AC**: AC-US2-02

**Implementation**:
1. Import `emailSchema`, `requiredString`
2. Replace inline z.email() with emailSchema
3. Replace password validation if needed

**Test Plan**:
- File: `src/actions/auth/signUp.ts`
- TC-001: Sign up works with valid email

**Status**: [x]

---

### T-005: Update business/create.ts
**Model**: haiku
**AC**: AC-US2-03

**Implementation**:
1. Import `phoneSchema` from shared schemas
2. Replace inline phone validation

**Test Plan**:
- File: `src/actions/business/create.ts`
- TC-001: Business creation validates phone correctly

**Status**: [x]

---

## Phase 3: Verification

### T-006: Run all tests
**Model**: opus
**AC**: AC-US3-04

**Implementation**:
1. Run `pnpm test`
2. Verify 399+ tests pass
3. Fix any failures

**Test Plan**:
- Command: `pnpm test`
- TC-001: All tests pass

**Status**: [x]

---

### T-007: Build verification
**Model**: opus
**AC**: All

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
| T-001 | AC-US1 | haiku | [ ] |
| T-002 | AC-US3 | opus | [ ] |
| T-003 | AC-US2 | haiku | [ ] |
| T-004 | AC-US2 | haiku | [ ] |
| T-005 | AC-US2 | haiku | [ ] |
| T-006 | AC-US3 | opus | [ ] |
| T-007 | All | opus | [ ] |

**Dependencies**: T-001 → T-002 → T-003/4/5 (sequential), T-006/7 (end)

**Total**: 7 tasks