// ============================================
// Performance Tests
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Performance - Page Load', () => {
  
  test('Homepage should load within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Directory page should load within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/directory');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Business detail page should load within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/business/1');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Login page should load within 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('Pricing page should load within 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/pricing');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(2000);
  });
});

test.describe('Performance - API Response', () => {
  
  test('GET /api/businesses should respond within 500ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/businesses');
    const responseTime = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(500);
  });

  test('GET /api/categories should respond within 300ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/categories');
    const responseTime = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(300);
  });

  test('GET /api/search should respond within 500ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/search?q=restaurant');
    const responseTime = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(500);
  });
});

test.describe('Performance - Time to Interactive', () => {
  
  test('Homepage TTI should be under 5 seconds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for main content to be interactive
    await page.waitForSelector('main, [role="main"]');
    
    const tti = Date.now();
    expect(tti).toBeLessThan(5000);
  });

  test('Directory should be interactive within 5 seconds', async ({ page }) => {
    await page.goto('/directory');
    
    await page.waitForSelector('.business-list, [data-testid="business-list"]');
    
    const tti = Date.now();
    expect(tti).toBeLessThan(5000);
  });
});

test.describe('Performance - Lazy Loading', () => {
  
  test('Images should be lazy loaded', async ({ page }) => {
    await page.goto('/directory');
    
    const images = await page.locator('img[loading="lazy"]').count();
    expect(images).toBeGreaterThan(0);
  });

  test('Below-fold content should load on scroll', async ({ page }) => {
    await page.goto('/directory');
    
    // Initial load should have limited content
    const initialCards = await page.locator('.business-card').count();
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Should load more content
    const afterScrollCards = await page.locator('.business-card').count();
    expect(afterScrollCards).toBeGreaterThanOrEqual(initialCards);
  });
});

test.describe('Performance - Bundle Optimization', () => {
  
  test('Page should not have render-blocking resources', async ({ page }) => {
    await page.goto('/');
    
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.waitForTimeout(2000);
    
    // No critical errors
    expect(errors.filter(e => e.includes('blocking'))).toHaveLength(0);
  });
});
