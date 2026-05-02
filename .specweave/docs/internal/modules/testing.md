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
| Base URL | `localhost:4323` | Configurable via `BASE_URL` env |
| Workers | 1 | Serial to avoid rate limiting |
| Parallel Tests | `false` | Required for rate limiter |

**Environment Variables**:
```bash
NODE_ENV=test        # Disables rate limiters
USE_CLOUDFLARE=0     # Local dev mode
BASE_URL=http://localhost:4323
```

## Key Test Files

| File | Coverage |
|------|----------|
| `gov-ngo-subscription-flow.spec.ts` | Gov/NGO free listing, subscription, SKU flow |
| `auth-complete.spec.ts` | Registration, login, logout |
| `business-complete.spec.ts` | Business CRUD operations |
| `full-subscription-lifecycle.spec.ts` | Complete subscription lifecycle |
| `error-pages.spec.ts` | 404, error handling |

## Gov/NGO Subscription Flow Tests

**File**: `e2e/gov-ngo-subscription-flow.spec.ts`

| Test ID | Description | Status |
|---------|-------------|--------|
| GOV-001 | Government type shows free listing option | ✅ |
| GOV-002 | Nonprofit type shows free listing option | ✅ |
| GOV-003 | Create government listing for free | ✅ |
| GOV-004 | Create nonprofit listing for free | ✅ |
| GOV-005 | Government shows Publish (Free) button | ✅ |
| PLAN-001 | Show subscription page | ✅ |
| PLAN-002 | Load subscribe page with plan param | ✅ |
| ADMIN-001 | Admin sees pending subscriptions | ✅ |
| ADMIN-002 | Admin confirms subscription | ✅ |
| SKU-001 | Show SKU section in account | ✅ |
| SKU-002 | Create SKU via admin panel | ✅ |
| SKU-003 | Display created SKUs in account | ✅ |
| FLOW-001 | Complete gov page → plan → admin → SKU | ✅ |

**Total**: 14 tests, all passing

## Running Tests

```bash
# All E2E tests
pnpm test:e2e

# Specific test file
pnpm exec playwright test e2e/gov-ngo-subscription-flow.spec.ts

# With custom base URL
BASE_URL=http://localhost:4325 pnpm exec playwright test e2e/auth.spec.ts

# View report
pnpm exec playwright show-report
```

## Test Helpers

**Factories** (`e2e/factories.ts`):
- `UserFactory.build()` - Generate test user data
- `loginAsUser()` - Login via cookie
- `loginAsAdmin()` - Login as admin

**Auth via API**:
```typescript
const response = await page.request.post('/api/auth/sign-up', {
  data: { email, password, name }
});
const token = response.session.token;
await page.context().addCookies([{
  name: 'better-auth.session_token',
  value: token,
  domain: 'localhost'
}]);
```

## Troubleshooting

| Issue | Solution |
|-------|-----------|
| Rate limit errors | Run tests serially (`workers: 1`) |
| Cookie not set | Use `httpOnly: false` when adding cookie |
| Form fields not found | Check page requires auth (may redirect to login) |
| Vite error overlay | Remove with `page.evaluate(() => document.querySelector('vite-error-overlay')?.remove())` |

---
*Updated 2026-05-02*
