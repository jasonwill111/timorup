# API Documentation

## Base URL

```
Production: https://TimorUp.jasonwill.workers.dev
Local:      http://localhost:8787
```

## Authentication

Most endpoints require authentication via better-auth session cookie.

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-in` | Credential login |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/session` | Get current session |

### Request Example

```bash
curl -X POST http://localhost:8787/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@TimorUp.test","password":"TestPassword123!"}'
```

### Response

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

### Error Response

```json
{
  "error": { "code": "SIGN_IN_ERROR", "message": "Invalid email or password" }
}
```

## Key Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products?businessPageId=xxx` | List products |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products?id=xxx` | Update product |

### Businesses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/businesses` | List all businesses |
| POST | `/api/businesses` | Create business |
| PUT | `/api/businesses?id=xxx` | Update business |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media` | Upload to R2 |

## Response Format

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
  "error": { "message": "..." }
}
```

---
*Updated 2026-04-30*
