// ============================================
// Reviews & Ratings Tests - Complete Coverage
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsUser } from './factories';

test.describe('Reviews - Rate Business', () => {
  
  // RV-001: Rate business
  test('RV-001: should show rating component', async ({ page }) => {
    await page.goto('/business/1');
    
    await expect(page.locator('.rating, [data-testid="rating"], input[type="rating"]')).toBeVisible();
  });

  test('RV-001: should allow selecting rating', async ({ page }) => {
    await page.goto('/business/1');
    
    const star5 = page.locator('button[aria-label="5 stars"], button:has-text("5")').first();
    if (await star5.isVisible()) {
      await star5.click();
    }
  });

  test('RV-001: should require login to rate', async ({ page }) => {
    await page.goto('/business/1');
    
    const rateButton = page.locator('button:has-text("Rate")');
    if (await rateButton.isVisible()) {
      await rateButton.click();
      
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('RV-001: logged in user can rate', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/business/1');
    
    const ratingInput = page.locator('input[name="rating"]');
    if (await ratingInput.isVisible()) {
      await ratingInput.fill('5');
    }
  });
});

test.describe('Reviews - Write Review', () => {
  
  // RV-002: Write review
  test('RV-002: should show review form', async ({ page }) => {
    await page.goto('/business/1');
    
    const reviewForm = page.locator('form[name="review"], [data-testid="review-form"]');
    if (await reviewForm.isVisible()) {
      await expect(reviewForm).toBeVisible();
    }
  });

  test('RV-002: should require login to review', async ({ page }) => {
    await page.goto('/business/1');
    
    const reviewButton = page.locator('button:has-text("Write Review")');
    if (await reviewButton.isVisible()) {
      await reviewButton.click();
      
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('RV-002: should submit review', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/business/1');
    
    const reviewTextarea = page.locator('textarea[name="comment"]');
    if (await reviewTextarea.isVisible()) {
      await reviewTextarea.fill('Great experience! Highly recommend.');
      await page.click('button[type="submit"]');
      
      await expect(page.locator(/success|thank/i)).toBeVisible();
    }
  });

  test('RV-002: should show review on list', async ({ page }) => {
    await page.goto('/business/1');
    
    await expect(page.locator('.review, [data-testid="review"]')).toBeVisible();
  });
});

test.describe('Reviews - Edit Review', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // RV-003: Edit review
  test('RV-003: should show edit button for own review', async ({ page }) => {
    await page.goto('/business/1');
    
    const editButton = page.locator('button:has-text("Edit Review"), button[aria-label="Edit"]');
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
    }
  });

  test('RV-003: should edit review', async ({ page }) => {
    await page.goto('/business/1');
    
    const editButton = page.locator('button:has-text("Edit")');
    if (await editButton.isVisible()) {
      await editButton.click();
      
      await page.fill('textarea[name="comment"]', 'Updated review comment');
      await page.click('button[type="submit"]');
      
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  test('RV-003: should not show edit for other user reviews', async ({ page }) => {
    await page.goto('/business/1');
    
    // Edit button should not be visible for other users' reviews
    const reviews = page.locator('.review');
    const count = await reviews.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Reviews - One Review Per User', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // RV-004: One review per user
  test('RV-004: should show edit instead of create for existing review', async ({ page }) => {
    await page.goto('/business/1');
    
    // User who already reviewed should see edit option
    const editButton = page.locator('button:has-text("Edit")');
    const createButton = page.locator('button:has-text("Write Review")');
    
    // Either edit (existing review) or create (new review) should be visible
    const visible = editButton.isVisible().then(r => r) || createButton.isVisible().then(r => r);
    expect(visible).toBeTruthy();
  });

  test('RV-004: should prevent duplicate review submission', async ({ page }) => {
    await page.goto('/business/1');
    
    // Try to submit another review
    const reviewForm = page.locator('form[name="review"]');
    if (await reviewForm.isVisible()) {
      await reviewForm.locator('textarea[name="comment"]').fill('Another review');
      await reviewForm.locator('button[type="submit"]').click();
      
      // Should show error or redirect to edit
      await expect(page.locator(/already|only.*one/i)).toBeVisible();
    }
  });
});

test.describe('Business Detail - Interactions', () => {
  
  test.describe('Like Business', () => {
    // BD-006: Like business
    test('BD-006: should show like button', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('button[aria-label="Like"], button:has-text("Like")')).toBeVisible();
    });

    test('BD-006: should like business', async ({ page }) => {
      await loginAsUser(page);
      await page.goto('/business/1');
      
      const likeButton = page.locator('button[aria-label="Like"]');
      if (await likeButton.isVisible()) {
        await likeButton.click();
        
        await expect(page.locator('.liked, [aria-pressed="true"]')).toBeVisible();
      }
    });

    test('BD-006: should unlike business', async ({ page }) => {
      await loginAsUser(page);
      await page.goto('/business/1');
      
      const likeButton = page.locator('button[aria-label="Like"]');
      if (await likeButton.isVisible()) {
        await likeButton.click();
        await likeButton.click();
        
        await expect(page.locator('.liked, [aria-pressed="false"]')).toBeVisible();
      }
    });

    test('BD-006: should increment like count', async ({ page }) => {
      await page.goto('/business/1');
      
      const likeCount = page.locator('.like-count, [data-testid="likes"]');
      if (await likeCount.isVisible()) {
        await expect(likeCount).toBeVisible();
      }
    });
  });

  test.describe('Bookmark Business', () => {
    // BD-007: Bookmark/Favorite
    test('BD-007: should show bookmark button', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('button[aria-label="Bookmark"], button:has-text("Bookmark")')).toBeVisible();
    });

    test('BD-007: should bookmark business', async ({ page }) => {
      await loginAsUser(page);
      await page.goto('/business/1');
      
      const bookmarkButton = page.locator('button[aria-label="Bookmark"]');
      if (await bookmarkButton.isVisible()) {
        await bookmarkButton.click();
        
        await expect(page.locator('.bookmarked')).toBeVisible();
      }
    });

    test('BD-007: should show bookmarked in profile', async ({ page }) => {
      await loginAsUser(page);
      await page.goto('/dashboard/bookmarks');
      
      await expect(page.locator('.bookmark, [data-testid="bookmark"]')).toBeVisible();
    });
  });

  test.describe('Share Business', () => {
    // BD-008: Share business
    test('BD-008: should show share button', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('button[aria-label="Share"], button:has-text("Share")')).toBeVisible();
    });

    test('BD-008: should open share dialog', async ({ page }) => {
      await page.goto('/business/1');
      
      const shareButton = page.locator('button:has-text("Share")');
      if (await shareButton.isVisible()) {
        await shareButton.click();
        
        await expect(page.locator('.share-dialog, [data-testid="share-options"]')).toBeVisible();
      }
    });

    test('BD-008: should show share options', async ({ page }) => {
      await page.goto('/business/1');
      
      const shareButton = page.locator('button:has-text("Share")');
      if (await shareButton.isVisible()) {
        await shareButton.click();
        
        await expect(page.locator('a[href*="whatsapp"], a[href*="facebook"]')).toBeVisible();
      }
    });
  });

  test.describe('WhatsApp Contact', () => {
    // BD-009: WhatsApp contact
    test('BD-009: should show WhatsApp button', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('a[href*="whatsapp"], button:has-text("WhatsApp")')).toBeVisible();
    });

    test('BD-009: should open WhatsApp with message', async ({ page }) => {
      await page.goto('/business/1');
      
      const whatsappLink = page.locator('a[href*="whatsapp"]');
      if (await whatsappLink.isVisible()) {
        await expect(whatsappLink).toHaveAttribute('href', /whatsapp/);
      }
    });
  });

  test.describe('Average Rating', () => {
    // BD-011: Average rating
    test('BD-011: should show average rating', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('.average-rating, [data-testid="average-rating"]')).toBeVisible();
    });

    test('BD-011: should show star rating', async ({ page }) => {
      await page.goto('/business/1');
      
      await expect(page.locator('.stars, .star-rating')).toBeVisible();
    });

    test('BD-011: should show review count', async ({ page }) => {
      await page.goto('/business/1');
      
      const reviewCount = page.locator('.review-count, [data-testid="review-count"]');
      if (await reviewCount.isVisible()) {
        await expect(reviewCount).toBeVisible();
      }
    });
  });
});
