import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Core Pages', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/TimorUp/);
  });

  test('Login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('Register page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('form')).toBeVisible();
  });

  test('Admin login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.locator('form')).toBeVisible();
  });

  test('Businesses page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Pricing page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('API Endpoints', () => {
  test('Homepage API returns HTML', async ({ page }) => {
    const response = await page.request.get(BASE_URL);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    const content = await response.text();
    expect(content).toContain('TimorUp');
  });
});
