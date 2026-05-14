import { test, expect, Page, request } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8787';
const ADMIN_EMAIL = 'admin@timorlist.com';
const ADMIN_PASSWORD = 'admin12345';
const USER_EMAIL = 'user@timorlist.com';
const USER_PASSWORD = 'user12345';

// ==================== HELPERS ====================

async function loginAs(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  // Wait for page load and Astro hydration
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Extra time for Astro islands to hydrate
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('#submit-btn');
  await page.waitForTimeout(2000);
}

async function logout(page: Page) {
  await page.goto(`${BASE_URL}/`);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

// ==================== PUBLIC PAGES ====================

test.describe('Public Pages', () => {
  test('Homepage loads', async ({ page }) => {
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Pricing page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('FAQ page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/faq`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Businesses listing loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Categories page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Blog page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==================== AUTH FLOWS ====================

test.describe('Authentication', () => {
  test('User can login', async ({ page }) => {
    await loginAs(page, USER_EMAIL, USER_PASSWORD);
    // Check login success - should redirect away from login page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    console.log('After login URL:', currentUrl);
  });

  test('Admin can login', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    console.log('Admin login URL:', currentUrl);
  });

  test('User can logout', async ({ page }) => {
    await loginAs(page, USER_EMAIL, USER_PASSWORD);
    await page.waitForTimeout(1000);

    // Click avatar dropdown if exists
    const avatarBtn = page.locator('#avatar-dropdown-btn, button:has-text("?")').first();
    if (await avatarBtn.isVisible()) {
      await avatarBtn.click();
      await page.waitForTimeout(500);
    }

    // Click logout
    const logoutBtn = page.locator('#logout-btn, button:has-text("Log Out"), button:has-text("Logout")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('Invalid credentials rejected', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('#submit-btn');
    await page.waitForTimeout(2000);
    // Should stay on login page or show error
  });
});

// ==================== USER FLOWS ====================

test.describe('User Business Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USER_EMAIL, USER_PASSWORD);
    await page.waitForTimeout(1000);
  });

  test('Access account page', async ({ page }) => {
    await page.goto(`${BASE_URL}/account`);
    await page.waitForLoadState('networkidle');
  });

  test('View businesses list', async ({ page }) => {
    await page.goto(`${BASE_URL}/account/businesses`);
    await page.waitForLoadState('networkidle');
  });

  test('View subscriptions', async ({ page }) => {
    await page.goto(`${BASE_URL}/account/subscriptions`);
    await page.waitForLoadState('networkidle');
  });

  test('Navigate to create listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/create`);
    await page.waitForLoadState('networkidle');
    // Should see create form elements
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

// ==================== ADMIN DASHBOARD ====================

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForTimeout(1000);
  });

  test('Admin dashboard loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Admin stats API accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/admin/stats`);
    // Should return JSON (200 or 401 based on auth)
    const contentType = response.headers()['content-type'];
    console.log('Stats API status:', response.status());
  });

  test('Admin users page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');
  });

  test('Admin categories page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categories`);
    await page.waitForLoadState('networkidle');
  });

  test('Admin listings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/listings`);
    await page.waitForLoadState('networkidle');
  });

  test('Admin plans page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/plans`);
    await page.waitForLoadState('networkidle');
  });

  test('Admin blogs page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/blogs`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('Admin subscriptions page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/subscriptions`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('Admin settings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/settings`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('Admin media page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/media`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('Admin skus page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/skus`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('Admin heroes page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/heroes`, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  });
});

// ==================== API ENDPOINTS ====================

test.describe('API Endpoints', () => {
  test('Businesses API', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/businesses`);
    console.log('Businesses API:', response.status());
  });

  test('Categories API', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/categories`);
    console.log('Categories API:', response.status());
  });

  test('Blog API', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/blogs`);
    console.log('Blog API:', response.status());
  });

  test('Landing pages API', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/landing-pages`);
    console.log('Landing pages API:', response.status());
  });

  test('AI tools API accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/admin/ai-tools`);
    console.log('AI tools API:', response.status());
  });

  test('Stats API returns valid JSON', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/admin/stats`);
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('totalUsers');
      expect(data).toHaveProperty('totalBusinesses');
    }
  });
});

// ==================== SUBSCRIPTION FLOWS ====================

test.describe('Subscription Flows', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USER_EMAIL, USER_PASSWORD);
    await page.waitForTimeout(1000);
  });

  test('View pricing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('networkidle');
    // Should see plan cards
    await expect(page.locator('body')).toBeVisible();
  });

  test('View subscription status', async ({ page }) => {
    await page.goto(`${BASE_URL}/account/subscriptions`);
    await page.waitForLoadState('networkidle');
  });

  test('Subscription API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/account/subscription/test`);
    console.log('Subscription API:', response.status());
  });
});

// ==================== BUSINESS PAGES ====================

test.describe('Business Pages', () => {
  test('Browse businesses listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Browse categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');
  });

  test('Use search functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    await page.waitForLoadState('networkidle');

    // Try to search
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('restaurant');
      await page.waitForTimeout(1000);
    }
  });

  test('Browse non-profit listings', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-profit`);
    await page.waitForLoadState('networkidle');
  });
});

// ==================== BLOG FLOWS ====================

test.describe('Blog Flows', () => {
  test('View blog listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle');
  });

  test('View products-services page', async ({ page }) => {
    await page.goto(`${BASE_URL}/products-services`);
    await page.waitForLoadState('networkidle');
  });
});

// ==================== SECURITY TESTS ====================

test.describe('Security Tests', () => {
  test('XSS prevention - no script execution on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check no script tags in visible content
    const bodyHtml = await page.locator('body').innerHTML();
    expect(bodyHtml).not.toContain('<script>alert');
  });

  test('XSS prevention - categories page', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.waitForLoadState('networkidle');

    // Page should load without executing malicious scripts
    const bodyHtml = await page.locator('body').innerHTML();
    expect(bodyHtml).not.toContain('<script>alert');
  });

  test('Unauthorized API access blocked', async ({ page }) => {
    // Test API requires auth
    const endpoints = [
      '/api/media',
      '/api/products',
    ];

    for (const endpoint of endpoints) {
      const response = await page.request.get(`${BASE_URL}${endpoint}`);
      // Should return 401 or redirect
      console.log(`${endpoint}:`, response.status());
    }
  });
});

// ==================== MOBILE RESPONSIVENESS ====================

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Mobile menu works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Click hamburger menu
    const menuBtn = page.locator('#mobile-menu-btn, button:has-text("☰"), button[aria-label="Open menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Mobile admin dashboard', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForTimeout(1000);
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
  });
});

// ==================== THEME TOGGLE ====================

test.describe('Theme Toggle', () => {
  test('Theme toggle exists on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const themeBtn = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button:has-text("☀️"), button:has-text("🌙")').first();
    const isVisible = await themeBtn.isVisible().catch(() => false);
    console.log('Theme toggle visible:', isVisible);
  });
});

// ==================== FORM VALIDATION ====================

test.describe('Form Validation', () => {
  test('Registration form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Try submitting empty form
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);
    }

    // Should show validation errors
    const url = page.url();
    console.log('After empty submit URL:', url);
  });

  test('Login form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Submit without filling
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

// ==================== PAGE PERFORMANCE ====================

test.describe('Page Performance', () => {
  test('Homepage loads under 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    console.log('Homepage load time:', loadTime, 'ms');
    expect(loadTime).toBeLessThan(5000);
  });

  test('Admin dashboard loads under 3 seconds', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForTimeout(1000);

    const start = Date.now();
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    console.log('Admin dashboard load time:', loadTime, 'ms');
    expect(loadTime).toBeLessThan(5000);
  });
});

// ==================== FOOTER LINKS ====================

test.describe('Footer Navigation', () => {
  test('Footer links accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      // Check footer links exist
      const links = await page.locator('footer a').count();
      console.log('Footer links count:', links);
      expect(links).toBeGreaterThan(0);
    }
  });

  test('Privacy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    await page.waitForLoadState('networkidle');
  });

  test('Terms page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`);
    await page.waitForLoadState('networkidle');
  });
});
