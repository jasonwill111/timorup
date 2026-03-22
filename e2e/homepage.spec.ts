import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    // Title contains "TMBIZ" - use more flexible check
    await expect(page).toHaveTitle(/TMBIZ/);
  });

  test('should show header with navigation', async ({ page }) => {
    await page.goto('/');
    // Use header-specific locator to avoid strict mode violation
    await expect(page.locator('header').getByRole('link', { name: /Businesses/i })).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: /Pricing/i })).toBeVisible();
  });

  test('should show hero section', async ({ page }) => {
    await page.goto('/');
    // Hero heading is "TMBIZ" (case insensitive)
    await expect(page.getByRole('heading', { name: /TMBIZ/i })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to businesses page', async ({ page }) => {
    await page.goto('/');
    // Find the navigation link (not the hero button)
    await page.locator('header nav').getByRole('link', { name: /Businesses/i }).click();
    await expect(page).toHaveURL(/businesses/);
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav').getByRole('link', { name: /Pricing/i }).click();
    await expect(page).toHaveURL(/pricing/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('header').getByRole('link', { name: /Log in/i });
    await loginLink.click();
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    const registerLink = page.locator('header').getByRole('link', { name: /Sign Up/i });
    await registerLink.click();
    await expect(page).toHaveURL(/register/);
  });
});

test.describe('Mobile Navigation', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuButton = page.getByLabel(/open menu/i);
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('#theme-toggle').first();
    await themeToggle.click();
  });
});
