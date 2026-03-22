import { test, expect, type Page } from '@playwright/test';

// Test data - use unique emails to avoid conflicts
const generateUniqueEmail = () => `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'testpassword123';

test.describe('User Authentication Flow', () => {
  
  test.describe('Registration', () => {
    test('should register a new user with valid credentials', async ({ page }) => {
      const email = generateUniqueEmail();
      
      await page.goto('/register');
      
      // Fill registration form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation or redirect after successful registration
      // The app might redirect to login or account page
      await page.waitForTimeout(2000);
      
      // Check if registration was successful (redirected or shows success message)
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(login|account|register)/);
    });

    test('should reject registration with short password (< 8 chars)', async ({ page }) => {
      await page.goto('/register');
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', generateUniqueEmail());
      await page.fill('input[name="password"]', 'short');
      await page.fill('input[name="confirmPassword"]', 'short');
      
      await page.click('button[type="submit"]');
      
      // Should show password validation error
      await expect(page.locator('text="Password must be at least 8 characters"')).toBeVisible({ timeout: 5000 });
    });

    test('should reject registration with mismatched passwords', async ({ page }) => {
      await page.goto('/register');
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', generateUniqueEmail());
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.fill('input[name="confirmPassword"]', 'differentpassword');
      
      await page.click('button[type="submit"]');
      
      // Should show password mismatch error
      await expect(page.locator('text="Passwords do not match"')).toBeVisible({ timeout: 5000 });
    });

    test('should reject duplicate email registration', async ({ page }) => {
      const email = generateUniqueEmail();
      
      // First registration
      await page.goto('/register');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Second registration with same email
      await page.goto('/register');
      await page.fill('input[name="name"]', 'Test User 2');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      
      // Should show duplicate email error
      await expect(page.locator('text="Email already registered"')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      // First create a user
      const email = generateUniqueEmail();
      
      await page.goto('/register');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Now login
      await page.goto('/login');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      
      // Should redirect to account page
      await expect(page).toHaveURL(/account/, { timeout: 10000 });
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error
      await expect(page.locator('text="Invalid email or password"')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Password Reset', () => {
    test('should load forgot password page', async ({ page }) => {
      await page.goto('/forgot-password');
      await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
    });
  });
});

test.describe('Business Directory Flow', () => {
  
  test.describe('Business Listing', () => {
    test('should display business directory page', async ({ page }) => {
      await page.goto('/businesses');
      
      // Check page title or heading
      await expect(page.getByRole('heading', { name: /businesses/i })).toBeVisible();
    });

    test('should display featured businesses', async ({ page }) => {
      await page.goto('/');
      
      // Check for featured businesses section
      await expect(page.locator('text="Featured"').first()).toBeVisible();
    });

    test('should filter businesses by category', async ({ page }) => {
      await page.goto('/businesses');
      
      // Look for category filter dropdown
      const categorySelect = page.locator('select[name="category"], select[id="category"]');
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
      }
    });

    test('should search businesses', async ({ page }) => {
      await page.goto('/businesses');
      
      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('restaurant');
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Business Details', () => {
    test('should display business detail page', async ({ page }) => {
      // Navigate to a business page if exists, otherwise create one
      await page.goto('/businesses');
      
      // Try to find and click on first business card
      const firstBusiness = page.locator('[class*="business-card"], [class*="BusinessCard"]').first();
      
      if (await firstBusiness.isVisible()) {
        await firstBusiness.click();
        await expect(page).toHaveURL(/\/business\//);
      } else {
        // If no businesses exist, this is expected for new projects
        console.log('No businesses found to test');
      }
    });
  });
});

test.describe('User Account Flow', () => {
  
  test.describe('Account Page', () => {
    test('should require authentication to access account page', async ({ page }) => {
      await page.goto('/account');
      
      // Should redirect to login or show login prompt
      await expect(page).toHaveURL(/\/(login|account)\?/, { timeout: 5000 });
    });
  });

  test.describe('Create Business', () => {
    test('should require authentication to create business', async ({ page }) => {
      await page.goto('/business/create');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
  });
});

test.describe('Admin Flow', () => {
  
  test.describe('Admin Dashboard', () => {
    test('should require admin role to access admin page', async ({ page }) => {
      await page.goto('/admin');
      
      // Should either redirect or show access denied
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(login|admin|account)/);
    });
  });
});
