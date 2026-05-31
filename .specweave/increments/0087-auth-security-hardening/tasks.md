# Tasks: Auth Security Hardening

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- Model hints: haiku (simple), opus (default)

## Phase 1: Error Code Setup

### T-001: Add missing error codes
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03 | **Status**: [x] completed

**Files**: `src/lib/errors/errorCodes.ts`

**Implementation**:
1. Add `AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS'` to auth errors
2. Add `VALIDATION_PASSWORD_TOO_WEAK = 'VALIDATION_PASSWORD_TOO_WEAK'` to validation errors
3. Add status mappings in `ErrorCodeToStatus`

**Test Plan**:
- **File**: `src/lib/errors/errors.test.ts`
- **Tests**:
  - **TC-001**: AUTH_INVALID_CREDENTIALS should map to 401
    - Given `ErrorCode.AUTH_INVALID_CREDENTIALS`
    - When `ErrorCodeToStatus[code]` is called
    - Then return `401`
  - **TC-002**: VALIDATION_PASSWORD_TOO_WEAK should map to 400
    - Given `ErrorCode.VALIDATION_PASSWORD_TOO_WEAK`
    - When `ErrorCodeToStatus[code]` is called
    - Then return `400`

**Dependencies**: None

---

## Phase 2: Password Schema

### T-002: Create password complexity schema
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04, AC-US3-05 | **Status**: [x] completed

**Files**: `src/lib/schemas/auth.ts`, `src/lib/schemas/index.ts`

**Implementation**:
1. Create `src/lib/schemas/auth.ts` with `passwordSchema`
2. Add all regex validators with custom error messages
3. Export from `src/lib/schemas/index.ts`

**Test Plan**:
- **File**: `src/lib/schemas/auth.test.ts` (create)
- **Tests**:
  - **TC-001**: Valid password passes all checks
    - Given `"Password123!"` (uppercase, lowercase, number, special)
    - When `passwordSchema.parse(value)`
    - Then return the string without error
  - **TC-002**: Missing uppercase fails
    - Given `"password123!"`
    - When `passwordSchema.safeParse(value)`
    - Then `success: false` with message containing "uppercase"
  - **TC-003**: Missing lowercase fails
    - Given `"PASSWORD123!"`
    - When `passwordSchema.safeParse(value)`
    - Then `success: false` with message containing "lowercase"
  - **TC-004**: Missing number fails
    - Given `"Passwordabc!"`
    - When `passwordSchema.safeParse(value)`
    - Then `success: false` with message containing "number"
  - **TC-005**: Missing special character fails
    - Given `"Password123"`
    - When `passwordSchema.safeParse(value)`
    - Then `success: false` with message containing "special"
  - **TC-006**: Too short password fails
    - Given `"Pass1!"` (7 chars)
    - When `passwordSchema.safeParse(value)`
    - Then `success: false` with message containing "8 characters"

**Dependencies**: T-001 (needs ErrorCode to exist)

---

## Phase 3: Rate Limiting

### T-003: Add rate limiting to signIn action
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03, AC-US1-04 | **Status**: [x] completed

**Files**: `src/actions/auth/signIn.ts`

**Implementation**:
1. Import `checkRateLimitKV` from `@/lib/rate-limit`
2. Add rate limit check at start of handler
3. Use identifier `auth-sign-in`
4. Return `ErrorCode.AUTH_RATE_LIMITED` when limited
5. Replace inline `'SIGN_IN_ERROR'` with `ErrorCode.AUTH_INVALID_CREDENTIALS`

**Test Plan**:
- **File**: `src/actions/auth/signIn.test.ts`
- **Tests**:
  - **TC-001**: Rate limit exceeded returns 429
    - Given rate limit of 100 req/min, simulate 100+ rapid calls
    - When action is invoked
    - Then `success: false` with `error.code: 'AUTH_RATE_LIMITED'`
  - **TC-002**: Rate limit includes resetIn
    - Given rate limit exceeded
    - When error returned
    - Then `error.resetIn` is a number > 0
  - **TC-003**: Successful sign-in returns user
    - Given valid credentials
    - When `signIn({ email, password })`
    - Then `success: true` with `user` object
  - **TC-004**: Invalid credentials returns AUTH_INVALID_CREDENTIALS
    - Given wrong password
    - When `signIn({ email, wrongPassword })`
    - Then `success: false` with `error.code: 'AUTH_INVALID_CREDENTIALS'`

**Dependencies**: T-001

### T-004: Add rate limiting to signUp action
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed

**Files**: `src/actions/auth/signUp.ts`

**Implementation**:
1. Import `checkRateLimitKV` from `@/lib/rate-limit`
2. Add rate limit check at start of handler
3. Use identifier `auth-sign-up`
4. Return `ErrorCode.AUTH_RATE_LIMITED` when limited
5. Use `passwordSchema` from `src/lib/schemas/auth.ts`
6. Add password complexity validation error handling

**Test Plan**:
- **File**: `src/actions/auth/signUp.test.ts` (create)
- **Tests**:
  - **TC-001**: Rate limit exceeded returns 429
    - Given 100+ rapid sign-up attempts
    - When action is invoked
    - Then `success: false` with `error.code: 'AUTH_RATE_LIMITED'`
  - **TC-002**: Weak password returns validation error
    - Given `password: 'password123'`
    - When `signUp({ email, password, name })`
    - Then `success: false` with password complexity error
  - **TC-003**: Duplicate email returns AUTH_USER_EXISTS
    - Given existing email
    - When `signUp({ email, password: 'Valid123!', name })`
    - Then `success: false` with `error.code: 'AUTH_USER_EXISTS'`
  - **TC-004**: Successful sign-up returns user
    - Given valid credentials and strong password
    - When `signUp({ email, password: 'ValidPass123!', name })`
    - Then `success: true` with `user` object

**Dependencies**: T-001, T-002

---

## Phase 4: Cookie Security

### T-005: Configure secure session cookies
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed

**Files**: `src/lib/auth.ts`

**Implementation**:
1. Add `cookieConfig` to session configuration
2. Set `secure: true`, `sameSite: 'strict'`, `httpOnly: true`, `path: '/'`

**Test Plan**:
- **File**: `src/lib/auth.test.ts` (create or extend)
- **Tests**:
  - **TC-001**: Session config includes secure flag
    - Given `createAuthInstance(env)`
    - When auth config is inspected
    - Then session.cookieConfig.secure === true
  - **TC-002**: Session config includes strict sameSite
    - Given `createAuthInstance(env)`
    - When auth config is inspected
    - Then session.cookieConfig.sameSite === 'strict'

**Dependencies**: None (standalone)

### T-006: Update signOut cookie flags
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04 | **Status**: [x] completed

**Files**: `src/actions/auth/signOut.ts`

**Implementation**:
1. Add `secure: true` to cookies.set() call
2. Change `sameSite: 'lax'` to `sameSite: 'strict'`

**Test Plan**:
- **File**: `src/actions/auth/signOut.test.ts` (create)
- **Tests**:
  - **TC-001**: Sign out clears cookie with secure flags
    - Given authenticated user
    - When `signOut()` is called
    - Then cookie is set with `secure: true, sameSite: 'strict', httpOnly: true`

**Dependencies**: None

---

## Verification Tasks

### T-007: Run all tests
**Status**: [ ] pending

**Implementation**: Run `pnpm test` and verify all tests pass

**Test Plan**:
- **File**: (none - integration test)
- **Tests**:
  - **TC-001**: All unit tests pass
    - Given `pnpm test`
    - When executed
    - Then exit code 0 with all tests passing

### T-008: Manual verification
**Status**: [ ] pending

**Verification Steps**:
1. Sign in 5 times rapidly → verify rate limit error appears
2. Sign up with "password123" → verify complexity error shows
3. Check browser devtools → verify cookie has Secure, HttpOnly, SameSite=Strict

---

## Summary

| Task | Status | Dependencies |
|------|--------|--------------|
| T-001: Add error codes | pending | - |
| T-002: Password schema | pending | T-001 |
| T-003: Rate limit signIn | pending | T-001 |
| T-004: Rate limit signUp | pending | T-001, T-002 |
| T-005: Session cookie config | pending | - |
| T-006: signOut cookie flags | pending | - |
| T-007: Run tests | pending | T-001, T-002, T-003, T-004, T-005, T-006 |
| T-008: Manual verification | pending | T-007 |