import { test, expect } from '@playwright/test';

/**
 * US-001: One Listing Per User
 * 
 * As a user I want to create only ONE listing (business OR non-profit)
 * So that system maintains clean data model
 */
test.describe('US-001: One Listing Per User', () => {

  test('AC-US1-01: User without listing sees both Business and Non-Profit options when creating', async ({ page }) => {
    // Given: a logged-in user with no existing listing
    // When: the user navigates to /listings/create
    // Then: both "Business" and "Non-Profit" entity type options are visible/enabled

    // TODO: Implement test steps
    // AC text: User without listing sees both "Business" and "Non-Profit" options when creating
  });

  test('AC-US1-02: User with existing listing sees only their listing type (Business or Non-Profit)', async ({ page }) => {
    // Given: a logged-in user who already has one listing
    // When: the user navigates to /listings/create
    // Then: only the user's existing listing type option is visible; the other is hidden/disabled

    // TODO: Implement test steps
    // AC text: User with existing listing sees only their listing type (Business or Non-Profit)
  });

  test('AC-US1-03: Create button disabled/hidden if user already has a listing', async ({ page }) => {
    // Given: a logged-in user who already has one listing
    // When: the user is on the listings page
    // Then: the "Create Listing" button is hidden or disabled

    // TODO: Implement test steps
    // AC text: Create button disabled/hidden if user already has a listing
  });

  test('AC-US1-04: API prevents creating second listing even if frontend check bypassed', async ({ page }) => {
    // Given: a logged-in user who already has one listing
    // When: a POST request is made directly to /api/listings with valid business data (bypassing frontend)
    // Then: the API returns 409 Conflict or 403 Forbidden and no second listing is created

    // TODO: Implement test steps
    // AC text: API prevents creating second listing even if frontend check bypassed
  });

});
