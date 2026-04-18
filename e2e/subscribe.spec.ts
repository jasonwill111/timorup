import { test, expect, Page } from '@playwright/test';

// Test T-004: E2E tests for subscribe page QR behavior
// Satisfies: AC-US1-01, AC-US1-02, NFR-QR-01, NFR-QR-02

test.describe('Subscribe Page QR Code Behavior', () => {

  test('should show placeholder when API returns null payment_qr', async ({ page }) => {
    // Mock API to return null payment_qr
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: null } }),
      });
    });

    await page.goto('/subscribe?plan=monthly');

    // QR image should NOT be visible
    const qrImage = page.locator('#qr-code');
    await expect(qrImage).toBeHidden();

    // Skeleton should NOT be visible (fetch completes immediately with mock)
    const skeleton = page.locator('#qr-skeleton');
    await expect(skeleton).toBeHidden();

    // Placeholder should be visible with the configured message
    const placeholder = page.locator('#qr-placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText('Payment QR code not yet configured');
  });

  test('should show placeholder when API returns empty string payment_qr', async ({ page }) => {
    // Mock API to return empty string payment_qr
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: '' } }),
      });
    });

    await page.goto('/subscribe?plan=monthly');

    // QR image should NOT be visible (empty string treated as not configured)
    const qrImage = page.locator('#qr-code');
    await expect(qrImage).toBeHidden();

    // Placeholder should be visible
    const placeholder = page.locator('#qr-placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText('Payment QR code not yet configured');
  });

  test('should show QR image when API returns valid payment_qr URL', async ({ page }) => {
    const qrUrl = 'https://r2.example.com/qr.png';

    // Mock API to return valid payment_qr
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: qrUrl } }),
      });
    });

    await page.goto('/subscribe?plan=monthly');

    // QR image should be visible with correct src
    const qrImage = page.locator('#qr-code');
    await expect(qrImage).toBeVisible();
    await expect(qrImage).toHaveAttribute('src', qrUrl);
    await expect(qrImage).toHaveAttribute('loading', 'lazy'); // NFR-QR-01

    // Placeholder should NOT be visible
    const placeholder = page.locator('#qr-placeholder');
    await expect(placeholder).toBeHidden();

    // Skeleton should NOT be visible
    const skeleton = page.locator('#qr-skeleton');
    await expect(skeleton).toBeHidden();
  });

  test('should show loading skeleton during API fetch', async ({ page }) => {
    // Delay the API response to allow skeleton to be visible
    await page.route('/api/settings/public', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: null } }),
      });
    });

    await page.goto('/subscribe?plan=monthly');

    // Skeleton should be visible during fetch
    const skeleton = page.locator('#qr-skeleton');
    await expect(skeleton).toBeVisible();

    // Wait for fetch to complete
    await page.waitForResponse('/api/settings/public');

    // Skeleton should be hidden after fetch completes
    await expect(skeleton).toBeHidden();
  });

  test('should display correct plan info for monthly plan', async ({ page }) => {
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: null } }),
      });
    });

    await page.goto('/subscribe?plan=monthly');

    await expect(page.locator('#plan-name')).toContainText('Monthly Plan');
    await expect(page.locator('#plan-display')).toContainText('Monthly Plan');
    await expect(page.locator('#plan-price')).toContainText('$39/month');
  });

  test('should display correct plan info for yearly plan', async ({ page }) => {
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: null } }),
      });
    });

    await page.goto('/subscribe?plan=yearly');

    await expect(page.locator('#plan-name')).toContainText('Yearly Plan');
    await expect(page.locator('#plan-display')).toContainText('Yearly Plan');
    await expect(page.locator('#plan-price')).toContainText('$390/year');
  });

  test('should default to monthly plan when plan param is invalid', async ({ page }) => {
    await page.route('/api/settings/public', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { payment_qr: null } }),
      });
    });

    await page.goto('/subscribe?plan=invalid');

    // Should default to monthly plan
    await expect(page.locator('#plan-name')).toContainText('Monthly Plan');
    await expect(page.locator('#plan-price')).toContainText('$39/month');
  });

  test('should show placeholder when API request fails', async ({ page }) => {
    // Mock API to fail
    await page.route('/api/settings/public', (route) => {
      route.abort('failed');
    });

    await page.goto('/subscribe?plan=monthly');

    // Wait for fetch to fail and placeholder to show
    await page.waitForSelector('#qr-placeholder:not(.hidden)', { timeout: 5000 });

    // Placeholder should be visible
    const placeholder = page.locator('#qr-placeholder');
    await expect(placeholder).toBeVisible();

    // QR image should be hidden
    const qrImage = page.locator('#qr-code');
    await expect(qrImage).toBeHidden();
  });
});
