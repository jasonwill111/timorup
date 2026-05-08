# Implementation Plan: Role-Based Auth System Fixes

## Overview

Implement role-based access control (RBAC) with 4-tier permission model. Lazy-load client-side session checks to avoid SSR complexity.

## Architecture

### Components
| Component | File | Purpose |
|-----------|------|---------|
| Permission constants | `src/lib/permissions.ts` | ROLES, PERMISSIONS, role hierarchy |
| Auth client helper | `src/lib/auth-client.ts` | Client-side `getCurrentUser()` |
| Role API | `src/pages/api/admin/users/[id]/role.ts` | PATCH role management |
| Sign-up page | `src/pages/auth/sign-up.astro` | Registration form |
| AdminLayout | `src/layouts/AdminLayout.astro` | Role-based sidebar |

### Data Model
Users table already has `role: text('role').default('user')`. No schema changes needed.

### API Contracts
```
GET  /api/auth/session     → { user: { id, email, name, role } | null }
POST /api/auth/sign-up      → { name, email, password } → { success, user }
PATCH /api/admin/users/:id/role → { role } → { success }
```

## Design

### Role Hierarchy
```
super_admin
    └── admin (all CRUD + own users)
        └── editor (own listings/products)
            └── user (read own, request edits)
```

### Permission Matrix
| Feature | user | editor | admin | super_admin |
|---------|------|--------|-------|-------------|
| View own listings | ✅ | ✅ | ✅ | ✅ |
| Edit own listings | ✅ | ✅ | ✅ | ✅ |
| Create listings | ❌ | ✅ | ✅ | ✅ |
| Edit others' listings | ❌ | ❌ | ✅ | ✅ |
| Manage categories | ❌ | ❌ | ✅ | ✅ |
| Manage banners | ❌ | ❌ | ✅ | ✅ |
| Manage reviews | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| AI Tools | ❌ | ❌ | ❌ | ✅ |

## Rationale

- **Client-side role check for sidebar**: Avoid SSR complexity. Session cookie available on client.
- **Centralized permissions.ts**: Single source of truth for role checks.
- **Admin override in canEditBusiness**: Bypasses ownerId check for admin+ roles.
- **Lazy getCurrentUser()**: Fetches on demand, caches in memory.
