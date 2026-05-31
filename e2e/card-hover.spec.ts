import { test, expect } from '@playwright/test';

test.describe('Card Hover Fix Verification', () => {
  test('Homepage cards should be visible and not disappear on hover', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check hero section exists
    await expect(page.locator('h1')).toContainText('TimorUp');
    
    // Check for Explore section
    await expect(page.locator('text=Explore Timor-Leste')).toBeVisible();
    
    // Check for business cards in the grid
    const businessCards = page.locator('.business-card');
    const cardCount = await businessCards.count();
    console.log(`Found ${cardCount} business cards`);
    
    // At least some cards should be visible
    expect(cardCount).toBeGreaterThan(0);
    
    // Test hover on first card
    const firstCard = businessCards.first();
    await firstCard.scrollIntoViewIfNeeded();
    
    // Verify card is visible before hover
    await expect(firstCard).toBeVisible();
    
    // Hover over the card
    await firstCard.hover();
    
    // Card should still be visible after hover (not disappear)
    await expect(firstCard).toBeVisible();
    
    // Check that card has the expected structure
    const cardInner = firstCard.locator('div').first();
    await expect(cardInner).toBeVisible();
  });

  test('Listing cards should be visible and not disappear on hover', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on Listings tab
    const listingsTab = page.locator('button[data-tab="listings"]');
    if (await listingsTab.isVisible()) {
      await listingsTab.click();
      await page.waitForTimeout(500);
      
      const listingCards = page.locator('.listing-card');
      const listingCount = await listingCards.count();
      console.log(`Found ${listingCount} listing cards`);
      
      if (listingCount > 0) {
        const firstListing = listingCards.first();
        await firstListing.scrollIntoViewIfNeeded();
        await expect(firstListing).toBeVisible();
        
        // Hover and verify still visible
        await firstListing.hover();
        await expect(firstListing).toBeVisible();
      }
    }
  });
});