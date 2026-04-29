import { test, expect } from '@playwright/test';

/**
 * Homepage Page Rendering Tests
 *
 * Tests for: / page
 * - Homepage loads (HTTP 200)
 * - Key sections render
 * - No console errors
 * - SEO meta tags present
 */

test.describe('Homepage', () => {
  test.describe.configure({ mode: 'serial' });

  // Track console errors across all tests
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Capture console errors
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
  });

  test('should load homepage with HTTP 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should render key sections', async ({ page }) => {
    await page.goto('/');

    // Hero section
    await expect(page.getByRole('heading', { name: /TIMORLIST/i })).toBeVisible();

    // Navigation
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();

    // Main content
    await expect(page.locator('main')).toBeVisible();

    // Footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toContain('timorlist');

    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(0);
    expect(description?.length).toBeLessThanOrEqual(160);

    // Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('should have no console errors', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Filter out known non-critical warnings
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('Failed to load resource') && !err.includes('net::')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should render Featured Businesses section', async ({ page }) => {
    await page.goto('/');

    // Check for Featured Businesses section heading
    const featuredHeading = page.getByRole('heading', { name: /Featured Businesses/i });
    await expect(featuredHeading).toBeVisible();

    // Check for "View All" link
    await expect(page.getByRole('link', { name: /View All/i }).first()).toBeVisible();
  });

  test('should render Categories section', async ({ page }) => {
    await page.goto('/');

    // Check for Categories section heading
    const categoriesHeading = page.getByRole('heading', { name: /Browse by Category/i });
    await expect(categoriesHeading).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for Browse Directory button in hero
    const browseButton = page.getByRole('link', { name: /Browse Directory/i });
    await expect(browseButton).toBeVisible();
  });

  test('should render CTA section', async ({ page }) => {
    await page.goto('/');

    // Check for CTA section
    await expect(page.getByRole('heading', { name: /Ready to Grow Your Business/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Create Your Business Page/i })).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');

    // Check semantic elements
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
    await expect(page.locator('section').first()).toBeVisible();
  });
});
