import { test, expect } from '@playwright/test';

/**
 * US-002: Non-Profit Listing (Free, Immediate)
 * 
 * As a user I want to create non-profit listing immediately (no payment)
 * So that government agencies and NGOs can list free
 */
test.describe('US-002: Non-Profit Listing (Free, Immediate)', () => {

  test('AC-US2-01: Non-profit listing becomes status published immediately after creation', async ({ page }) => {
    // Given: a logged-in user with no existing listing
    // When: the user creates a non-profit listing
    // Then: the listing status is 'published' immediately (no pending/approval step)

    // TODO: Implement test steps
    // AC text: Non-profit listing becomes `status: 'published'` immediately after creation
  });

  test('AC-US2-02: Non-profit has no plan/subscription/expiry fields', async ({ page }) => {
    // Given: a user viewing a non-profit listing's admin/edit page
    // When: the page loads
    // Then: there are no plan, subscription, or expiry fields visible for non-profit listings

    // TODO: Implement test steps
    // AC text: Non-profit has no plan/subscription/expiry fields
  });

  test('AC-US2-03: Non-profit listing CANNOT have SKUs (SKU section hidden/not available)', async ({ page }) => {
    // Given: a user viewing their non-profit listing's edit page
    // When: the page loads
    // Then: the SKU section is not visible or accessible

    // TODO: Implement test steps
    // AC text: Non-profit listing CANNOT have SKUs (SKU section hidden/not available)
  });

  test('AC-US2-04: Non-profit cannot be affected by grace period or auto-delete', async ({ page }) => {
    // Given: a non-profit listing with an associated user account
    // When: subscription cleanup jobs run or grace period logic executes
    // Then: the non-profit listing is unaffected (not expired, not deleted)

    // TODO: Implement test steps — may require DB inspection or API verification
    // AC text: Non-profit cannot be affected by grace period or auto-delete
  });

});
