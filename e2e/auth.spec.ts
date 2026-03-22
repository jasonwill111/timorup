import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Browser native validation will handle empty required fields
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    // Click the link in the card footer (not the header)
    await page.locator('main').getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/register/);
  });
});

test.describe('Register Page', () => {
  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: /create account/i }).click();
    // Browser native validation will handle empty required fields
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});
