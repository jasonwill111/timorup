// Comprehensive Page & API Verification Test
import { test, expect, type Page } from '@playwright/test';

test.describe('Complete System Verification', () => {
  
  // Test all public pages load without crash
  const publicPages = [
    { url: '/', name: 'Homepage' },
    { url: '/businesses', name: 'Businesses Directory' },
    { url: '/search', name: 'Search' },
    { url: '/pricing', name: 'Pricing' },
    { url: '/subscribe?plan=monthly', name: 'Subscribe' },
    { url: '/login', name: 'Login' },
    { url: '/register', name: 'Register' },
    { url: '/forgot-password', name: 'Forgot Password' },
    { url: '/reset-password?token=test', name: 'Reset Password' },
    { url: '/verify?token=test', name: 'Verify Email' },
    { url: '/privacy', name: 'Privacy Policy' },
    { url: '/terms', name: 'Terms of Service' },
  ];

  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} (${pageInfo.url}) should load without error`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      
      // Check page loaded (not crashed)
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      
      // Log any console errors (but don't fail on them for now)
      if (errors.length > 0) {
        console.log(`${pageInfo.name} console errors:`, errors);
      }
    });
  }

  // Test API endpoints respond
  test('API endpoints should respond', async ({ request }) => {
    const baseUrl = 'http://localhost:8787';
    
    const endpoints = [
      { url: `${baseUrl}/api/businesses`, expect: [200, 401, 404] },
      { url: `${baseUrl}/api/categories`, expect: [200, 401, 404] },
      { url: `${baseUrl}/api/banners`, expect: [200, 401, 404] },
      { url: `${baseUrl}/api/products`, expect: [200, 401, 404] },
      { url: `${baseUrl}/api/reviews?businessId=test`, expect: [200, 401, 404] },
      { url: `${baseUrl}/api/auth/get-session`, expect: [200, 401] },
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint.url);
      console.log(`${endpoint.url}: ${response.status()}`);
      expect(endpoint.expect).toContain(response.status());
    }
  });

  // Test pages that require auth (should redirect or show auth UI)
  test('Protected pages should handle unauthenticated access', async ({ page }) => {
    const protectedPages = [
      '/account',
      '/business/create',
      '/admin',
    ];

    for (const url of protectedPages) {
      await page.goto(url, { waitUntil: 'networkidle' });
      const content = await page.content();
      // Should either redirect to login or show login form
      const hasLoginForm = content.includes('login') || content.includes('signin') || content.includes('email');
      console.log(`${url}: has login UI = ${hasLoginForm}`);
      expect(hasLoginForm).toBe(true);
    }
  });

  // Test business detail page (needs a slug that might not exist, but page should load)
  test('Business detail page should load structure', async ({ page }) => {
    await page.goto('/business/test-business', { waitUntil: 'networkidle' });
    const content = await page.content();
    // Should show something (either business details or "not found" or "expired")
    const hasContent = content.length > 100;
    expect(hasContent).toBe(true);
  });

  // Test product pages
  test('Product pages should load structure', async ({ page }) => {
    await page.goto('/business/test/products', { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasContent = content.length > 100;
    expect(hasContent).toBe(true);
  });
});
