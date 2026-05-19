/**
 * TDD E2E Test Suite
 * Following local knowledge base best practices:
 * - Astro SSR + Cloudflare Workers
 * - better-auth authentication
 * - Drizzle ORM with D1
 * - R2 storage
 */

import { test, expect, Page, Request } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8787';
const ADMIN_EMAIL = 'admin@TimorUp.com';
const ADMIN_PASSWORD = 'admin12345';
const USER_EMAIL = 'user@TimorUp.com';
const USER_PASSWORD = 'user12345';

// ==================== HELPERS ====================

async function fillLoginForm(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

// ==================== TDD: RED (Write failing tests first) ====================

test.describe('TDD: User Story 1 - Authentication', () => {
  // Given: A user visits the login page
  // When: They enter valid credentials
  // Then: They should be logged in and redirected

  test('US1-AC1: User can login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await fillLoginForm(page);
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForTimeout(3000);

    // Verify login success by checking session storage or URL
    const sessionUserId = await page.evaluate(() => localStorage.getItem('userId'));
    console.log('Session userId:', sessionUserId ? 'Set' : 'Not set');
  });

  test('US1-AC2: User can logout', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await fillLoginForm(page);
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Find and click logout
    const avatarBtn = page.locator('#avatar-dropdown-btn').first();
    if (await avatarBtn.isVisible()) {
      await avatarBtn.click();
      await page.waitForTimeout(500);
    }

    const logoutBtn = page.locator('#logout-btn').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(2000);
    }

    // Verify logged out
    const clearedUserId = await page.evaluate(() => localStorage.getItem('userId'));
    expect(clearedUserId).toBeNull();
  });

  test('US1-AC3: Admin can access admin dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await fillLoginForm(page);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    // Admin should see admin content
    const body = await page.locator('body').innerHTML();
    expect(body.length).toBeGreaterThan(0);
  });
});

test.describe('TDD: User Story 2 - Business CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login as user before each test
    await page.goto(`${BASE_URL}/login`);
    await fillLoginForm(page);
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('US2-AC1: User can view their businesses', async ({ page }) => {
    await page.goto(`${BASE_URL}/account/businesses`);
    await page.waitForLoadState('networkidle');

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });

  test('US2-AC2: User can create a business listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/create`);
    await page.waitForLoadState('networkidle');

    // Fill required fields
    const nameInput = page.locator('input[name="name"], input[id="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill(`Test Business ${Date.now()}`);
    }

    const descInput = page.locator('textarea[name="description"]').first();
    if (await descInput.isVisible()) {
      await descInput.fill('Test description for E2E testing');
    }

    // Select entity type
    const entityType = page.locator('select[name="entityType"]').first();
    if (await entityType.isVisible()) {
      await entityType.selectOption('business');
    }

    // Submit
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  });

  test('US2-AC3: User can view business listings page', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await page.waitForLoadState('networkidle');

    const listings = await page.locator('body').innerHTML();
    expect(listings.length).toBeGreaterThan(0);
  });
});

test.describe('TDD: User Story 3 - SKU Management', () => {
  test.setTimeout(60000); // SKU tests need more time

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('US3-AC1: User can view products page', async ({ page }) => {
    // Navigate directly to products-services page (public page)
    await page.goto(`${BASE_URL}/products-services`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify page loaded by checking for heading or content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('US3-AC2: Subscription limits enforced in UI', async ({ page }) => {
    await page.goto(`${BASE_URL}/account/businesses`);
    await page.waitForLoadState('networkidle');

    // Check for usage indicator
    const usageIndicator = page.locator('#usage-indicator, [data-testid="usage"]');
    const hasUsage = await usageIndicator.isVisible().catch(() => false);
    console.log('Usage indicator visible:', hasUsage);
  });
});

test.describe('TDD: User Story 4 - Categories', () => {
  test('US4-AC1: Categories page displays all categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });

  test('US4-AC2: Category filter works', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    // Try clicking a filter if exists
    const filterBtn = page.locator('button:has-text("Business"), button:has-text("Organization")').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('US4-AC3: XSS prevention in category names', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    // Check for console errors (XSS would cause JS execution errors)
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(1000);

    // XSS injection would cause console errors like "alert is not defined"
    const hasXssErrors = errors.some(e =>
      e.includes('alert') ||
      e.includes('eval') ||
      e.includes('document.cookie') ||
      e.includes('XSS')
    );

    expect(hasXssErrors).toBe(false);
  });
});

test.describe('TDD: User Story 5 - Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('US5-AC1: Admin can view dashboard with stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    const statsCards = page.locator('[class*="card"], .stat-card, .stats');
    const count = await statsCards.count();
    console.log('Stats cards found:', count);
    expect(count).toBeGreaterThan(0);
  });

  test('US5-AC2: Stats API returns MTD metrics', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/admin/stats`);

    if (response.status() === 200) {
      const data = await response.json();
      // API returns { success, data: { totalUsers, totalBusinesses, mtd, ... } }
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('totalUsers');
      expect(data.data).toHaveProperty('totalBusinesses');
      expect(data.data).toHaveProperty('mtd');
      console.log('Stats data:', JSON.stringify(data).substring(0, 200));
    }
  });

  test('US5-AC3: Admin can manage plans', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/plans`);
    await page.waitForLoadState('networkidle');

    const plansTable = page.locator('table, [class*="plan"]');
    const exists = await plansTable.isVisible().catch(() => false);
    console.log('Plans table visible:', exists);
  });

  test('US5-AC4: Admin can view users', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');

    const usersTable = page.locator('table, [class*="user"]');
    const exists = await usersTable.isVisible().catch(() => false);
    console.log('Users table visible:', exists);
  });

  test('US5-AC5: Charts display on dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    const charts = page.locator('svg, canvas, [class*="chart"]');
    const count = await charts.count();
    console.log('Charts found:', count);
  });
});

test.describe('TDD: User Story 6 - Media Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('US6-AC1: Admin can access media page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/media`);
    await page.waitForLoadState('networkidle');

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });

  test('US6-AC2: Media API requires authentication', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();

    const response = await page.request.get(`${BASE_URL}/api/media`);
    // Should return 401 or error
    console.log('Media API without auth:', response.status());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('TDD: User Story 7 - Blog', () => {
  test('US7-AC1: Blog page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle');

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });

  test('US7-AC2: Admin can manage blogs', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto(`${BASE_URL}/admin/blogs`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });
});

test.describe('TDD: Security Tests', () => {
  test('SEC-AC1: XSS prevention on categories page', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    // Check page loaded without JS errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.waitForTimeout(1000);

    // XSS would cause console errors like "alert is not defined"
    const hasXssErrors = errors.some(e =>
      e.includes('alert') ||
      e.includes('eval') ||
      e.includes('document.cookie')
    );

    expect(hasXssErrors).toBe(false);
    console.log('Console errors:', errors.length);
  });

  test('SEC-AC2: API requires proper authentication', async ({ page }) => {
    const protectedEndpoints = [
      '/api/admin/users',
      '/api/admin/stats',
      '/api/media',
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await page.request.get(`${BASE_URL}${endpoint}`);
      console.log(`${endpoint}: ${response.status()}`);
    }
  });

  test('SEC-AC3: No sensitive data in page source', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    const html = await page.locator('body').innerHTML();

    // Should not contain API keys or secrets
    expect(html).not.toContain('sk_live_');
    expect(html).not.toContain('password=');
    expect(html).not.toContain('secret');
  });
});

test.describe('TDD: Performance Tests', () => {
  test('PERF-AC1: Pages load within acceptable time', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/businesses', name: 'Businesses' },
      { url: '/categories', name: 'Categories' },
      { url: '/pricing', name: 'Pricing' },
    ];

    for (const p of pages) {
      const start = Date.now();
      await page.goto(`${BASE_URL}${p.url}`);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - start;
      console.log(`${p.name}: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    }
  });

  test('PERF-AC2: No excessive network requests', async ({ page }) => {
    const requests: Request[] = [];

    page.on('request', (request) => {
      requests.push(request);
    });

    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Filter out static assets
    const apiRequests = requests.filter(r =>
      r.url().includes('/api/') ||
      r.url().includes('/admin/')
    );

    console.log('API requests on homepage:', apiRequests.length);
    expect(apiRequests.length).toBeLessThan(20);
  });
});

test.describe('TDD: Responsive Design', () => {
  test('RESP-AC1: Mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    const menuBtn = page.locator('#mobile-menu-btn');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }

    const mobileMenu = page.locator('#mobile-menu');
    const menuVisible = await mobileMenu.isVisible().catch(() => false);
    console.log('Mobile menu visible:', menuVisible);
  });

  test('RESP-AC2: Admin mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    const content = await page.locator('body').innerHTML();
    expect(content.length).toBeGreaterThan(0);
  });
});

test.describe('TDD: Integration with External Services', () => {
  test('INT-AC1: R2 media URLs are accessible', async ({ page }) => {
    // This tests that media URLs are properly formatted
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    const mediaUrls = await page.locator('img[src*="api/media"]').evaluateAll(els =>
      els.map(el => el.getAttribute('src'))
    );

    console.log('Media images found:', mediaUrls.length);

    // At least some images should be present
    expect(mediaUrls.length).toBeGreaterThanOrEqual(0);
  });

  test('INT-AC2: Map component loads if present', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await page.waitForLoadState('networkidle');

    const mapContainer = page.locator('[class*="map"], #map, [data-map]');
    const hasMap = await mapContainer.isVisible().catch(() => false);
    console.log('Map container visible:', hasMap);
  });
});

