# Testing

**Path**: `e2e/`

## Overview

Playwright E2E tests for the application.

## Test Configuration

**Config File**: `playwright.config.ts`

| Setting | Value | Notes |
|---------|-------|-------|
| Test Dir | `./e2e` | All E2E tests |
| Browser | Chromium | Desktop Chrome |
| Base URL | `localhost:4321` | Configurable via `BASE_URL` env |
| Workers | 1 | Serial to avoid rate limiting |
| Parallel Tests | `false` | Required for rate limiter |

**Environment Variables**:
```bash
NODE_ENV=test        # Disables rate limiters
USE_CLOUDFLARE=0    # Local dev mode
BASE_URL=http://localhost:4321
```

## Key Test Files

| File | Coverage |
|------|----------|
| `auth.spec.ts` | Registration, login, logout |
| `admin.spec.ts` | Admin dashboard operations |
| `business.spec.ts` | Business CRUD operations |

## Test Patterns

### Auth via Server Action

```typescript
import { actions } from 'astro:actions';

test('login flow', async ({ page }) => {
  // Use light-signIn action via form submission
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
});
```

### Admin Login

```typescript
test('admin login', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('[name="email"]', 'admin@timorup.com');
  await page.fill('[name="password"]', 'admin12345');
  await page.click('button[type="submit"]');

  // Wait for redirect to admin dashboard
  await expect(page).toHaveURL('/admin');
});
```

## Running Tests

```bash
# All E2E tests
pnpm test:e2e

# With UI
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug

# Specific test
pnpm exec playwright test e2e/auth.spec.ts
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Form not submitting | Use `dispatchEvent('click')` on button |
| Rate limit errors | Run tests serially (`workers: 1`) |
| Cookie not set | Use `httpOnly: false` when adding cookie |
| Page redirect | Check auth state before navigation |

---
*Updated 2026-05-30*
