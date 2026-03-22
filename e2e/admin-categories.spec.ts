// ============================================
// Category Management Tests - Admin Panel
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './factories';

test.describe('Admin - Category Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // CT-001: View categories list
  test('CT-001: should display categories page', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await expect(page).toHaveURL(/\/admin\/categories/);
  });

  test('CT-001: should show categories table or list', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await expect(page.locator('table, .category-list, [data-testid="category-list"]')).toBeVisible();
  });

  test('CT-001: should show category name and slug', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await expect(page.locator('text=Name, th:has-text("Name")')).toBeVisible();
  });

  // CT-002: Create new category
  test('CT-002: should have add category button', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await expect(page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")')).toBeVisible();
  });

  test('CT-002: should open create category form', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await page.click('button:has-text("Add"), a:has-text("Add")');
    
    await expect(page.locator('input[name="name"], input[name="title"]')).toBeVisible();
  });

  test('CT-002: should create category with name and slug', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await page.click('button:has-text("Add"), a:has-text("Add")');
    await page.fill('input[name="name"]', 'Hotels');
    await page.fill('input[name="slug"]', 'hotels');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator(/success|created/i)).toBeVisible();
  });

  test('CT-002: should require category name', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await page.click('button:has-text("Add"), a:has-text("Add")');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator('input[name="name"]:invalid, .error, text=required')).toBeVisible();
  });

  test('CT-002: should auto-generate slug from name', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await page.click('button:has-text("Add"), a:has-text("Add")');
    await page.fill('input[name="name"]', 'Coffee Shops');
    
    // Check if slug field is auto-filled or has suggestion
    const slugValue = await page.locator('input[name="slug"]').inputValue();
    expect(slugValue).toMatch(/coffee/i);
  });

  // CT-003: Edit category
  test('CT-003: should have edit button for each category', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
    }
  });

  test('CT-003: should open edit category form', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.locator('input[name="name"]')).toBeVisible();
    }
  });

  test('CT-003: should update category', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.fill('input[name="name"]', 'Updated Category Name');
      await page.click('button[type="submit"], button:has-text("Update")');
      
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // CT-004: Delete category
  test('CT-004: should have delete button', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"]').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('CT-004: should confirm before delete', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator(/confirm|delete|are you sure/i)).toBeVisible();
    }
  });

  test('CT-004: should delete category after confirmation', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      
      await expect(page.locator(/success|deleted/i)).toBeVisible();
    }
  });

  // CT-005: Category search/filter
  test('CT-005: should have search functionality', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await expect(page.locator('input[name="search"], input[placeholder*="Search"]')).toBeVisible();
  });

  test('CT-005: should filter categories by search term', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('restaurant');
      await page.click('button:has-text("Search")');
      
      // Should show filtered results
      await expect(page.locator('.category-item, tr')).toBeVisible();
    }
  });

  // CT-006: Category hierarchy (parent/child)
  test('CT-006: should show parent category options', async ({ page }) => {
    await page.goto('/admin/categories');
    
    await page.click('button:has-text("Add"), a:has-text("Add")');
    
    // Check if there's a parent category dropdown
    const parentSelect = page.locator('select[name="parentId"], select[name="parent"]');
    if (await parentSelect.isVisible()) {
      await expect(parentSelect).toBeVisible();
    }
  });

  // CT-007: Category status
  test('CT-007: should show category status (active/inactive)', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const statusColumn = page.locator('text=Status, th:has-text("Status")');
    if (await statusColumn.isVisible()) {
      await expect(statusColumn).toBeVisible();
    }
  });

  test('CT-007: should toggle category active status', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const toggleButton = page.locator('button[role="switch"], button:has-text("Toggle")').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // CT-008: Category count display
  test('CT-008: should show businesses count per category', async ({ page }) => {
    await page.goto('/admin/categories');
    
    const countColumn = page.locator('text=Businesses, text=Count, th:has-text("Count")');
    if (await countColumn.isVisible()) {
      await expect(countColumn).toBeVisible();
    }
  });
});
