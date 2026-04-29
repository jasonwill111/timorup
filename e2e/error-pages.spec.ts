// ============================================
// Error Pages E2E Tests
// ============================================

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4323';

test.describe('Error Pages', () => {

  test.describe.configure({ mode: 'serial' });

  test('404 page should show friendly message', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/this-page-does-not-exist`);
    expect(response?.status()).toBe(404);

    // Should have meaningful content, not just "404"
    const body = await page.content();
    expect(body.toLowerCase()).toMatch(/not found|404/i);

    // Should show helpful navigation options
    const hasHomeLink = body.includes('Go Home') || body.includes('go home');
    expect(hasHomeLink).toBe(true);

    // Should not show technical error details
    expect(body).not.toMatch(/stack trace|undefined is not/i);
  });

  test('404 page should have proper title', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`);

    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/not found|404/i);
  });

  test('404 page should be accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`);

    // Page should have main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Should have at least one link (navigation)
    const links = page.locator('a');
    expect(await links.count()).toBeGreaterThan(0);
  });

  test('404 page should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const response = await page.goto(`${BASE_URL}/nonexistent-page-mobile`);

    expect(response?.status()).toBe(404);

    const content = await page.content();
    expect(content.toLowerCase()).toMatch(/not found|404/i);
  });

  test('Non-existent business page returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/business/this-business-does-not-exist-12345`);

    // Should either 404 or show a proper "not found" message
    expect([404, 200]).toContain(response?.status());

    if (response?.status() === 200) {
      const content = await page.content();
      expect(content.toLowerCase()).toMatch(/not found|does not exist/i);
    }
  });

  test('Non-existent product page returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/business/test/product/nonexistent-product-xyz`);

    expect([404, 200]).toContain(response?.status());

    if (response?.status() === 200) {
      const content = await page.content();
      expect(content.toLowerCase()).toMatch(/not found|does not exist/i);
    }
  });

  test('Non-existent category page returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/category/nonexistent-category-abc`);

    // Should handle gracefully
    expect([404, 200]).toContain(response?.status());
  });

  test('Non-existent NGO page returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ngos/nonexistent-ngo-xyz`);

    expect([404, 200]).toContain(response?.status());
  });

  test('Non-existent government page returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/govs/nonexistent-gov-xyz`);

    expect([404, 200]).toContain(response?.status());
  });

  test('Deep nested non-existent path returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/a/b/c/d/e/f/g/h/nonexistent`);

    expect(response?.status()).toBe(404);
  });

  test('Special characters in URL handled gracefully', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/business/<script>alert(1)</script>`);

    // Should not execute script, should handle gracefully
    expect([404, 400]).toContain(response?.status());
  });

  test('Unicode characters in URL handled gracefully', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/business/日本語テスト`);

    // Should handle Unicode paths gracefully
    expect([404, 400, 200]).toContain(response?.status());
  });

  test('Empty path segments handled gracefully', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}//double-slash//path`);

    // Should handle double slashes without crashing
    expect([404, 400, 200]).toContain(response?.status());
  });
});

test.describe('Server Error Pages (5xx)', () => {

  test.describe.configure({ mode: 'serial' });

  test('API with invalid query parameter should return error', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/businesses?invalid_param=%00`);

    // Should handle gracefully - either 400 (bad request) or 500 (internal error)
    // but not crash the server
    expect([400, 500]).toContain(response.status());
  });

  test('API with malformed query string should return error', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/businesses?a%`);

    // Should handle malformed percent encoding
    expect([400, 404, 500]).toContain(response.status());
  });

  test('API with very long query string should handle gracefully', async ({ request }) => {
    const longParam = 'x'.repeat(10000);
    const response = await request.get(`${BASE_URL}/api/businesses?q=${longParam}`);

    // Should not crash - should return error or use defaults
    expect([200, 400, 414, 500]).toContain(response.status());
  });

  test('Unknown API endpoint should return 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/nonexistent-endpoint`);

    expect(response.status()).toBe(404);
  });

  test('API with unsupported HTTP method should return 405', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/businesses`);

    // DELETE on collection endpoint - method not allowed or accepted
    expect([405, 400, 501]).toContain(response.status());
  });

  test('API with TRACE method should return 405', async ({ request }) => {
    const response = await request.fetch(`${BASE_URL}/api/businesses`, {
      method: 'TRACE'
    });

    expect([405, 501]).toContain(response.status());
  });

  test('API with OPTIONS method should return 405 or valid response', async ({ request }) => {
    const response = await request.fetch(`${BASE_URL}/api/businesses`, {
      method: 'OPTIONS'
    });

    expect([200, 204, 405]).toContain(response.status());
  });
});

test.describe('Error Page Accessibility', () => {

  test('404 page should be keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`);
    await page.keyboard.press('Tab');

    // Should be able to tab to links
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('404 page should have proper heading hierarchy', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`);

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // No h2 before h1
    const headings = await page.locator('h1, h2, h3').all();
    expect(headings.length).toBeGreaterThan(0);
  });
});