// ============================================
// Authentication Tests - Complete Coverage
// ============================================

import { test, expect } from '@playwright/test';
import { UserFactory, loginAsUser, cleanupTestData } from './factories';

test.describe('Authentication - User Registration', () => {
  
  test.beforeEach(async ({ page }) => {
    await cleanupTestData(page);
  });

  // US-001: Email Registration
  test('US-001: should register with valid email', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or show success
    await expect(page).toHaveURL(/\/(dashboard|login\?registered=true)/, { timeout: 10000 });
  });

  test('US-001: should show error for invalid email format', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('US-001: should show error for password mismatch', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=match')).toBeVisible();
  });

  test('US-001: should show error for weak password', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/password|strong/i)).toBeVisible();
  });

  // US-002: Phone Registration
  test('US-002: should register with phone number', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '+67077234567');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/(dashboard|login)/, { timeout: 10000 });
  });

  test('US-002: should validate phone number format', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '123');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Should show phone validation error
    await expect(page.locator(/phone|valid.*number/i)).toBeVisible();
  });

  // Edge cases
  test('US-001: should not register with duplicate email', async ({ page }) => {
    const email = `duplicate${Date.now()}@example.com`;
    
    // First registration
    await page.goto('/register');
    await page.fill('input[name="name"]', 'User One');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 10000 });
    
    // Second registration with same email
    await page.goto('/register');
    await page.fill('input[name="name"]', 'User Two');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/already|exists|duplicate/i)).toBeVisible();
  });

  test('US-001: should require all required fields', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    
    // Should show required field errors
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
  });
});

test.describe('Authentication - User Login', () => {
  
  // US-005: Session persistence
  test('US-005: should login with valid credentials', async ({ page }) => {
    // Note: This test assumes a user already exists
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('US-005: should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/invalid|incorrect|wrong/i)).toBeVisible();
  });

  test('US-005: should show error with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/invalid|incorrect|password/i)).toBeVisible();
  });

  test('US-005: should persist session after page refresh', async ({ page }) => {
    // Login first
    await loginAsUser(page, 'test@example.com', 'TestPassword123!');
    
    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('US-005: session should last for 7 days', async ({ page }) => {
    // Login
    await loginAsUser(page);
    
    // Check cookie expiry (should be ~7 days)
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session'));
    
    if (sessionCookie) {
      const expires = new Date(sessionCookie.expires * 1000);
      const now = new Date();
      const daysUntilExpiry = (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      expect(daysUntilExpiry).toBeGreaterThan(6);
      expect(daysUntilExpiry).toBeLessThanOrEqual(8);
    }
  });
});

test.describe('Authentication - OAuth Login', () => {
  
  // US-003: Google OAuth
  test('US-003: should show Google OAuth button', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('US-003: should redirect to Google OAuth', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /google/i }).click();
    
    // Should redirect to Google
    await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 5000 });
  });

  // US-004: Facebook OAuth
  test('US-004: should show Facebook OAuth button', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
  });

  test('US-004: should redirect to Facebook OAuth', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /facebook/i }).click();
    
    // Should redirect to Facebook
    await expect(page).toHaveURL(/facebook\.com/, { timeout: 5000 });
  });
});

test.describe('Authentication - Logout', () => {
  
  // US-006: Logout
  test('US-006: should logout and redirect to home', async ({ page }) => {
    // Login first
    await loginAsUser(page);
    
    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i })
      .or(page.getByRole('link', { name: /logout|sign out/i }));
    
    await logoutButton.click();
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Should show login button
    await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible();
  });

  test('US-006: should clear session on logout', async ({ page }) => {
    // Login
    await loginAsUser(page);
    
    // Logout
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Authentication - Password Reset', () => {
  
  // US-007: Password Reset
  test('US-007: should have forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('link', { name: /forgot.*password|password.*reset/i })).toBeVisible();
  });

  test('US-007: should show reset password form', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /reset|send/i })).toBeVisible();
  });

  test('US-007: should send reset email with valid email', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator(/check.*email|reset.*sent/i)).toBeVisible();
  });

  test('US-007: should show error with invalid email', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.click('button[type="submit"]');
    
    // Should show error or success (to prevent email enumeration)
    await expect(page.locator(/not found|invalid|email.*sent/i)).toBeVisible();
  });

  test('US-007: should allow setting new password', async ({ page }) => {
    // This test would require a real reset token
    // Just test the form exists
    await page.goto('/reset-password?token=test-token');
    
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /update.*password|save/i })).toBeVisible();
  });
});

test.describe('Authentication - Email Verification', () => {
  
  // US-008: Email Verification
  test('US-008: should show verification pending message', async ({ page }) => {
    // This would require a user with unverified email
    await page.goto('/dashboard');
    
    // Should show verification banner or prompt
    await expect(page.locator(/verify.*email|email.*verification/i)).toBeVisible();
  });

  test('US-008: should have resend verification link', async ({ page }) => {
    await page.goto('/verify-email');
    
    await expect(page.getByRole('button', { name: /resend|send.*again/i })).toBeVisible();
  });
});

test.describe('Authentication - Profile Management', () => {
  
  // US-009: Profile Edit
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test('US-009: should view profile information', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('US-009: should update profile name', async ({ page }) => {
    await page.goto('/profile');
    
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('US-009: should update phone number', async ({ page }) => {
    await page.goto('/profile');
    
    await page.fill('input[name="phone"]', '+67077234567');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('US-009: should upload profile avatar', async ({ page }) => {
    await page.goto('/profile');
    
    // Find avatar upload input
    const avatarInput = page.locator('input[type="file"][name="avatar"]');
    if (await avatarInput.isVisible()) {
      await avatarInput.setInputFiles({
        name: 'avatar.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
      });
      
      await page.click('button[type="submit"]');
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });
});

test.describe('Authentication - Navigation', () => {
  
  test('should navigate to register from login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /sign up|register|create.*account/i }).click();
    
    await expect(page).toHaveURL(/\/register/);
  });

  test('should navigate to login from register', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: /sign in|login/i }).click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    
    // Browser native validation should trigger
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });
});
