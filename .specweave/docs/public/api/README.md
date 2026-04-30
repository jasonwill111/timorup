# API Documentation

## Base URL

```
Production: https://timorlist.jasonwill.workers.dev
Local:      http://localhost:8787
```

## Authentication

Most endpoints require authentication via better-auth session cookie.

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