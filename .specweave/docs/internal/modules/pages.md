# pages

**Path**: `src/pages`

## Purpose

Astro pages and API routes. Includes public pages, admin dashboard, and REST APIs.

## Directory Structure

```
src/pages/
├── index.astro           # Homepage
├── login.astro           # User login
├── register.astro        # User registration
├── account.astro         # User account
├── business/[slug].astro # Business detail page
├── listings/             # Business listings
├── products-services/     # Products/SKUs
├── admin/                # Admin dashboard
│   ├── index.astro       # Dashboard
│   ├── login.astro       # Admin login
│   ├── users.astro       # User management
│   ├── businesses.astro   # Business management
│   └── ...
└── api/                  # REST APIs
    ├── auth/             # Authentication
    │   ├── sign-in.ts    # better-auth sign-in
    │   ├── sign-up.ts    # better-auth sign-up
    │   ├── sign-out.ts   # better-auth sign-out
    │   └── session.ts    # Get current session (+ role)
    └── admin/            # Admin APIs
        ├── auth/login.ts # Admin login
        ├── users/        # User CRUD
        ├── businesses/    # Business CRUD
        └── stats.ts      # Dashboard stats
```

## Admin Authentication Flow

```
User → POST /api/auth/sign-in → better-auth (sets cookie)
     → GET /api/auth/session → returns user with role
     → /admin checks role → redirect if not admin
```

### Admin Login (login.astro)

```typescript
// 1. Sign in via better-auth
const signInRes = await fetch('/api/auth/sign-in', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// 2. Check admin role
const sessionRes = await fetch('/api/auth/session');
const sessionData = await sessionRes.json();

if (!['admin', 'super_admin', 'editor'].includes(sessionData.user.role)) {
  // Show "Access denied"
}
```

### Admin API Auth

```typescript
// admin-auth.ts - shared auth helper
export async function getAdminUser(request: Request) {
  // Direct DB query for session validation
  const session = await db.select().from(sessions).where(...).get();
  const user = await db.select().from(users).where(...).get();
  if (!['admin', 'super_admin', 'editor'].includes(user.role)) {
    return null;
  }
  return user;
}

// Usage in API
export async function GET({ request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  // ... handle request
}
```

## API Response Format

### Success
```json
{ "success": true, "data": {...} }
```

### Error
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

## Analysis Summary

- **Files Analyzed**: 56
- **Source Files**: 52
- **Test Files**: 4
- **Total Exports**: 127

---
*Analysis updated on 2026-05-06*