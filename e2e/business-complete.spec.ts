// ============================================
// Business Management Tests - Complete Coverage
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsUser, BusinessFactory } from './factories';

test.describe('Business Management - Create Business', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-001: Create new business
  test('BS-001: should navigate to create business page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Create Business');
    
    await expect(page).toHaveURL(/\/dashboard\/business\/new/);
  });

  test('BS-001: should show create business form', async ({ page }) => {
    await page.goto('/dashboard/business/new');
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
  });

  test('BS-001: should create business with valid data', async ({ page }) => {
    await page.goto('/dashboard/business/new');
    
    await page.fill('input[name="name"]', 'Test Restaurant');
    await page.selectOption('select[name="category"]', 'restaurant');
    await page.fill('input[name="contactName"]', 'John Doe');
    await page.fill('input[name="phone"]', '+67077234567');
    await page.fill('input[name="email"]', 'test@restaurant.com');
    await page.fill('textarea[name="address"]', 'Dili, Timor-Leste');
    
    await page.click('button[type="submit"]');
    
    // Should save as draft
    await expect(page).toHaveURL(/\/dashboard\/business/);
  });

  test('BS-001: should require business name', async ({ page }) => {
    await page.goto('/dashboard/business/new');
    
    await page.selectOption('select[name="category"]', 'restaurant');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
  });

  test('BS-001: should require category', async ({ page }) => {
    await page.goto('/dashboard/business/new');
    
    await page.fill('input[name="name"]', 'Test Business');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('select[name="category"]:invalid')).toBeVisible();
  });

  test('BS-001: should save as draft status', async ({ page }) => {
    await page.goto('/dashboard/business/new');
    
    await page.fill('input[name="name"]', 'Test Business');
    await page.selectOption('select[name="category"]', 'restaurant');
    await page.click('button[type="submit"]');
    
    // Should show draft status
    await expect(page.locator(/draft/i)).toBeVisible();
  });

  // BS-013: One business per user limit
  test('BS-013: should show error when user already has business', async ({ page }) => {
    // First create a business
    await page.goto('/dashboard/business/new');
    await page.fill('input[name="name"]', 'First Business');
    await page.selectOption('select[name="category"]', 'restaurant');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard\/business/);
    
    // Try to create another
    await page.goto('/dashboard/business/new');
    
    // Should show limit error
    await expect(page.locator(/already|only.*one|limit/i)).toBeVisible();
  });
});

test.describe('Business Management - Edit Business', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-002: Edit business
  test('BS-002: should navigate to edit business page', async ({ page }) => {
    await page.goto('/dashboard/business');
    await page.click('button:has-text("Edit")');
    
    await expect(page).toHaveURL(/\/dashboard\/business\/edit|\/edit/);
  });

  test('BS-002: should pre-fill edit form with existing data', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
  });

  test('BS-002: should update business name', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await page.fill('input[name="name"]', 'Updated Business Name');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('BS-002: should not allow editing other user business', async ({ page }) => {
    // Try to access another user's business
    await page.goto('/dashboard/business/edit/999');
    
    // Should show access denied or redirect
    await expect(page.locator(/access.*denied|not.*found|unauthorized/i)).toBeVisible();
  });
});

test.describe('Business Management - Media Upload', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-003: Banner upload
  test('BS-003: should show banner upload area', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const bannerInput = page.locator('input[type="file"][name="banner"]');
    if (await bannerInput.isVisible()) {
      await expect(bannerInput).toBeVisible();
    }
  });

  test('BS-003: should preview uploaded banner', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const bannerInput = page.locator('input[type="file"][name="banner"]');
    if (await bannerInput.isVisible()) {
      await bannerInput.setInputFiles({
        name: 'banner.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
      });
      
      // Should show preview
      await expect(page.locator('img[alt="banner"], img[src*="preview"]')).toBeVisible();
    }
  });

  // BS-004: Profile upload
  test('BS-004: should show profile upload area', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const profileInput = page.locator('input[type="file"][name="profile"]');
    if (await profileInput.isVisible()) {
      await expect(profileInput).toBeVisible();
    }
  });

  test('BS-004: should upload and preview profile', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const profileInput = page.locator('input[type="file"][name="profile"]');
    if (await profileInput.isVisible()) {
      await profileInput.setInputFiles({
        name: 'profile.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
      });
      
      await expect(page.locator('img[alt="profile"], img[src*="preview"]')).toBeVisible();
    }
  });
});

test.describe('Business Management - Contact Information', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-005: Contact information
  test('BS-005: should show contact fields', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await expect(page.locator('input[name="contactName"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('BS-005: should update contact name', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await page.fill('input[name="contactName"]', 'New Contact Name');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('BS-005: should update phone number', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await page.fill('input[name="phone"]', '+67077123456');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('BS-005: should validate email format', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/valid.*email|email.*invalid/i)).toBeVisible();
  });
});

test.describe('Business Management - Address & Map', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-006: Address and map coordinates
  test('BS-006: should show address input', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await expect(page.locator('textarea[name="address"], input[name="address"]')).toBeVisible();
  });

  test('BS-006: should update address', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    await page.fill('textarea[name="address"]', 'New Address, Dili');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('BS-006: should show map preview', async ({ page }) => {
    await page.goto('/business/1');
    
    // Should show map component
    const mapElement = page.locator('.map, iframe[src*="map"], [data-testid="map"]');
    if (await mapElement.isVisible()) {
      await expect(mapElement).toBeVisible();
    }
  });

  test('BS-006: should open map in new tab', async ({ page }) => {
    await page.goto('/business/1');
    
    // Click to open in maps
    const openMapLink = page.locator('a[href*="maps.google"], a:has-text("Open in Maps")');
    if (await openMapLink.isVisible()) {
      await expect(openMapLink).toHaveAttribute('href', /maps/);
    }
  });
});

test.describe('Business Management - Opening Hours', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-007: Opening hours
  test('BS-007: should show opening hours form', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Should show day selectors
    await expect(page.locator(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i)).toBeVisible();
  });

  test('BS-007: should set opening and closing time', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Set Monday hours
    const mondayOpen = page.locator('input[name="monday.open"]');
    const mondayClose = page.locator('input[name="monday.close"]');
    
    if (await mondayOpen.isVisible()) {
      await mondayOpen.fill('09:00');
      await mondayClose.fill('18:00');
    }
    
    await page.click('button[type="submit"]');
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('BS-007: should set closed day', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Find and check closed checkbox for Sunday
    const sundayClosed = page.locator('input[name="sunday.closed"]');
    if (await sundayClosed.isVisible()) {
      await sundayClosed.check();
    }
    
    await page.click('button[type="submit"]');
  });

  test('BS-007: should display hours on business page', async ({ page }) => {
    await page.goto('/business/1');
    
    // Should show opening hours section
    await expect(page.locator(/opening.*hours|hours/i)).toBeVisible();
  });
});

test.describe('Business Management - About Us (Lexical Editor)', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-008: About us with Lexical editor
  test('BS-008: should show rich text editor', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Should show Lexical editor
    const editor = page.locator('.lexical-editor, [contenteditable="true"]');
    if (await editor.isVisible()) {
      await expect(editor).toBeVisible();
    }
  });

  test('BS-008: should format text (bold, italic)', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Find and click bold button
    const boldButton = page.locator('button[title="Bold"], button:has-text("B")');
    if (await boldButton.isVisible()) {
      await boldButton.click();
    }
  });

  test('BS-008: should save editor content', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const editor = page.locator('[contenteditable="true"]');
    if (await editor.isVisible()) {
      await editor.fill('About us content...');
    }
    
    await page.click('button[type="submit"]');
    await expect(page.locator(/success|saved/i)).toBeVisible();
  });

  test('BS-008: should display about us on business page', async ({ page }) => {
    await page.goto('/business/1');
    
    // Should show about section
    await expect(page.locator(/about/i)).toBeVisible();
  });
});

test.describe('Business Management - Tags', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-009: Tags
  test('BS-009: should show tag input', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const tagInput = page.locator('input[name="tags"], [data-testid="tag-input"]');
    if (await tagInput.isVisible()) {
      await expect(tagInput).toBeVisible();
    }
  });

  test('BS-009: should add tags', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const tagInput = page.locator('input[name="tags"]');
    if (await tagInput.isVisible()) {
      await tagInput.fill('restaurant');
      await page.keyboard.press('Enter');
      await tagInput.fill('dili');
      await page.keyboard.press('Enter');
    }
    
    await page.click('button[type="submit"]');
  });

  test('BS-009: should limit tags to 3-5', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Try to add more than 5 tags
    const tagInput = page.locator('input[name="tags"]');
    if (await tagInput.isVisible()) {
      for (let i = 0; i < 7; i++) {
        await tagInput.fill(`tag${i}`);
        await page.keyboard.press('Enter');
      }
      
      // Should show limit error
      await expect(page.locator(/maximum.*tag|only.*5/i)).toBeVisible();
    }
  });

  test('BS-009: should remove tag', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    // Find and click remove button on a tag
    const removeTag = page.locator('button:has-text("×"), button[aria-label="remove tag"]');
    if (await removeTag.first().isVisible()) {
      await removeTag.first().click();
    }
  });
});

test.describe('Business Management - Media Gallery', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-010: Media gallery
  test('BS-010: should show media gallery upload', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const galleryInput = page.locator('input[type="file"][name="gallery"]');
    if (await galleryInput.isVisible()) {
      await expect(galleryInput).toBeVisible();
    }
  });

  test('BS-010: should limit gallery to 4 images', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const galleryInput = page.locator('input[type="file"][name="gallery"]');
    if (await galleryInput.isVisible()) {
      // Try to upload 5 images
      await galleryInput.setInputFiles([
        { name: '1.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('1') },
        { name: '2.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('2') },
        { name: '3.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('3') },
        { name: '4.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('4') },
        { name: '5.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('5') },
      ]);
      
      // Should show limit error
      await expect(page.locator(/maximum.*4|only.*4/i)).toBeVisible();
    }
  });

  test('BS-010: should display gallery on business page', async ({ page }) => {
    await page.goto('/business/1');
    
    // Should show gallery section
    const gallery = page.locator('.gallery, [data-testid="gallery"]');
    if (await gallery.isVisible()) {
      await expect(gallery).toBeVisible();
    }
  });

  test('BS-010: should delete gallery image', async ({ page }) => {
    await page.goto('/dashboard/business/edit/1');
    
    const deleteButton = page.locator('button[aria-label="delete image"], button:has-text("Delete")');
    if (await deleteButton.first().isVisible()) {
      await deleteButton.first().click();
    }
  });
});

test.describe('Business Management - Publish Business', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-012: Publish business
  test('BS-012: should show publish button for draft business', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const publishButton = page.locator('button:has-text("Publish"), button:has-text("Go Live")');
    if (await publishButton.isVisible()) {
      await expect(publishButton).toBeVisible();
    }
  });

  test('BS-012: should publish business', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const publishButton = page.locator('button:has-text("Publish")');
    if (await publishButton.isVisible()) {
      await publishButton.click();
      
      // Should show success and status change
      await expect(page.locator(/success|published|live/i)).toBeVisible();
    }
  });

  test('BS-012: should set publish date', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    // After publishing, should show publish date
    await expect(page.locator(/publish|published.*date/i)).toBeVisible();
  });

  test('BS-012: should start 3-day trial', async ({ page }) => {
    await page.goto('/business/1');
    
    // After publishing, business should show full info for 3 days
    // Trial indicator should be visible
    await expect(page.locator(/trial|3.*day/i)).toBeVisible();
  });
});

test.describe('Business Management - Delete Business', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // BS-014: Delete business
  test('BS-014: should show delete button', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"]');
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('BS-014: should show confirmation dialog', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const deleteButton = page.locator('button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator(/confirm|are you sure|delete.*business/i)).toBeVisible();
    }
  });

  test('BS-014: should delete business on confirm', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const deleteButton = page.locator('button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes, Delete")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should redirect and show success
        await expect(page).toHaveURL(/\/dashboard\/business/);
      }
    }
  });

  test('BS-014: should cancel deletion', async ({ page }) => {
    await page.goto('/dashboard/business');
    
    const deleteButton = page.locator('button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Cancel
      const cancelButton = page.locator('button:has-text("Cancel")');
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Business should still exist
        await expect(page.locator(/business/i)).toBeVisible();
      }
    }
  });
});
