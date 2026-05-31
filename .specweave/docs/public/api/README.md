# API Documentation

## Base URL

```
Production: https://timorup.jasonwill.workers.dev
Local:      http://localhost:8787
```

## Authentication

Most endpoints use Server Actions. Auth is via session cookie.

### Server Actions (Primary)

```typescript
import { actions } from 'astro:actions';

// Sign in
const result = await actions.auth.lightSignIn({ email, password });

// Create business
const result = await actions.business.create(formData);

// Admin operations
const result = await actions.admin.listings.getAll();
```

### REST APIs (Limited)

REST APIs are used for public data caching only.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/session` | GET | Session check |
| `/api/categories` | GET | Category data |
| `/api/businesses` | GET | Business data (cached) |
| `/api/health` | GET | Health check |

## Server Actions

### Auth Actions

| Action | Purpose |
|--------|---------|
| `actions.auth.lightSignIn` | User sign-in (Free Plan) |
| `actions.auth.lightSignUp` | User sign-up |
| `actions.auth.signOut` | User sign-out |
| `actions.admin.auth.login` | Admin login |

### Admin Actions

| Action | Purpose |
|--------|---------|
| `actions.admin.listings.getAll` | List all listings |
| `actions.admin.listings.create` | Create listing |
| `actions.admin.listings.update` | Update listing |
| `actions.admin.categories.*` | Category management |
| `actions.admin.businesses.*` | Business management |

### Business Actions

| Action | Purpose |
|--------|---------|
| `actions.business.create` | Create business |
| `actions.business.update` | Update business |
| `actions.business.like` | Like business |

## REST API Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": { "code": "ERROR_CODE", "message": "..." }
}
```

## Health Check

```bash
curl https://timorup.jasonwill.workers.dev/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-30T...",
  "environment": "production"
}
```

---
*Updated 2026-05-30*
