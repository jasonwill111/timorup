import { test, expect } from '@playwright/test';

test.describe('Footer', () => {
  test('should show footer on homepage', async ({ page }) => {
    await page.goto('/');
    // Use more specific locator - footer brand link
    await expect(page.locator('footer a').filter({ hasText: 'TMBIZ' }).first()).toBeVisible();
  });

  test('should show quick links', async ({ page }) => {
    await page.goto('/');
    // Use footer-specific locator
    await expect(page.locator('footer').getByRole('link', { name: /Browse Businesses/i })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: /Pricing/i })).toBeVisible();
  });

  test('should show copyright', async ({ page }) => {
    await page.goto('/');
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(new RegExp(`${currentYear} TMBIZ`))).toBeVisible();
  });
});
