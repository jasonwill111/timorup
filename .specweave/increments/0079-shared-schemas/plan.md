# Plan: 0079-shared-schemas

## Context

Zod schemas 在多个 actions 中重复定义（如 `z.email({ error: '...' })`），修改时需更新多处。创建共享 schema 模块统一管理。

## Implementation

### Step 1: Create schemas/common.ts

```typescript
// src/lib/schemas/common.ts
import * as z from 'zod';

// Email schema with consistent error message
export const emailSchema = z.email({ error: 'Valid email required' });

// Required string with custom message
export const requiredString = (message = 'Required') => z.string().min(1, message);

// Optional string
export const optionalString = () => z.string().optional();

// Phone number (international format)
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
);

// Country code (default Timor-Leste)
export const countryCodeSchema = z.string().default('+670');
```

### Step 2: Create tests

```typescript
// src/lib/schemas/common.test.ts
import { describe, it, expect } from 'vitest';
import { emailSchema, phoneSchema, requiredString } from './common';

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true);
  });
  // ... more tests
});

describe('phoneSchema', () => {
  it('accepts Timor numbers', () => {
    expect(phoneSchema.safeParse('+6701234567').success).toBe(true);
  });
});
```

### Step 3: Update actions

Update 2-3 actions to use shared schemas:
- `src/actions/auth/signIn.ts` → `emailSchema`
- `src/actions/auth/signUp.ts` → `emailSchema`
- `src/actions/business/create.ts` → `phoneSchema`

### Step 4: Verify

- Run `pnpm test` — ensure 399+ tests pass
- Run `pnpm build` — ensure build succeeds

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/schemas/common.ts` | Common Zod schemas |
| `src/lib/schemas/common.test.ts` | Tests |

## Files to Modify

| File | Change |
|------|--------|
| `src/actions/auth/signIn.ts` | Use `emailSchema` |
| `src/actions/auth/signUp.ts` | Use `emailSchema` |
| `src/actions/business/create.ts` | Use `phoneSchema` |

## Verification

1. `pnpm test` → 399+ tests pass
2. `pnpm build` → Build succeeds
3. Manual: Check imports work correctly