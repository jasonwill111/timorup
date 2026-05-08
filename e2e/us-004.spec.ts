import { test, expect } from '@playwright/test';

/**
 * US-004: SKU Creation After Activation
 * 
 * As a business owner I want to create SKUs only after my business is activated
 * So that I don't waste SKU quota before business is live
 */
test.describe('US-004: SKU Creation After Activation', () => {

  test('AC-US4-01: SKU creation page/API blocked if business status != published', async ({ page }) => {
    // Given: a business listing with `status: 'pending_payment'` or `'expired'`
    // When: the user tries to access SKU creation page or POST /api/skus
    // Then: access is denied (redirect to error, or API returns 403)

    // TODO: Implement test steps
    // AC text: SKU creation page/API blocked if business `status != 'published'`
  });

  test('AC-US4-02: SKU count limited by plan (Basic=10, Pro=30, Max=60)', async ({ page }) => {
    // Given: a business user on a paid plan (Basic, Pro, or Max)
    // When: the user attempts to create SKUs up to and beyond their plan limit
    // Then: the system prevents creating SKUs beyond Basic=10, Pro=30, Max=60

    // TODO: Implement test steps — may need to test multiple plan tiers
    // AC text: SKU count limited by plan (Basic=10, Pro=30, Max=60)
  });

  test('AC-US4-03: Error shown if user tries to exceed SKU limit', async ({ page }) => {
    // Given: a business user who has reached their plan's SKU limit
    // When: the user attempts to create one more SKU
    // Then: a user-facing error message is displayed explaining the limit

    // TODO: Implement test steps
    // AC text: Error shown if user tries to exceed SKU limit
  });

  test('AC-US4-04: Admin can view and manage any business SKUs', async ({ page }) => {
    // Given: an admin is logged in
    // When: the admin navigates to /admin/skus or a business's SKU management page
    // Then: all business SKUs are visible and manageable (create/edit/delete)

    // TODO: Implement test steps
    // AC text: Admin can view and manage any business's SKUs
  });

});
