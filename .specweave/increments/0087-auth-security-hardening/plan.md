# Implementation Plan: Auth Security Hardening

## Overview

Add security hardening to auth flow: rate limiting, secure cookies, password complexity, and standardized errors.

## Design

### 1. Rate Limiting Integration

**Pattern** (already used in API routes):
```typescript
import { checkRateLimitKV } from '@/lib/rate-limit';

const rateLimit = await checkRateLimitKV(`auth-sign-in:${clientIP}`);
if (!rateLimit.allowed) {
  return { success: false, error: { code: 'AUTH_RATE_LIMITED', message: 'Too many attempts. Try again later.', resetIn: rateLimit.resetIn } };
}
```

**For Astro Server Actions**: No direct `request` object; use fixed identifiers based on action type:
- signIn: `auth-sign-in`
- signUp: `auth-sign-up`

Better-auth handles IP-based rate limiting internally, but we add app-level protection via KV.

### 2. Cookie Security Configuration

**In `src/lib/auth.ts`** - Add to session config:
```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,
  updateAge: 60 * 60 * 24,
  storeSessionInDatabase: true,
  cookieConfig: {
    name: 'better-auth.session_token',
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  },
},
```

**In `src/actions/auth/signOut.ts`** - Update cookies.set():
```typescript
cookies.set('better-auth.session_token', '', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 0,
  path: '/',
});
```

### 3. Password Complexity Schema

**New file `src/lib/schemas/auth.ts`**:
```typescript
import * as z from 'zod';

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

### 4. Error Code Additions

**In `src/lib/errors/errorCodes.ts`**:
```typescript
AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',  // 401
AUTH_RATE_LIMITED = 'AUTH_RATE_LIMITED',  // already exists (429)
VALIDATION_PASSWORD_TOO_WEAK = 'VALIDATION_PASSWORD_TOO_WEAK',  // 400
```

## Technology Stack

- **Framework**: Astro 6 with Cloudflare Workers
- **Auth**: better-auth with d1Native adapter
- **Validation**: Zod v4
- **Rate Limiting**: Cloudflare KV (existing)
- **Testing**: Vitest

## Implementation Phases

### Phase 1: Add Error Codes
1. Add `AUTH_INVALID_CREDENTIALS` to ErrorCode enum
2. Add `VALIDATION_PASSWORD_TOO_WEAK` to ErrorCode enum
3. Update ErrorCodeToStatus mapping

### Phase 2: Create Password Schema
1. Create `src/lib/schemas/auth.ts` with passwordSchema
2. Export from `src/lib/schemas/index.ts`
3. Write tests for passwordSchema

### Phase 3: Add Rate Limiting
1. Update `signIn.ts` - add rate limit check
2. Update `signUp.ts` - add rate limit check
3. Update error handling to use ErrorCode enum
4. Write tests for rate limiting

### Phase 4: Configure Secure Cookies
1. Update `src/lib/auth.ts` - add cookieConfig to session
2. Update `signOut.ts` - add secure and sameSite: 'strict'
3. Write tests for cookie configuration

## Testing Strategy

| Component | Test Type | Coverage |
|-----------|-----------|----------|
| passwordSchema | Unit | Each regex rule, edge cases |
| signIn rate limit | Integration | 100+ rapid calls |
| signUp rate limit | Integration | 100+ rapid calls |
| Cookie flags | Manual | Browser devtools inspection |
| Error codes | Unit | All auth action error paths |

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/errors/errorCodes.ts` | Add AUTH_INVALID_CREDENTIALS, VALIDATION_PASSWORD_TOO_WEAK |
| `src/lib/schemas/auth.ts` | Create with passwordSchema |
| `src/lib/schemas/index.ts` | Re-export passwordSchema |
| `src/actions/auth/signIn.ts` | Add rate limiting + ErrorCode |
| `src/actions/auth/signUp.ts` | Add rate limiting + passwordSchema |
| `src/actions/auth/signOut.ts` | Secure cookie flags |
| `src/lib/auth.ts` | Add cookieConfig to session |

## Verification

1. Run `pnpm test` - ensure all tests pass
2. Manual verification:
   - Sign in 5 times rapidly → should get rate limited
   - Sign up with "password123" → should show complexity error
   - Check browser cookies → should have Secure, HttpOnly, SameSite
3. Playwright E2E tests pass