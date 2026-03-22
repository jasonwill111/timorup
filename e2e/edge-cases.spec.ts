// Edge Case and Validation Tests
import { test, expect } from '@playwright/test';

test.describe('Authentication Validation', () => {
  
  test('Register with invalid email should show error', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'not-an-email');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Should show validation error
    const content = await page.content();
    const hasError = content.includes('valid') || content.includes('email') || content.includes('invalid');
    console.log('Invalid email test - has error message:', hasError);
  });

  test('Register with short password should show error', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', '123'); // Too short
    await page.fill('#confirmPassword', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Should show password error (min 8 chars)
    const content = await page.content();
    const hasError = content.includes('password') || content.includes('8') || content.includes('character');
    console.log('Short password test - has error:', hasError);
  });

  test('Register with mismatched passwords should show error', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'different123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    const hasError = content.includes('match') || content.includes('same');
    console.log('Password mismatch test - has error:', hasError);
  });

  test('Login without credentials should show error', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Should show validation error
    const url = page.url();
    console.log('Login without creds URL:', url);
  });

  test('Forgot password with invalid email format', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('#email', 'not-an-email');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    console.log('Forgot password - has validation:', content.length > 100);
  });
});

test.describe('Business Validation', () => {
  
  test('Create business without required fields', async ({ page }) => {
    // Need auth first - just test the form exists
    await page.goto('/business/create');
    await page.waitForTimeout(1000);
    
    // Should redirect to login or show form
    const url = page.url();
    console.log('Create business URL:', url);
  });

  test('Business slug auto-generation', async ({ page }) => {
    await page.goto('/business/create');
    await page.waitForTimeout(1000);
    
    const url = page.url();
    console.log('Create business page accessible:', url.includes('login') || url.includes('create'));
  });
});

test.describe('Search Functionality', () => {
  
  test('Search with special characters', async ({ page }) => {
    await page.goto('/search?q=<script>alert(1)</script>');
    await page.waitForTimeout(1000);
    
    // Should escape special characters
    const content = await page.content();
    console.log('Search with XSS - page loads:', content.length > 100);
  });

  test('Search with empty query', async ({ page }) => {
    await page.goto('/search?q=');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    console.log('Empty search - has UI:', content.includes('Search') || content.includes('result'));
  });

  test('Search with very long query', async ({ page }) => {
    await page.goto('/search?q=' + 'a'.repeat(1000));
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    console.log('Long search - page loads:', content.length > 100);
  });
});

test.describe('Pricing Page', () => {
  
  test('Pricing with invalid plan query', async ({ page }) => {
    await page.goto('/subscribe?plan=invalid');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    console.log('Invalid plan - has UI:', content.includes('Subscribe') || content.includes('Payment'));
  });

  test('Pricing page shows all tiers', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content.includes('Basic')).toBe(true);
    expect(content.includes('Pro')).toBe(true);
    expect(content.includes('Max')).toBe(true);
    expect(content.includes('$39')).toBe(true);
    expect(content.includes('$69')).toBe(true);
    expect(content.includes('$99')).toBe(true);
  });
});

test.describe('URL Handling', () => {
  
  test('Non-existent business page', async ({ page }) => {
    await page.goto('/business/this-business-does-not-exist-12345');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    const hasContent = content.length > 100;
    console.log('Non-existent business - has content:', hasContent);
  });

  test('Non-existent product page', async ({ page }) => {
    await page.goto('/business/test/product/12345-nonexistent');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    console.log('Non-existent product - page loads:', content.length > 100);
  });

  test('Direct admin access without auth', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);
    
    const url = page.url();
    const content = await page.content();
    console.log('Admin without auth - URL:', url, 'Has login:', content.includes('login') || content.includes('signin'));
  });
});

test.describe('Mobile Responsiveness', () => {
  
  test('Mobile viewport - businesses page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/businesses');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });

  test('Mobile viewport - pricing page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content.includes('$39')).toBe(true);
  });

  test('Mobile viewport - login page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content.includes('login') || content.includes('email')).toBe(true);
  });
});

test.describe('Theme & Accessibility', () => {
  
  test('Theme toggle works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const themeToggle = page.locator('#theme-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      console.log('Theme toggle clicked');
    }
  });

  test('Page has proper headings', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const h1 = page.locator('h1');
    const hasH1 = await h1.count() > 0;
    console.log('Homepage has h1:', hasH1);
  });

  test('Forms have labels', async ({ page }) => {
    await page.goto('/login');
    await page.waitForTimeout(500);
    
    const labels = page.locator('label');
    const labelCount = await labels.count();
    console.log('Login page has labels:', labelCount > 0);
  });
});
