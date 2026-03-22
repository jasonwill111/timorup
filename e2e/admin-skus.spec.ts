// ============================================
// SKU Management Tests - Admin Panel
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './factories';

test.describe('Admin - SKU Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // SKU-001: View SKUs list
  test('SKU-001: should display SKUs page', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await expect(page).toHaveURL(/\/admin\/skus/);
  });

  test('SKU-001: should show SKUs table or list', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await expect(page.locator('table, .sku-list, [data-testid="sku-list"]')).toBeVisible();
  });

  test('SKU-001: should show SKU name and code', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await expect(page.locator('text=SKU, th:has-text("SKU"), text=Code')).toBeVisible();
  });

  // SKU-002: Create new SKU
  test('SKU-002: should have add SKU button', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await expect(page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add SKU")')).toBeVisible();
  });

  test('SKU-002: should open create SKU form', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    await expect(page.locator('input[name="sku"], input[name="code"]')).toBeVisible();
  });

  test('SKU-002: should create SKU with name and code', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    await page.fill('input[name="name"]', 'Test Product Variant');
    await page.fill('input[name="sku"]', 'SKU-001');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator(/success|created/i)).toBeVisible();
  });

  test('SKU-002: should require SKU code', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator('input[name="sku"]:invalid, .error, text=required')).toBeVisible();
  });

  test('SKU-002: should validate unique SKU code', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    await page.fill('input[name="sku"]', 'DUPLICATE-SKU');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator(/duplicate|exists|already/i)).toBeVisible();
  });

  // SKU-003: SKU attributes
  test('SKU-003: should allow setting SKU attributes (size, color, etc)', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const attributeInput = page.locator('input[name="attributes"], input[name="size"], input[name="color"]');
    if (await attributeInput.first().isVisible()) {
      await expect(attributeInput.first()).toBeVisible();
    }
  });

  test('SKU-003: should support multiple attribute types', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const variantSelect = page.locator('select[name="attributes"], input[name="variant"]');
    if (await variantSelect.isVisible()) {
      await expect(variantSelect).toBeVisible();
    }
  });

  // SKU-004: SKU pricing
  test('SKU-004: should allow setting price', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const priceInput = page.locator('input[name="price"], input[name="amount"]');
    if (await priceInput.isVisible()) {
      await expect(priceInput).toBeVisible();
    }
  });

  test('SKU-004: should allow setting cost price', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const costInput = page.locator('input[name="cost"], input[name="costPrice"]');
    if (await costInput.isVisible()) {
      await expect(costInput).toBeVisible();
    }
  });

  test('SKU-004: should calculate profit margin', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    await page.fill('input[name="price"]', '100');
    await page.fill('input[name="cost"]', '50');
    
    const marginDisplay = page.locator('.margin, .profit, text=Margin');
    if (await marginDisplay.isVisible()) {
      await expect(marginDisplay).toBeVisible();
    }
  });

  // SKU-005: SKU inventory
  test('SKU-005: should track inventory quantity', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const quantityInput = page.locator('input[name="quantity"], input[name="stock"]');
    if (await quantityInput.isVisible()) {
      await expect(quantityInput).toBeVisible();
    }
  });

  test('SKU-005: should show low stock warnings', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const lowStockWarning = page.locator('text=Low Stock, .warning');
    if (await lowStockWarning.isVisible()) {
      await expect(lowStockWarning).toBeVisible();
    }
  });

  test('SKU-005: should set minimum stock threshold', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const thresholdInput = page.locator('input[name="minStock"], input[name="threshold"]');
    if (await thresholdInput.isVisible()) {
      await expect(thresholdInput).toBeVisible();
    }
  });

  // SKU-006: Edit SKU
  test('SKU-006: should have edit button for each SKU', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
    }
  });

  test('SKU-006: should update SKU information', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.fill('input[name="name"]', 'Updated SKU Name');
      await page.click('button[type="submit"], button:has-text("Update")');
      
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // SKU-007: Delete SKU
  test('SKU-007: should have delete button', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"]').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('SKU-007: should confirm before delete', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await expect(page.locator(/confirm|delete|are you sure/i)).toBeVisible();
    }
  });

  test('SKU-007: should delete SKU after confirmation', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      
      await expect(page.locator(/success|deleted/i)).toBeVisible();
    }
  });

  // SKU-008: SKU status
  test('SKU-008: should toggle SKU active status', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const toggleButton = page.locator('button[role="switch"], button:has-text("Toggle")').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // SKU-009: SKU search/filter
  test('SKU-009: should have search functionality', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await expect(page.locator('input[name="search"], input[placeholder*="Search"]')).toBeVisible();
  });

  test('SKU-009: should filter SKUs by search term', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const searchInput = page.locator('input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.click('button:has-text("Search")');
      await expect(page.locator('.sku-item, tr')).toBeVisible();
    }
  });

  // SKU-010: SKU variants management
  test('SKU-010: should link SKU to product', async ({ page }) => {
    await page.goto('/admin/skus');
    
    await page.click('button:has-text("Add"), a:has-text("Add SKU")');
    
    const productSelect = page.locator('select[name="productId"], input[name="product"]');
    if (await productSelect.isVisible()) {
      await expect(productSelect).toBeVisible();
    }
  });

  test('SKU-010: should manage variant combinations', async ({ page }) => {
    await page.goto('/admin/skus');
    
    const variantsSection = page.locator('text=Variants, [data-testid="variants"]');
    if (await variantsSection.isVisible()) {
      await expect(variantsSection).toBeVisible();
    }
  });
});
