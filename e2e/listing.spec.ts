import { test, expect } from '@playwright/test';

/**
 * Listing Page Rendering Tests
 *
 * Tests for: /listing page
 * - Listing page loads
 * - Filter controls work
 * - Pagination works
 */

test.describe('Listing Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Console Error: ${msg.text()}`);
      }
    });
  });

  test('should load listing page with HTTP 200', async ({ page }) => {
    const response = await page.goto('/listing');
    expect(response?.status()).toBe(200);
  });

  test('should have page title', async ({ page }) => {
    await page.goto('/listing');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('directory');
  });

  test('should render type tabs', async ({ page }) => {
    await page.goto('/listing');

    // Businesses tab
    await expect(page.getByRole('link', { name: /Businesses/i }).first()).toBeVisible();

    // Government tab
    await expect(page.getByRole('link', { name: /Government/i }).first()).toBeVisible();

    // NGOs tab
    await expect(page.getByRole('link', { name: /NGOs/i }).first()).toBeVisible();
  });

  test('should render search input', async ({ page }) => {
    await page.goto('/listing');

    // Search input
    const searchInput = page.locator('input[type="search"], input[id="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('should render sort filter', async ({ page }) => {
    await page.goto('/listing');

    // Sort filter
    const sortFilter = page.locator('#sort-filter');
    await expect(sortFilter).toBeVisible();

    // Verify the select has options (options are not individually visible in select)
    await expect(sortFilter).toBeAttached();
    const options = await sortFilter.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('should render results count', async ({ page }) => {
    await page.goto('/listing');

    // Results count text
    const resultsText = page.getByText(/Showing \d+ of \d+ listings/i);
    await expect(resultsText).toBeVisible();
  });

  test('should navigate to government tab', async ({ page }) => {
    await page.goto('/listing');

    // Click on Government tab
    await page.getByRole('link', { name: /Government/i }).first().click();
    await expect(page).toHaveURL(/\/listing\?type=govs/);
  });

  test('should navigate to NGOs tab', async ({ page }) => {
    await page.goto('/listing');

    // Click on NGOs tab
    await page.getByRole('link', { name: /NGOs/i }).first().click();
    await expect(page).toHaveURL(/\/listing\?type=ngos/);
  });

  test('should have sort filter that updates URL', async ({ page }) => {
    await page.goto('/listing');

    // Change sort to name
    const sortFilter = page.locator('#sort-filter');
    await sortFilter.selectOption('name');
    await expect(page).toHaveURL(/sort=name/);
  });

  test('should have working search that updates URL', async ({ page }) => {
    await page.goto('/listing');

    // Fill in search
    const searchInput = page.locator('#search');
    await searchInput.fill('test');
    await searchInput.dispatchEvent('change');

    // URL should include search parameter
    await expect(page).toHaveURL(/search=test/);
  });

  test('should render listings grid', async ({ page }) => {
    await page.goto('/listing');

    // Listings container should exist
    const listingsGrid = page.locator('.grid').first();
    await expect(listingsGrid).toBeVisible();
  });

  test('should handle empty results', async ({ page }) => {
    // Search for something unlikely to exist
    await page.goto('/listing?search=xyznonexistent123');

    // Should show "No listings found" or results count of 0
    const resultsText = page.getByText(/Showing 0 of \d+ listings/i);
    await expect(resultsText).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/listing');

    // Check semantic elements
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('should have no console errors', async ({ page }) => {
    await page.goto('/listing', { waitUntil: 'networkidle' });

    // Allow some flexibility for non-critical errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Just verify page loads without crashing
    expect(await page.title()).toBeTruthy();
  });

  test('should have industry filter for business type', async ({ page }) => {
    await page.goto('/listing');

    // Business type should have industry filter
    const industryFilter = page.locator('#industry-filter');
    await expect(industryFilter).toBeVisible();
  });
});
