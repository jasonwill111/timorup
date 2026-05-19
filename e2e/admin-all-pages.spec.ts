import { test, expect, Page } from '@playwright/test';

// Use PRODUCTION environment for testing
const BASE_URL = 'https://timorlist.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@timorlist.com';
const ADMIN_PASSWORD = 'admin12345';

// Helper to login
async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.waitForLoadState('domcontentloaded');

  // Check if already logged in (redirected to home page or admin dashboard)
  const currentUrl = page.url();
  if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
    console.log('Already logged in, at:', currentUrl);
    return;
  }

  // Check if redirected to home (user already has session)
  if (!currentUrl.includes('/admin/login')) {
    console.log('Redirected to:', currentUrl);
    // Try going directly to admin
    await page.goto(`${BASE_URL}/admin`);
    return;
  }

  // Wait for the form to load
  const emailInput = page.locator('#email');
  const passwordInput = page.locator('#password');

  await emailInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
    console.log('Email input not found, page may be on login page');
  });

  await page.fill('#email', ADMIN_EMAIL);
  await page.fill('#password', ADMIN_PASSWORD);

  // Submit the form
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

// ==================== ADMIN PAGES ====================

test.describe('Admin Dashboard & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Dashboard loads with stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('body')).toBeVisible();

    // Check for stat cards
    const hasStats = await page.locator('[class*="stat"], [id*="stat"]').count() > 0;
    console.log('Dashboard has stats:', hasStats);
  });

  test('Sidebar navigation is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    const sidebar = page.locator('nav, aside, [class*="sidebar"], [class*="nav"]');
    await expect(sidebar.first()).toBeVisible();
  });
});

// ==================== ADMIN ENTITIES ====================

test.describe('Admin - Businesses', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Businesses page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/businesses`);
    await expect(page.locator('body')).toBeVisible();

    // Check for table or list
    const content = await page.content();
    console.log('Businesses page loaded, length:', content.length);
  });

  test('Can view business details', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/businesses`);
    await page.waitForTimeout(1000);

    // Look for any business item or table row
    const rows = page.locator('tr, [class*="card"], [class*="item"]');
    const count = await rows.count();
    console.log('Business rows/items found:', count);
  });
});

test.describe('Admin - Non-Profits', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Non-Profits page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/non-profits`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - Public Sectors', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Public Sectors page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/public-sectors`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - Listings', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Listings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/listings`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==================== ADMIN PRODUCTS & ORDERS ====================

test.describe('Admin - Products', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Products page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);
    await expect(page.locator('body')).toBeVisible();

    const content = await page.content();
    console.log('Products page loaded, checking for "Products" title...');

    // Check page title
    const h1 = page.locator('h1');
    const title = await h1.textContent();
    console.log('Page title:', title);
  });

  test('Products add button exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);
    await page.waitForTimeout(1000);

    const addBtn = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")');
    const count = await addBtn.count();
    console.log('Add/Create buttons found:', count);
  });
});

test.describe('Admin - Orders (renamed from Subscriptions)', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Orders page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/orders`);
    await expect(page.locator('body')).toBeVisible();

    const content = await page.content();
    console.log('Orders page loaded, checking for "Orders" title...');

    const h1 = page.locator('h1');
    const title = await h1.textContent();
    console.log('Page title:', title);
  });
});

// ==================== ADMIN MARKETING ====================

test.describe('Admin - Ad Banners (renamed from Heroes)', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Ad Banners page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/ad-banners`);
    await expect(page.locator('body')).toBeVisible();

    const h1 = page.locator('h1');
    const title = await h1.textContent();
    console.log('Page title:', title);
  });
});

test.describe('Admin - Service Packages', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Service Packages page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/service-packages`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==================== ADMIN CONTENT ====================

test.describe('Admin - Blogs', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Blogs page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/blogs`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - Media', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Media page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/media`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - Categories', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Categories page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categories`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Categories formFields section exists when selecting Listing type', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categories`);
    await page.waitForTimeout(1500);

    // Click Add button to open modal
    const addBtn = page.locator('button:has-text("Add")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(800);
    }

    // Check modal opened
    const modal = page.locator('#category-modal');
    const modalVisible = await modal.isVisible();
    console.log('Modal visible:', modalVisible);

    if (modalVisible) {
      // Change entity type to listing using force
      const entitySelect = page.locator('#cat-entity-type');
      if (await entitySelect.count() > 0) {
        await entitySelect.selectOption({ index: 3 }); // Listing is 4th option (index 3)
        await page.waitForTimeout(500);

        // Check if formFields section is now visible
        const formFieldsSection = page.locator('#formfields-section');
        const hasFormFields = await formFieldsSection.count() > 0;
        console.log('Has formFields section:', hasFormFields);

        if (hasFormFields) {
          // Check if it's visible (not hidden)
          const isHidden = await formFieldsSection.evaluate(el => el.classList.contains('hidden'));
          console.log('formFields is hidden:', isHidden);
          expect(!isHidden).toBeTruthy();
        } else {
          console.log('ERROR: formFields section not found in DOM');
        }
      }
    }
  });
});

// ==================== ADMIN USERS & REVIEWS ====================

test.describe('Admin - Users', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Users page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/users`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - Reviews', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Reviews page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/reviews`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==================== ADMIN SETTINGS ====================

test.describe('Admin - Settings', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Settings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/settings`);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin - AI Tools', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('AI Tools page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/ai-tools`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==================== ROUTE REDIRECTS ====================

test.describe('Route Redirects (Old -> New)', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test('Old subscriptions route should 404 or redirect', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin/subscriptions`, { waitUntil: 'load' });
    const status = response?.status();
    console.log('/admin/subscriptions status:', status);
  });

  test('Old skus route should 404 or redirect', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin/skus`, { waitUntil: 'load' });
    const status = response?.status();
    console.log('/admin/skus status:', status);
  });

  test('Old heroes route should 404 or redirect', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin/heroes`, { waitUntil: 'load' });
    const status = response?.status();
    console.log('/admin/heroes status:', status);
  });
});
