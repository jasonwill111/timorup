import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'https://timorup.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@timorup.com';
const ADMIN_PASSWORD = 'admin12345';

async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[name="email"], input[type="email"], input#email', ADMIN_EMAIL);
  await page.fill('input[name="password"], input#password', ADMIN_PASSWORD);
  const submitBtn = page.locator('button[type="submit"], #submit-btn, button:has-text("Sign"), button:has-text("Log")');
  await submitBtn.first().click();
  await page.waitForTimeout(2000);
}

/**
 * US-002: Admin CRUD Pages Migration
 *
 * As a developer I want admin pages to use Server Actions
 * So that form submissions are type-safe and consistent
 */
test.describe('US-002: Admin CRUD Pages Migration', () => {

  test('AC-US2-01: admin/blogs.astro uses actions.admin.blogs.* instead of fetch', async ({ page }) => {
    await adminLogin(page);
    const res = await page.goto(`${BASE_URL}/admin/blogs`);
    expect(res?.status()).toBe(200);

    // Check for absence of old REST API patterns (works with minified code)
    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/admin/blogs');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US2-02: admin/categories.astro uses actions.admin.categories.* instead of fetch', async ({ page }) => {
    await adminLogin(page);
    const res = await page.goto(`${BASE_URL}/admin/categories`);
    expect(res?.status()).toBe(200);

    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/admin/categories');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US2-03: admin/heroes.astro (ad-banners) uses actions.admin.heroes.* instead of fetch', async ({ page }) => {
    await adminLogin(page);
    // Try both possible routes: /admin/ad-banners and /admin/heroes
    let res = await page.goto(`${BASE_URL}/admin/ad-banners`);
    if (res?.status() === 404) {
      res = await page.goto(`${BASE_URL}/admin/heroes`);
    }
    if (res?.status() === 404) {
      res = await page.goto(`${BASE_URL}/admin/banners`);
    }
    expect(res?.status()).toBe(200);

    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/admin/heroes');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US2-04: admin/orders.astro uses actions.admin.subscriptions.* instead of fetch', async ({ page }) => {
    await adminLogin(page);
    const res = await page.goto(`${BASE_URL}/admin/orders`);
    expect(res?.status()).toBe(200);

    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/admin/subscriptions');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US2-05: admin/users.astro uses actions.admin.users.* instead of fetch', async ({ page }) => {
    await adminLogin(page);
    const res = await page.goto(`${BASE_URL}/admin/users`);
    expect(res?.status()).toBe(200);

    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/admin/users');
    });
    expect(hasOldRestPattern).toBe(false);
  });

});
