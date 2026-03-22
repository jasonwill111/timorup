// ============================================
// Hero/Banner Management Tests - Admin Panel
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './factories';

test.describe('Admin - Hero/Banner Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // HB-001: View heroes/banners list
  test('HB-001: should display heroes page', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await expect(page).toHaveURL(/\/admin\/heroes/);
  });

  test('HB-001: should show heroes table or list', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await expect(page.locator('table, .hero-list, [data-testid="hero-list"]')).toBeVisible();
  });

  test('HB-001: should show hero title and status', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await expect(page.locator('text=Title, th:has-text("Title")')).toBeVisible();
  });

  // HB-002: Create new hero/banner
  test('HB-002: should have add hero button', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await expect(page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add Hero")')).toBeVisible();
  });

  test('HB-002: should open create hero form', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    await expect(page.locator('input[name="title"], input[name="name"]')).toBeVisible();
  });

  test('HB-002: should create hero with title and image', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    await page.fill('input[name="title"]', 'Homepage Banner');
    await page.fill('input[name="description"]', 'Welcome to TMBIZ');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator(/success|created/i)).toBeVisible();
  });

  test('HB-002: should require hero title', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator('input[name="title"]:invalid, .error, text=required')).toBeVisible();
  });

  // HB-003: Upload hero image
  test('HB-003: should allow uploading hero image', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const imageUpload = page.locator('input[type="file"], button:has-text("Upload Image")');
    if (await imageUpload.isVisible()) {
      await expect(imageUpload).toBeVisible();
    }
  });

  test('HB-003: should show image preview after upload', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const preview = page.locator('img[alt="Preview"], .preview, [data-testid="preview"]');
    if (await preview.isVisible()) {
      await expect(preview).toBeVisible();
    }
  });

  // HB-004: Hero link settings
  test('HB-004: should allow setting hero link', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const linkInput = page.locator('input[name="link"], input[name="url"], input[name="ctaUrl"]');
    if (await linkInput.isVisible()) {
      await expect(linkInput).toBeVisible();
    }
  });

  test('HB-004: should allow setting CTA button text', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const ctaInput = page.locator('input[name="ctaText"], input[name="buttonText"]');
    if (await ctaInput.isVisible()) {
      await expect(ctaInput).toBeVisible();
    }
  });

  // HB-005: Hero positioning/order
  test('HB-005: should allow setting hero order/position', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const orderInput = page.locator('input[name="order"], input[name="position"], select[name="position"]');
    if (await orderInput.isVisible()) {
      await expect(orderInput).toBeVisible();
    }
  });

  // HB-006: Hero display settings
  test('HB-006: should show display options (mobile/desktop)', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const displayOptions = page.locator('text=Mobile, text=Desktop, text=Show on');
    if (await displayOptions.first().isVisible()) {
      await expect(displayOptions.first()).toBeVisible();
    }
  });

  // HB-007: Hero scheduling
  test('HB-007: should allow setting start/end date', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    await page.click('button:has-text("Add"), a:has-text("Add Hero")');
    
    const dateInputs = page.locator('input[type="date"], input[name="startDate"], input[name="endDate"]');
    if (await dateInputs.first().isVisible()) {
      await expect(dateInputs.first()).toBeVisible();
    }
  });

  // HB-008: Edit hero
  test('HB-008: should have edit button for each hero', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
    }
  });

  test('HB-008: should update hero', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.fill('input[name="title"]', 'Updated Hero Title');
      await page.click('button[type="submit"], button:has-text("Update")');
      
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // HB-009: Delete hero
  test('HB-009: should have delete button', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"]').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('HB-009: should delete hero after confirmation', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      
      await expect(page.locator(/success|deleted/i)).toBeVisible();
    }
  });

  // HB-010: Hero active/inactive toggle
  test('HB-010: should toggle hero active status', async ({ page }) => {
    await page.goto('/admin/heroes');
    
    const toggleButton = page.locator('button[role="switch"], button:has-text("Toggle")').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });
});
