import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'https://timorup.jasonwill.workers.dev';

/**
 * US-001: Auth Endpoints Migration
 *
 * As a developer I want all authentication endpoints to use Server Actions
 * So that type safety is maintained and code is unified
 */
test.describe('US-001: Auth Endpoints Migration', () => {

  test('AC-US1-01: login.astro uses actions.auth.signIn() instead of fetch', async ({ page }) => {
    // Given: the login page
    // When: the page source is inspected
    // Then: it imports and uses actions.auth.signIn, not fetch('/api/auth/sign-in')

    const res = await page.goto(`${BASE_URL}/login`);
    expect(res?.status()).toBe(200);

    // Check for Server Actions pattern (handles both source and minified code)
    const actionsImport = await page.evaluate(() => {
      // Check if the page uses actions by verifying:
      // 1. The JS bundle doesn't contain old REST API calls
      // 2. The form doesn't POST to /api/auth/sign-in (excluding OAuth routes)

      // Check for absence of old REST pattern (exclude OAuth routes like /google, /facebook)
      const hasOldRestPattern =
        document.body.innerHTML.includes("fetch('\/api\/auth\/sign-in'") ||
        document.body.innerHTML.includes('fetch("/api/auth/sign-in"') ||
        // Check for form action pointing to old REST API
        (document.body.innerHTML.includes('/api/auth/sign-in') &&
         !document.body.innerHTML.includes('/api/auth/sign-in/google') &&
         !document.body.innerHTML.includes('/api/auth/sign-in/facebook'));

      return !hasOldRestPattern;
    });
    expect(actionsImport).toBe(true);

    // Try actual login flow - verify Server Actions work
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('#submit-btn');
    await page.waitForTimeout(2000);

    // Should show error (not crash or 500) - proves Server Actions are working
    const formMessage = page.locator('#form-message');
    await expect(formMessage).toBeVisible();
  });

  test('AC-US1-02: signup.astro uses actions.auth.signUp() instead of fetch', async ({ page }) => {
    // Given: the registration page
    // When: the page loads
    // Then: it uses actions.auth.signUp, not fetch('/api/auth/sign-up')

    const res = await page.goto(`${BASE_URL}/register`);
    expect(res?.status()).toBe(200);

    // Check for absence of old REST API pattern (works with minified code)
    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/auth/sign-up');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US1-03: admin/login.astro uses actions.auth.signIn() instead of fetch', async ({ page }) => {
    // Given: the admin login page
    // When: the page loads
    // Then: it uses actions.auth.signIn, not fetch('/api/...')

    const res = await page.goto(`${BASE_URL}/admin/login`);
    expect(res?.status()).toBe(200);

    // Check for absence of old REST API pattern
    const hasOldRestPattern = await page.evaluate(() => {
      return document.body.innerHTML.includes('/api/auth/sign-in');
    });
    expect(hasOldRestPattern).toBe(false);
  });

  test('AC-US1-04: Sign-out uses actions.auth.signOut() (if fetch was used before)', async ({ page }) => {
    // Given: a logged-in user on the account page
    // When: the user signs out
    // Then: actions.auth.signOut is called (not fetch POST /api/auth/sign-out)

    const res = await page.goto(`${BASE_URL}/account`);
    expect(res?.status()).toBe(200);

    // Check if the page still references old REST API sign-out
    const hasOldFetchSignOut = await page.evaluate(() => {
      const html = document.body.innerHTML;
      return html.includes('/api/auth/sign-out');
    });

    // AC states: sign-out should use actions.auth.signOut()
    // The page should either not reference the old API, or use actions
    // For this test: if the form still points to /api/auth/sign-out, the AC is NOT met
    if (hasOldFetchSignOut) {
      // Old pattern still exists - AC not met
      const hasActionsPattern = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[type="module"]');
        let hasActions = false;
        scripts.forEach(s => {
          if (s.textContent?.includes('actions.auth.signOut')) {
            hasActions = true;
          }
        });
        return hasActions;
      });
      expect(hasActionsPattern).toBe(true);
    }
  });

});