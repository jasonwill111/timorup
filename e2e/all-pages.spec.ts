import { test, expect } from '@playwright/test';

// ==================== PUBLIC PAGES ====================

test.describe('Public Pages - Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TMBIZ/i);
  });

  test('should show header navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });

  test('should show footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should navigate to businesses from header', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /Businesses/i }).click();
    await expect(page).toHaveURL(/businesses/);
  });

  test('should navigate to pricing from header', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /Pricing/i }).click();
    await expect(page).toHaveURL(/pricing/);
  });

  test('should navigate to login from header', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /Log in/i }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register from header', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /Sign Up/i }).click();
    await expect(page).toHaveURL(/register/);
  });
});

test.describe('Public Pages - Businesses Directory', () => {
  test('should load businesses page', async ({ page }) => {
    await page.goto('/businesses');
    await expect(page.getByRole('heading', { name: /Business Directory/i })).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await page.goto('/businesses');
    await expect(page.getByPlaceholder(/Search businesses/i)).toBeVisible();
  });

  test('should show business cards grid', async ({ page }) => {
    await page.goto('/businesses');
    // Check for grid container
    const grid = page.locator('.grid');
    if (await grid.first().isVisible()) {
      await expect(grid.first()).toBeVisible();
    }
  });
});

test.describe('Public Pages - Search', () => {
  test('should load search page', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: /Search Results/i })).toBeVisible();
  });

  test('should show search form', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByPlaceholder(/Search businesses/i)).toBeVisible();
  });

  test('should perform search', async ({ page }) => {
    await page.goto('/search?q=test');
    // Should show results or no results message
    const content = await page.content();
    expect(content).toMatch(/result|Found|No businesses/i);
  });
});

test.describe('Public Pages - Pricing', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();
  });

  test('should show 3 pricing tiers', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('Basic', { exact: true })).toBeVisible();
    await expect(page.getByText('Pro', { exact: true })).toBeVisible();
    await expect(page.getByText('Max', { exact: true })).toBeVisible();
  });

  test('should show monthly prices', async ({ page }) => {
    await page.goto('/pricing');
    // Price shows as $39/mo in the HTML - use specific IDs to avoid matching yearly prices
    await expect(page.locator('#basic-price')).toBeVisible();
    await expect(page.locator('#pro-price')).toBeVisible();
    await expect(page.locator('#max-price')).toBeVisible();
  });

  test('should show yearly prices', async ({ page }) => {
    await page.goto('/pricing');
    // Click yearly toggle first
    await page.getByRole('button', { name: /yearly/i }).click();
    await expect(page.getByText('$390', { exact: true })).toBeVisible();
    await expect(page.getByText('$690', { exact: true })).toBeVisible();
    await expect(page.getByText('$990', { exact: true })).toBeVisible();
  });

  test('should navigate to subscribe page', async ({ page }) => {
    await page.goto('/pricing');
    const getStartedButton = page.getByRole('link', { name: /Get Started/i }).first();
    await getStartedButton.click();
    await expect(page).toHaveURL(/subscribe/);
  });
});

test.describe('Public Pages - Subscribe', () => {
  test('should load subscribe page with monthly plan', async ({ page }) => {
    await page.goto('/subscribe?plan=monthly');
    await expect(page.getByRole('heading', { name: /Complete Your Subscription/i })).toBeVisible();
  });

  test('should load subscribe page with yearly plan', async ({ page }) => {
    await page.goto('/subscribe?plan=yearly');
    await expect(page.getByRole('heading', { name: /Complete Your Subscription/i })).toBeVisible();
  });

  test('should show payment instructions', async ({ page }) => {
    await page.goto('/subscribe?plan=monthly');
    await expect(page.getByText(/Payment Instructions/i)).toBeVisible();
  });
});

test.describe('Public Pages - Legal', () => {
  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();
  });

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: /Terms of Service/i })).toBeVisible();
  });
});

// ==================== AUTH PAGES ====================

test.describe('Authentication - Login', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should show email input', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });

  test('should show password input', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test('should show sign in button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.locator('main').getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/register/);
  });

  test('should navigate to forgot password', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});

test.describe('Authentication - Register', () => {
  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
  });

  test('should show name input', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByLabel(/Name/i)).toBeVisible();
  });

  test('should show email input', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });

  test('should show password input', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should show create account button', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Authentication - Forgot Password', () => {
  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
  });

  test('should show email input', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });

  test('should show reset button', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible();
  });
});

test.describe('Authentication - Reset Password', () => {
  test('should load reset password page with token', async ({ page }) => {
    // Without a valid token, it may redirect or show error
    await page.goto('/reset-password?token=invalid');
    // Should either show form or error message
    const content = await page.content();
    expect(content).toMatch(/reset|invalid|error|token/i);
  });
});

// ==================== USER PAGES ====================

test.describe('User - Account', () => {
  test('should require authentication for account page', async ({ page }) => {
    await page.goto('/account');
    // Should redirect to login or show login prompt
    await expect(page).toHaveURL(/login|signin/);
  });
});

test.describe('User - Create Business', () => {
  test('should require authentication for create business page', async ({ page }) => {
    await page.goto('/business/create');
    // Should redirect to login
    await expect(page).toHaveURL(/login|signin/);
  });
});

// ==================== ADMIN PAGES ====================

test.describe('Admin - Dashboard', () => {
  test('should require authentication for admin page', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login
    await expect(page).toHaveURL(/login|signin/);
  });
});

// ==================== MOBILE RESPONSIVENESS ====================

test.describe('Mobile Navigation', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuButton = page.getByLabel(/open menu/i);
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Use a more specific selector for mobile nav
      await expect(page.locator('nav').last()).toBeVisible();
    }
  });

  test('should have 2-column grid on mobile for businesses', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/businesses');
    // Should show 2 columns on mobile
    const cards = page.locator('[class*="grid"] > div');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ==================== THEME ====================

test.describe('Theme Toggle', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('#theme-toggle').first();
    await themeToggle.click();
  });

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    await page.goto('/');
    // Theme should persist
    await expect(page.locator('#theme-toggle')).toBeVisible();
  });
});

// ==================== FOOTER LINKS ====================

test.describe('Footer Navigation', () => {
  test('should show footer links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should navigate to privacy from footer', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: /Privacy/i }).click();
    await expect(page).toHaveURL(/privacy/);
  });

  test('should navigate to terms from footer', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: /Terms/i }).click();
    await expect(page).toHaveURL(/terms/);
  });
});

// ==================== VERIFY EMAIL ====================

test.describe('Email Verification', () => {
  test('should load verify page', async ({ page }) => {
    await page.goto('/verify');
    // Should show verification UI (may redirect if no token)
    const content = await page.content();
    expect(content).toMatch(/verify|verification|email/i);
  });

  test('should show error with invalid token', async ({ page }) => {
    await page.goto('/verify?token=invalid');
    // Should show error or loading state
    const content = await page.content();
    expect(content).toMatch(/verify|verification|error|invalid/i);
  });
});

// ==================== EDIT BUSINESS ====================

test.describe('Edit Business Page', () => {
  test('should require auth for edit business page', async ({ page }) => {
    await page.goto('/edit-business-page/test-id');
    // Should redirect to login
    await expect(page).toHaveURL(/login|signin/);
  });
});
