# Playwright (timorlist)

> v1.58.2 | E2E Testing | Cloudflare Workers

## Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  }],
  baseURL: 'http://localhost:8787',
});
```

## 启动 Server

```bash
# 1. Build
pnpm build

# 2. Start wrangler
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state &

# 3. Run tests
pnpm test:e2e
```

## 常用选择器

```typescript
// 表单
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
await page.getByRole('button', { name: 'Submit' }).click();

// 按文本
await page.getByText('Create Listing').click();

// 按标签
await page.locator('label:has-text("Email")').fill('test@example.com');
```

## 表单提交 (Astro)

```typescript
// ✅ 正确: 表单提交
await page.locator('form').evaluate(f => f.submit());

// ❌ 错误: 点击按钮 (有时不触发 form)
// await page.getByRole('button', { name: 'Submit' }).click();
```

## 等待重定向

```typescript
// ✅ 正确
await page.waitForFunction(
  () => window.location.href.includes('/account'),
  { timeout: 20000 }
);

// ❌ 错误
await page.waitForURL('/account');
```

## Auth 测试

```typescript
export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.locator('form').evaluate(f => f.submit());
  await page.waitForFunction(
    () => window.location.href.includes('/account'),
    { timeout: 20000 }
  );
  await page.waitForTimeout(500);
  const cookies = await page.context().cookies();
  return cookies.find(c => c.name === 'better-auth.session_token');
}
```

## 测试结构

```typescript
import { test, expect } from '@playwright/test';

test.describe('Business Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'admin@test.com', 'password123');
  });

  test('creates a new business listing', async ({ page }) => {
    await page.goto('/listing/create?type=business');
    // ...
  });
});
```
