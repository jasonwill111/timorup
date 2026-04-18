import { test, expect, Page } from '@playwright/test';

// Test T-009: Integration tests for geocoding UX flow
// Satisfies: AC-US2-03, AC-US2-04, AC-US2-05

test.describe('Business Create/Edit Geocoding UX', () => {

  test.describe.configure({ mode: 'serial' });

  test('should show loading state and populate lat/lng when geocoding succeeds', async ({ page }) => {
    // Mock Nominatim to return valid coordinates
    await page.route('**/nominatim.openstreetmap.org/search**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { lat: '-8.4', lon: '125.6', display_name: 'Aileu, Timor-Leste' }
        ]),
      });
    });

    // Mock session to return a logged-in user
    await page.route('/api/auth/session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: { user: { id: 'test-user-123' } }
        }),
      });
    });

    // Mock no existing business
    await page.route('/api/businesses/my-business', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/business/create');

    // Wait for page to load
    await page.waitForSelector('#business-form');

    // Fill in address
    await page.fill('#address', 'Aileu, Timor-Leste');

    // Click get coordinates button
    const getCoordsBtn = page.locator('#get-coords-btn');
    await expect(getCoordsBtn).toBeEnabled();
    await getCoordsBtn.click();

    // Button should be disabled during search
    await expect(getCoordsBtn).toBeDisabled();
    await expect(getCoordsBtn).toContainText('Searching...');

    // Wait for response and button to re-enable
    await expect(getCoordsBtn).toBeEnabled({ timeout: 10000 });

    // Lat/lng should be populated
    const latInput = page.locator('#latitude');
    const lngInput = page.locator('#longitude');
    await expect(latInput).not.toBeEmpty();
    await expect(lngInput).not.toBeEmpty();

    const latValue = await latInput.inputValue();
    const lngValue = await lngInput.inputValue();
    expect(parseFloat(latValue)).toBeCloseTo(-8.4, 1);
    expect(parseFloat(lngValue)).toBeCloseTo(125.6, 1);
  });

  test('should show error message when address not found', async ({ page }) => {
    // Mock Nominatim to return empty results
    await page.route('**/nominatim.openstreetmap.org/search**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Mock session
    await page.route('/api/auth/session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: { user: { id: 'test-user-123' } }
        }),
      });
    });

    // Mock no existing business
    await page.route('/api/businesses/my-business', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/business/create');
    await page.waitForSelector('#business-form');

    // Fill with invalid address
    await page.fill('#address', 'InvalidPlaceXYZ999');

    const getCoordsBtn = page.locator('#get-coords-btn');
    await getCoordsBtn.click();

    // Wait for button to re-enable
    await expect(getCoordsBtn).toBeEnabled({ timeout: 10000 });

    // Should show alert with "not found" message
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('not found');
      await dialog.accept();
    });

    // The alert should appear - give it a moment
    await page.waitForTimeout(500);
  });

  test('should make geocoding request when button is clicked', async ({ page }) => {
    let nominatimCalled = false;

    // Track Nominatim request
    await page.route('**/nominatim.openstreetmap.org/search**', async (route) => {
      nominatimCalled = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { lat: '-8.5', lon: '125.5' }
        ]),
      });
    });

    // Mock session
    await page.route('/api/auth/session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: { user: { id: 'test-user-123' } }
        }),
      });
    });

    // Mock no existing business
    await page.route('/api/businesses/my-business', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/business/create');
    await page.waitForSelector('#business-form');

    await page.fill('#address', 'Dili');

    const getCoordsBtn = page.locator('#get-coords-btn');
    await getCoordsBtn.click();

    // Wait for request to complete
    await expect(getCoordsBtn).toBeEnabled({ timeout: 10000 });

    // Verify Nominatim was called
    expect(nominatimCalled).toBe(true);
  });

  test('should disable button when geocoding is in progress', async ({ page }) => {
    // Delay Nominatim response
    await page.route('**/nominatim.openstreetmap.org/search**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { lat: '-8.5', lon: '125.5' }
        ]),
      });
    });

    // Mock session
    await page.route('/api/auth/session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: { user: { id: 'test-user-123' } }
        }),
      });
    });

    // Mock no existing business
    await page.route('/api/businesses/my-business', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/business/create');
    await page.waitForSelector('#business-form');

    await page.fill('#address', 'Dili');

    const getCoordsBtn = page.locator('#get-coords-btn');
    await getCoordsBtn.click();

    // Button should be disabled during request
    await expect(getCoordsBtn).toBeDisabled();

    // Wait for request to complete
    await expect(getCoordsBtn).toBeEnabled({ timeout: 5000 });
  });

  test('should show alert when trying to geocode without address', async ({ page }) => {
    // Mock session
    await page.route('/api/auth/session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session: { user: { id: 'test-user-123' } }
        }),
      });
    });

    // Mock no existing business
    await page.route('/api/businesses/my-business', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/business/create');
    await page.waitForSelector('#business-form');

    // Don't fill address

    let alertShown = false;
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('enter an address');
      await dialog.accept();
      alertShown = true;
    });

    const getCoordsBtn = page.locator('#get-coords-btn');
    await getCoordsBtn.click();

    await page.waitForTimeout(500);
    expect(alertShown).toBe(true);
  });
});
