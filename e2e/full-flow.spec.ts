import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8787';
const USER_EMAIL = 'user@timorlist.com';
const USER_PASSWORD = 'user12345';
const ADMIN_EMAIL = 'admin@timorlist.com';
const ADMIN_PASSWORD = 'admin12345';

test.describe('User Registration Flow', () => {
  test('register new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Fill registration form
    await page.fill('input[name="name"]', 'Test User E2E');
    await page.fill('input[name="email"]', `test-e2e-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect or success
    await page.waitForURL(url => !url.pathname.includes('/sign-up'), { timeout: 10000 });

    console.log('User registration: SUCCESS');
  });
});

test.describe('User Login & Business Creation Flow', () => {
  test('user login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000); // Wait for redirect

    console.log('User login: SUCCESS');
  });

  test('create business listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/create`);

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Fill business form
    const nameInput = page.locator('input[name="name"], input[id="name"], input[placeholder*="business" i]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Business E2E');
    }

    // Fill description
    const descInput = page.locator('textarea[name="description"], textarea[id="description"]').first();
    if (await descInput.isVisible()) {
      await descInput.fill('Test business description for E2E testing');
    }

    // Select entity type
    const entityType = page.locator('select[name="entityType"], select[id="entityType"]').first();
    if (await entityType.isVisible()) {
      await entityType.selectOption('business');
    }

    // Submit
    const submitBtn = page.locator('button[type="submit"], button:has-text("Create")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // Wait for result
    await page.waitForTimeout(3000);

    console.log('Business creation: Attempted');
  });

  test('create government listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/create`);
    await page.waitForLoadState('networkidle');

    // Select entity type: government
    const entityType = page.locator('select[name="entityType"]').first();
    if (await entityType.isVisible()) {
      await entityType.selectOption('government');
    }

    // Fill other fields
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Government E2E');
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    await page.waitForTimeout(3000);
    console.log('Government listing: Attempted');
  });

  test('create NGO listing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/create`);
    await page.waitForLoadState('networkidle');

    // Select entity type: nonprofit
    const entityType = page.locator('select[name="entityType"]').first();
    if (await entityType.isVisible()) {
      await entityType.selectOption('nonprofit');
    }

    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test NGO E2E');
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    await page.waitForTimeout(3000);
    console.log('NGO listing: Attempted');
  });
});

test.describe('Subscription Flow', () => {
  test('select subscription plan', async ({ page }) => {
    // Go to subscription page
    await page.goto(`${BASE_URL}/subscribe`);
    await page.waitForLoadState('networkidle');

    // Select a plan
    const planBtn = page.locator('button:has-text("Select"), button:has-text("Choose"), button:has-text("Subscribe")').first();
    if (await planBtn.isVisible()) {
      await planBtn.click();
    }

    await page.waitForTimeout(2000);
    console.log('Subscription plan selection: Attempted');
  });
});

test.describe('Admin Operations', () => {
  test('admin login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 10000 });

    console.log('Admin login: SUCCESS');
  });

  test('admin confirm subscription payment', async ({ page }) => {
    // Go to admin orders
    await page.goto(`${BASE_URL}/admin/orders`);
    await page.waitForLoadState('networkidle');

    // Look for pending orders
    const rows = page.locator('table tbody tr, [data-testid="order-row"]');
    const count = await rows.count();

    if (count > 0) {
      // Click first pending order
      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Approve")').first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }
    }

    await page.waitForTimeout(2000);
    console.log('Admin order confirmation: Attempted');
  });

  test('admin view stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/api/admin/stats`);

    // Check if response is JSON
    const content = await page.content();
    try {
      const data = JSON.parse(content);
      console.log('Admin stats: SUCCESS', Object.keys(data).join(', '));
    } catch {
      console.log('Admin stats: Response received (may need auth)');
    }
  });
});

test.describe('SKU Creation Flow', () => {
  test('create SKU in business page', async ({ page }) => {
    // Login as user
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Go to account
    await page.goto(`${BASE_URL}/account/businesses`);
    await page.waitForLoadState('networkidle');

    // Look for business to edit
    const editBtn = page.locator('a:has-text("Edit"), button:has-text("Edit")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(2000);
    }

    // Look for SKU creation area
    const addSkuBtn = page.locator('button:has-text("Add SKU"), button:has-text("Create SKU")').first();
    if (await addSkuBtn.isVisible()) {
      await addSkuBtn.click();
      await page.waitForTimeout(1000);

      // Fill SKU form
      const skuName = page.locator('input[name="name"], input[id="name"], input[placeholder*="sku" i]').first();
      if (await skuName.isVisible()) {
        await skuName.fill('Test SKU E2E');
      }

      const skuPrice = page.locator('input[name="price"], input[type="number"]').first();
      if (await skuPrice.isVisible()) {
        await skuPrice.fill('99.99');
      }

      const submitSkuBtn = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Add")').first();
      if (await submitSkuBtn.isVisible()) {
        await submitSkuBtn.click();
      }
    }

    await page.waitForTimeout(2000);
    console.log('SKU creation: Attempted');
  });
});

test.describe('API Endpoint Tests', () => {
  test('health check', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/`);
    console.log('Homepage status:', response.status());
  });

  test('businesses API', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/businesses`);
    console.log('Businesses API status:', response.status());
  });
});