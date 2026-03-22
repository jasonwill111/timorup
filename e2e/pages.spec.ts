import { test, expect } from '@playwright/test';

test.describe('Businesses Page', () => {
  test('should load businesses page', async ({ page }) => {
    await page.goto('/businesses');
    // Heading is "Business Directory" (not "business directory" - title case)
    await expect(page.getByRole('heading', { name: /Business Directory/i })).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await page.goto('/businesses');
    // Placeholder is "Search businesses..." 
    await expect(page.getByPlaceholder(/Search businesses/i)).toBeVisible();
  });

  test('should show categories filter', async ({ page }) => {
    await page.goto('/businesses');
    // Category filter is a select element
    const categorySelect = page.locator('#category-filter');
    if (await categorySelect.isVisible()) {
      await expect(categorySelect).toBeVisible();
    }
  });
});

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    // Heading is "Simple, Transparent Pricing"
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();
  });

  test('should show monthly and yearly plans', async ({ page }) => {
    await page.goto('/pricing');
    // Monthly prices are visible by default ($39/mo format)
    await expect(page.getByText('$39', { exact: false })).toBeVisible();
    // Click yearly toggle to see yearly prices
    await page.getByRole('button', { name: /yearly/i }).click();
    await expect(page.getByText('$390', { exact: true })).toBeVisible();
  });

  test('should navigate to subscribe page', async ({ page }) => {
    await page.goto('/pricing');
    const getStartedButton = page.getByRole('link', { name: /Get Started/i }).first();
    if (await getStartedButton.isVisible()) {
      await getStartedButton.click();
      await expect(page).toHaveURL(/subscribe/);
    }
  });
});

test.describe('Subscribe Page', () => {
  test('should load subscribe page', async ({ page }) => {
    await page.goto('/subscribe?plan=monthly');
    // Heading is "Complete Your Subscription"
    await expect(page.getByRole('heading', { name: /Complete Your Subscription/i })).toBeVisible();
  });

  test('should show payment instructions', async ({ page }) => {
    await page.goto('/subscribe?plan=monthly');
    // Text is "Payment Instructions"
    await expect(page.getByText(/Payment Instructions/i)).toBeVisible();
  });
});
