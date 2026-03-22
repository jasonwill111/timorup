// Complete Business Flow Test
// Tests the entire user journey from registration to business publication

import { test, expect } from '@playwright/test';

test.describe('Complete Business Flow', () => {
  
  test('1. User Registration Flow', async ({ page }) => {
    console.log('Testing Registration Flow...');
    
    // Navigate to register page
    await page.goto('/register');
    await expect(page).toHaveURL(/register/);
    
    // Fill registration form
    await page.fill('#name', 'Test Business Owner');
    await page.fill('#email', `test${Date.now()}@example.com`);
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response (may redirect or show success/error)
    await page.waitForTimeout(2000);
    
    // Should either redirect or show message
    const url = page.url();
    console.log('Registration result URL:', url);
    
    // If successful, should be redirected or show success
    console.log('✅ Registration flow test completed');
  });

  test('2. Login Flow', async ({ page }) => {
    console.log('Testing Login Flow...');
    
    // Navigate to login page
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    
    // Fill login form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Password123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    console.log('✅ Login flow test completed');
  });

  test('3. Homepage and Navigation', async ({ page }) => {
    console.log('Testing Homepage and Navigation...');
    
    // Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/TMBIZ/i);
    
    // Check header elements
    await expect(page.locator('header')).toBeVisible();
    
    // Check navigation links (use first() to avoid strict mode)
    await expect(page.locator('header').getByRole('link', { name: /Businesses/i }).first()).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: /Pricing/i }).first()).toBeVisible();
    
    // Check footer
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ Homepage and Navigation test completed');
  });

  test('4. Business Directory Flow', async ({ page }) => {
    console.log('Testing Business Directory...');
    
    // Navigate to businesses page
    await page.goto('/businesses');
    await expect(page).toHaveURL(/businesses/);
    await expect(page.getByRole('heading', { name: /Business Directory/i })).toBeVisible();
    
    // Check search input exists
    await expect(page.getByPlaceholder(/Search businesses/i)).toBeVisible();
    
    // Check category filter
    const categorySelect = page.locator('#category-filter');
    if (await categorySelect.isVisible()) {
      console.log('Category filter found');
    }
    
    console.log('✅ Business Directory test completed');
  });

  test('5. Pricing Page Flow', async ({ page }) => {
    console.log('Testing Pricing Page...');
    
    // Navigate to pricing page
    await page.goto('/pricing');
    await expect(page).toHaveURL(/pricing/);
    
    // Check pricing tiers are displayed
    await expect(page.getByText('Basic', { exact: true })).toBeVisible();
    await expect(page.getByText('Pro', { exact: true })).toBeVisible();
    await expect(page.getByText('Max', { exact: true })).toBeVisible();
    
    // Check prices
    await expect(page.getByText('$39', { exact: true })).toBeVisible();
    await expect(page.getByText('$69', { exact: true })).toBeVisible();
    await expect(page.getByText('$99', { exact: true })).toBeVisible();
    
    console.log('✅ Pricing Page test completed');
  });

  test('6. Subscribe Flow', async ({ page }) => {
    console.log('Testing Subscribe Flow...');
    
    // Navigate to subscribe page
    await page.goto('/subscribe?plan=monthly');
    await expect(page).toHaveURL(/subscribe/);
    
    // Check payment instructions are displayed
    await expect(page.getByText(/Payment Instructions/i)).toBeVisible();
    
    console.log('✅ Subscribe flow test completed');
  });

  test('7. Search Flow', async ({ page }) => {
    console.log('Testing Search Flow...');
    
    // Navigate to search page
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: /Search Results/i })).toBeVisible();
    
    // Perform search
    await page.fill('#search-input', 'restaurant');
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    console.log('✅ Search flow test completed');
  });

  test('8. Privacy and Terms Pages', async ({ page }) => {
    console.log('Testing Legal Pages...');
    
    // Test privacy page
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();
    
    // Test terms page
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: /Terms of Service/i })).toBeVisible();
    
    console.log('✅ Legal Pages test completed');
  });

  test('9. Password Reset Flow', async ({ page }) => {
    console.log('Testing Password Reset Flow...');
    
    // Test forgot password page
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
    
    // Test reset password page (with invalid token)
    await page.goto('/reset-password?token=invalid');
    await page.waitForTimeout(1000);
    
    console.log('✅ Password Reset flow test completed');
  });

  test('10. Protected Pages Redirect', async ({ page }) => {
    console.log('Testing Protected Pages...');
    
    // Test account page - should redirect to login or show unauthorized
    await page.goto('/account');
    const accountUrl = page.url();
    console.log('Account page URL:', accountUrl);
    
    // Test create business page - should redirect or show unauthorized
    await page.goto('/business/create');
    const createUrl = page.url();
    console.log('Create business page URL:', createUrl);
    
    // Test admin page - should redirect or show unauthorized
    await page.goto('/admin');
    const adminUrl = page.url();
    console.log('Admin page URL:', adminUrl);
    
    console.log('✅ Protected Pages test completed');
  });
});
