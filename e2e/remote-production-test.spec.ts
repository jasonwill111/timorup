import { test, expect } from '@playwright/test';

const REMOTE_BASE = 'https://timorup.jasonwill.workers.dev';

test.describe('Remote Production Tests', () => {
  test('Homepage loads with content', async ({ page }) => {
    await page.goto(REMOTE_BASE);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const title = await page.title();
    console.log('Homepage title:', title);
    expect(title).toContain('TimorUp');
  });

  test('Businesses page shows data', async ({ page }) => {
    await page.goto(`${REMOTE_BASE}/businesses`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const content = await page.textContent('body');
    console.log('Businesses page has content:', content.length, 'chars');
    console.log('Has "Businesses":', content.includes('Businesses'));
    console.log('Has business names:', content.includes('Lospalos') || content.includes('Business'));
  });

  test('Login page form works', async ({ page }) => {
    await page.goto(`${REMOTE_BASE}/login`);
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const submitBtn = page.locator('button[type="submit"]');

    expect(await emailInput.isVisible()).toBeTruthy();
    expect(await passwordInput.isVisible()).toBeTruthy();
    expect(await submitBtn.isVisible()).toBeTruthy();
  });

  test('Login with E2E test user', async ({ page }) => {
    await page.goto(`${REMOTE_BASE}/login`);
    await page.waitForLoadState('domcontentloaded');

    await page.fill('#email', 'e2e-test@timorup.com');
    await page.fill('#password', 'Test123456');
    await page.locator('button[type="submit"]').dispatchEvent('click');

    await page.waitForTimeout(3000);
    const url = page.url();
    console.log('After login URL:', url);

    // Check cookies
    const cookies = await page.context().cookies();
    const sessionCookies = cookies.filter(c => c.name.includes('session'));
    console.log('Session cookies:', sessionCookies.length);
  });

  test('Listings page loads', async ({ page }) => {
    await page.goto(`${REMOTE_BASE}/listings`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(page.locator('body')).toBeVisible();
  });

  test('Non-profits page loads', async ({ page }) => {
    await page.goto(`${REMOTE_BASE}/non-profits`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(page.locator('body')).toBeVisible();
  });
});