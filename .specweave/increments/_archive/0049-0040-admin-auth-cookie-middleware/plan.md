---
increment: 0049-0040-admin-auth-cookie-middleware
---

# Architecture Plan: Admin Auth Cookie + Middleware

## Design

### Current State (Problem)
1. Admin auth stored in `localStorage` — vulnerable to XSS
2. 52 admin pages each check `localStorage.getItem('adminUser')` client-side
3. No server-side validation of admin identity
4. Session stored in localStorage, not httpOnly cookie

### Target State (Solution)
1. Session stored in httpOnly cookie (`admin_session`)
2. Server-side middleware validates session on every `/admin/*` request
3. User injected into `Astro.locals` — available in all pages
4. Client-side code reads from `Astro.locals`, not localStorage

### Security Model
```
Browser                    Server                      D1
  │                          │                          │
  ├─ POST /actions/admin/login ──────────────────────▶  │
  │                          ├─ Validate credentials     │
  │                          ├─ Create session record ──▶ │
  │                          │◀─ Session ID              │
  │◀─ Set-Cookie: admin_session=xxx; HttpOnly; Secure   │
  │                          │                          │
  ├─ GET /admin/dashboard     │                          │
  │   Cookie: admin_session  │                          │
  │                          ├─ Middleware validates     │
  │                          │   (reads from D1)          │
  │                          ├─ Sets Astro.locals.user    │
  │◀─ Page renders with user │                          │
```

## Components

### 1. Middleware (`src/middleware/index.ts`)
- Intercept all requests to `/admin/*`
- Skip `/admin/login` and static assets
- Read `admin_session` cookie
- Query sessions table in D1
- If valid: set `Astro.locals.user` + `Astro.locals.isAdmin = true`
- If invalid/missing: redirect to `/admin/login`

### 2. Login Action (`src/actions/admin/login.ts`)
- Accept `{ email, password }`
- Validate credentials against users table
- Check `role = 'admin'`
- Create session record in D1
- Set httpOnly cookie on response
- Return `{ user: { id, email, name, role } }`

### 3. Logout Action (`src/actions/admin/logout.ts`)
- Delete session from D1
- Clear `admin_session` cookie
- Redirect to `/admin/login`

### 4. AdminLayout Update
- Replace `JSON.parse(localStorage.getItem('adminUser'))` with `Astro.locals.user`
- Remove all localStorage admin session code
- Keep theme localStorage (not sensitive)

### 5. Admin Pages Cleanup
- Remove client-side `localStorage.getItem('adminUser')` checks
- Keep theme localStorage
- Admin pages rely on middleware redirect, not JS checks

## Cookie Configuration

```typescript
Set-Cookie: admin_session={token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/
```

## Session Storage (D1)

```sql
-- Use existing sessions table
INSERT INTO sessions (id, token, userId, expiresAt, createdAt, updatedAt)
VALUES (?, ?, ?, ?, ?, ?);
```

## Rationale

### Why httpOnly cookie over localStorage?
- localStorage accessible via `document.cookie` only if no HttpOnly
- BUT: Any XSS payload can do `localStorage.getItem('adminUser')`
- httpOnly cookie: JavaScript cannot read — XSS cannot steal session token
- Even if XSS executes, cookie is invisible to scripts

### Why middleware over per-page checks?
- Single source of truth
- Consistent behavior across all admin pages
- Easier to audit/update security policy
- Reduces code duplication

### Why redirect vs 401 JSON?
- Admin pages are SSR, return HTML
- Redirect maintains SPA-like flow
- 401 JSON would cause flash of login page

## Files to Modify

| File | Change |
|------|--------|
| `src/middleware/index.ts` | CREATE — auth middleware |
| `src/actions/admin/login.ts` | MODIFY — set cookie |
| `src/actions/admin/logout.ts` | MODIFY — clear cookie |
| `src/layouts/AdminLayout.astro` | MODIFY — use Astro.locals |
| `src/pages/admin/login.astro` | MODIFY — remove localStorage |
| `src/pages/admin/*.astro` (~52 files) | MODIFY — remove localStorage |

## Testing Strategy

1. Unit tests for middleware logic (mock session validation)
2. Integration tests for login/logout actions
3. E2E test: login flow with cookie inspection
4. Security test: verify cookie is HttpOnly

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking existing admin sessions | Migration path: check both localStorage and cookie during transition |
| Cookie not set on subdomain | Use `Path=/` and explicit domain if needed |
| Middleware runs on non-admin routes | Explicit path check: `url.pathname.startsWith('/admin')`