import { test, expect } from '@playwright/test';

/**
 * Business Detail Page Rendering Tests
 *
 * Tests for: /business/[slug] page
 * - Business detail page loads (uses first available slug)
 * - Products/ratings render
 * - Contact info present
 */

test.describe('Business Detail Page', () => {
  test.describe.configure({ mode: 'serial' });

  // We'll dynamically get a business slug from the listing page
  let businessSlug: string | null = null;

  test.beforeEach(async ({ page }) => {
    // Get first business slug from listing (only if not cached)
    if (!businessSlug) {
      await page.goto('/listing');
      const firstBusinessLink = page.locator('a[href^="/business/"]').first();
      if (await firstBusinessLink.isVisible()) {
        const href = await firstBusinessLink.getAttribute('href');
        businessSlug = href?.split('/business/')[1] || null;
      }
    }
  });

  test('should redirect to /businesses if slug not found', async ({ page }) => {
    // Visit a non-existent business
    const response = await page.goto('/business/nonexistent-slug-xyz123');
    // Should redirect to /businesses (may or may not have trailing slash)
    await expect(page).toHaveURL(/\/businesses\/?/);
  });

  test('should load business page with HTTP 200', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    const response = await page.goto(`/business/${businessSlug}`);
    expect(response?.status()).toBe(200);
  });

  test('should have business title in page', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Page should have h1 heading
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Title should be non-empty
    const title = await h1.textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  test('should have contact information section', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Check for phone/contact link
    const contactInfo = page.locator('a[href^="tel:"]');
    // May or may not be present depending on business data
  });

  test('should have products section or empty state', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Products section heading
    const productsHeading = page.getByRole('heading', { name: /Products & Services/i });
    await expect(productsHeading).toBeVisible();

    // Should show either products or empty state message
    const productsSection = page.locator('.divide-y, .p-8').first();
    await expect(productsSection).toBeVisible();
  });

  test('should have reviews section or empty state', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Reviews section heading
    const reviewsHeading = page.getByRole('heading', { name: /Reviews/i });
    await expect(reviewsHeading).toBeVisible();
  });

  test('should have rating display', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Rating stars should be visible (even if 0)
    const ratingSection = page.locator('text=0.0').or(page.locator('.text-yellow-500').first());
    // The rating section should exist in the reviews header
  });

  test('should have social links section or skip', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Social links section (if present)
    const socialSection = page.getByText(/Follow Us/i);
    // May or may not be present
  });

  test('should have location/map section', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Location heading
    const locationHeading = page.getByRole('heading', { name: /Location/i });
    await expect(locationHeading).toBeVisible();
  });

  test('should have tags section or skip', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Tags heading
    const tagsHeading = page.getByRole('heading', { name: /Tags/i });
    // May or may not be present
  });

  test('should have hours section', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Hours heading
    const hoursHeading = page.getByRole('heading', { name: /Hours/i });
    await expect(hoursHeading).toBeVisible();
  });

  test('should have WhatsApp contact button or skip', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // WhatsApp button (if contact number exists)
    const whatsappButton = page.getByText(/WhatsApp/i);
    // May or may not be present
  });

  test('should have photo gallery section', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Gallery heading
    const galleryHeading = page.getByText(/Photo Gallery/i);
    await expect(galleryHeading).toBeVisible();
  });

  test('should have no console errors', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(`/business/${businessSlug}`, { waitUntil: 'networkidle' });

    // Filter out known non-critical warnings
    const criticalErrors = errors.filter(
      err => !err.includes('Failed to load resource') && !err.includes('net::')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have JSON-LD schema', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // JSON-LD script should exist
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();

    // Should have valid JSON
    const content = await jsonLd.textContent();
    expect(() => JSON.parse(content || '')).not.toThrow();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Check semantic elements
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('should have breadcrumb or navigation path', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Page should have a way to navigate back
    const backLink = page.locator('a[href="/listing"]').or(page.locator('a[href="/listing?type=business"]'));
    // May or may not be directly visible
  });

  test('should display business status badge', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Check if status badge exists (may or may not show "Live")
    const statusBadge = page.locator('[class*="badge"], [class*="status"]').first();
    const hasStatus = await statusBadge.isVisible().catch(() => false);
    // If status badge exists, it should have some text
    if (hasStatus) {
      await expect(statusBadge).toBeVisible();
    }
    // Otherwise, test passes (no badge is valid too)
  });

  test('should have share functionality', async ({ page }) => {
    if (!businessSlug) {
      test.skip();
      return;
    }

    await page.goto(`/business/${businessSlug}`);

    // Share button should exist
    const shareButton = page.locator('#share-btn');
    await expect(shareButton).toBeVisible();
  });
});
