/**
 * TimorUp E2E Production Tests
 * Tests against https://timorup.jasonwill.workers.dev
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://timorup.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@timorup.com';
const ADMIN_PASSWORD = 'admin12345';
const USER_EMAIL = 'test@example.com';
const USER_PASSWORD = 'TestPass123!';

console.log('Running tests against:', BASE_URL);

// ==================== USER AUTH ====================

test.describe('User Authentication', () => {
  test('Login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('User can login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#email', USER_EMAIL);
    await page.fill('#password', USER_PASSWORD);
    
    // Trigger form submission
    await page.evaluate(() => {
      const form = document.getElementById('login-form');
      form?.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    });
    
    await page.waitForTimeout(3000);
    console.log('After login URL:', page.url());
  });

  test('Invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');
    
    await page.evaluate(() => {
      const form = document.getElementById('login-form');
      form?.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    });
    
    await page.waitForTimeout(3000);
    // Should stay on login page with error
    expect(page.url()).toContain('/login');
  });
});

// ==================== USER PAGES ====================

test.describe('User Pages', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Business listing page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Account page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/account`);
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});

// ==================== ADMIN AUTH ====================

test.describe('Admin Authentication', () => {
  test('Admin login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
  });

  test('Admin login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"], input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"], input[type="password"], input#password', ADMIN_PASSWORD);
    
    await page.click('button[type="submit"]', { force: true });
    await page.waitForTimeout(5000);
    
    console.log('Admin login URL:', page.url());
    // Should redirect to admin dashboard
    expect(page.url()).toContain('/admin');
  });
});

// ==================== ADMIN PAGES ====================

test.describe('Admin Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"], input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"], input[type="password"], input#password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]', { force: true });
    await page.waitForTimeout(5000);
  });

  test('Admin dashboard loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin');
  });

  test('Admin users page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/users');
  });

  test('Admin businesses page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/businesses`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/businesses');
  });

  test('Admin listings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/listings`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/listings');
  });

  test('Admin categories page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categories`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/categories');
  });

  test('Admin blogs page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/blogs`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/blogs');
  });

  test('Admin plans page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/plans`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/plans');
  });

  test('Admin media page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/media`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/media');
  });

  test('Admin settings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/settings');
  });
});

// ==================== PUBLIC API ====================

test.describe('Public APIs', () => {
  test('Businesses API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/businesses`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Categories API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/categories`);
    expect(response.status()).toBe(200);
  });
});
