# server

**Path**: `src/actions`

## Purpose

Astro Server Actions for type-safe mutations and data fetching. Replaces traditional REST APIs for most operations.

## Directory Structure

```
src/actions/
├── auth/                     # Authentication actions
│   ├── light-auth.ts        # Lightweight auth (Free Plan, 3-4ms CPU)
│   ├── signIn.ts            # User sign-in (better-auth)
│   ├── signUp.ts            # User sign-up
│   ├── signOut.ts           # User sign-out
│   ├── forgotPassword.ts    # Password reset request
│   ├── resetPassword.ts    # Password reset
│   ├── verifyEmail.ts      # Email verification
│   └── session.ts          # Session management
├── admin/                    # Admin operations
│   ├── auth/login.ts        # Admin login
│   ├── users/              # User management
│   ├── listings.ts          # Listing management
│   ├── categories.ts        # Category management
│   ├── businesses.ts        # Business management
│   ├── subscriptions.ts     # Subscription management
│   ├── blogs.ts            # Blog posts
│   ├── heroes.ts           # Hero banners
│   ├── aiTools.ts          # AI content generation
│   └── aiGenerate.ts       # AI generation action
├── business/                # Business operations
│   ├── create.ts           # Create business
│   ├── update.ts           # Update business
│   └── like.ts             # Like business
├── products/                # Product/SKU operations
│   ├── create.ts           # Create product
│   ├── update.ts           # Update product
│   └── delete.ts           # Delete product
├── media/                   # Media uploads
│   ├── upload.ts           # Upload to R2
│   ├── update.ts           # Update media
│   └── delete.ts           # Delete media
├── reviews/                  # Review operations
│   ├── create.ts           # Create review
│   └── reply.ts            # Reply to review
└── banners/                 # Banner management
    ├── create.ts           # Create banner
    └── update.ts           # Update banner
```

## Usage

```typescript
import { actions } from 'astro:actions';

// Call action
const result = await actions.auth.lightSignIn({ email, password });
if (result.success) {
  console.log(result.user);
}
```

## Auth Architecture

### Light Auth (Primary - Free Plan)

```typescript
// src/actions/auth/light-auth.ts
import { bcryptCompare } from 'bcryptjs';
import { env } from 'cloudflare:workers';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export const lightSignIn = defineAction({
  accept: 'json',
  input: z.object({ email, password }),
  handler: async (input) => {
    // Direct D1 query (3-4ms CPU)
    const user = await db.prepare('SELECT ... FROM user WHERE email = ?').first();
    const valid = await bcryptCompare(input.password, user.password);
    // Store session in KV + DB
  }
});
```

### Better Auth (Secondary - Full Features)

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';

export const auth = withCloudflare({
  d1Native: env.DB,
  kv: env.SESSION,
}, {
  emailAndPassword: { enabled: true },
});
```

## Pattern Summary

| Use Case | Pattern | CPU |
|---------|---------|-----|
| User Auth (Free) | light-auth | 3-4ms |
| User Auth (Paid) | better-auth | 10-15ms |
| Admin Auth | requireAdmin(cookies) | 3-4ms |
| Mutations | Server Actions | Varies |

## Analysis Summary

- **Source Files**: 45+
- **Test Files**: 1
- **Type Safety**: Full (Zod validation)

---
*Updated 2026-05-30*