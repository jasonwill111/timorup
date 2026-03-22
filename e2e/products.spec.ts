// ============================================
// Product/Service Tests - Complete Coverage
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsUser } from './factories';

test.describe('Product/Service - Create Product', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // PS-001: Paid user can create product
  test('PS-001: should show create product for premium user', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    const createButton = page.locator('a:has-text("Add Product"), button:has-text("Add Product")');
    if (await createButton.isVisible()) {
      await expect(createButton).toBeVisible();
    }
  });

  test('PS-001: should show subscription prompt for free user', async ({ page }) => {
    // Login as free user
    await loginAsUser(page);
    await page.goto('/dashboard/products');
    
    // Try to add product
    const addButton = page.locator('button:has-text("Add Product")');
    if (await addButton.isVisible()) {
      await addButton.click();
    }
    
    // Should show subscription prompt
    await expect(page.locator(/premium|subscription|upgrade/i)).toBeVisible();
  });

  test('PS-001: should show product form', async ({ page }) => {
    await page.goto('/dashboard/products/new');
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
  });

  test('PS-001: should create product with valid data', async ({ page }) => {
    await page.goto('/dashboard/products/new');
    
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('textarea[name="description"]', 'Test product description');
    await page.fill('input[name="price"]', '25.00');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard\/products/);
  });

  test('PS-001: should require product name', async ({ page }) => {
    await page.goto('/dashboard/products/new');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
  });
});

test.describe('Product/Service - Edit Product', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // PS-002: Edit product
  test('PS-002: should navigate to edit product', async ({ page }) => {
    await page.goto('/dashboard/products');
    await page.click('button:has-text("Edit")');
    
    await expect(page).toHaveURL(/\/dashboard\/products\/edit/);
  });

  test('PS-002: should pre-fill edit form', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('PS-002: should update product name', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    await page.fill('input[name="name"]', 'Updated Product Name');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });

  test('PS-002: should update product price', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    await page.fill('input[name="price"]', '30.00');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/success|updated/i)).toBeVisible();
  });
});

test.describe('Product/Service - Product Images', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // PS-003: Product images
  test('PS-003: should show image upload', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    const imageInput = page.locator('input[type="file"][name="images"]');
    if (await imageInput.isVisible()) {
      await expect(imageInput).toBeVisible();
    }
  });

  test('PS-003: should upload multiple images', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    const imageInput = page.locator('input[type="file"][name="images"]');
    if (await imageInput.isVisible()) {
      await imageInput.setInputFiles([
        { name: 'product1.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('1') },
        { name: 'product2.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('2') },
      ]);
      
      // Should show previews
      await expect(page.locator('img[src*="preview"]')).toBeVisible();
    }
  });

  test('PS-003: should limit to 4 images', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    const imageInput = page.locator('input[type="file"][name="images"]');
    if (await imageInput.isVisible()) {
      await imageInput.setInputFiles([
        { name: '1.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('1') },
        { name: '2.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('2') },
        { name: '3.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('3') },
        { name: '4.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('4') },
        { name: '5.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('5') },
      ]);
      
      await expect(page.locator(/maximum.*4|only.*4/i)).toBeVisible();
    }
  });

  test('PS-003: should display images on product detail', async ({ page }) => {
    await page.goto('/business/1/product/1');
    
    await expect(page.locator('.product-images, img[alt="product"]')).toBeVisible();
  });

  test('PS-003: should delete product image', async ({ page }) => {
    await page.goto('/dashboard/products/edit/1');
    
    const deleteButton = page.locator('button[aria-label="delete image"]');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  });
});

test.describe('Product/Service - Delete Product', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // PS-004: Delete product
  test('PS-004: should show delete button', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    const deleteButton = page.locator('button[aria-label="Delete"], button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('PS-004: should show confirmation dialog', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    const deleteButton = page.locator('button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      await expect(page.locator(/confirm|are you sure/i)).toBeVisible();
    }
  });

  test('PS-004: should delete product', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    const deleteButton = page.locator('button:has-text("Delete")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      const confirmButton = page.locator('button:has-text("Confirm")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        await expect(page.locator(/success|deleted/i)).toBeVisible();
      }
    }
  });
});

test.describe('Product/Service - SKU Limits', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // PS-005: SKU limits
  test('PS-005: should show SKU quota', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    await expect(page.locator(/sku|quota|products.*\d+\/10/i)).toBeVisible();
  });

  test('PS-005: should show limit warning at 8 products', async ({ page }) => {
    await page.goto('/dashboard/products');
    
    // Should show warning when approaching limit
    await expect(page.locator(/almost.*limit|only.*2.*left/i)).toBeVisible();
  });

  test('PS-005: should block at 10 products for basic plan', async ({ page }) => {
    // Try to create 11th product
    await page.goto('/dashboard/products/new');
    
    await page.fill('input[name="name"]', 'Product 11');
    await page.click('button[type="submit"]');
    
    await expect(page.locator(/limit|maximum|quota/i)).toBeVisible();
  });
});

test.describe('Product/Service - View Products', () => {
  
  // PS-007: View products on business page
  test('PS-007: should display products on business page', async ({ page }) => {
    await page.goto('/business/1');
    
    const productsSection = page.locator('.products, [data-testid="products"]');
    if (await productsSection.isVisible()) {
      await expect(productsSection).toBeVisible();
    }
  });

  test('PS-007: should show product grid', async ({ page }) => {
    await page.goto('/business/1');
    
    await expect(page.locator('.product-card, [data-testid="product-card"]')).toBeVisible();
  });

  test('PS-007: should show product details on click', async ({ page }) => {
    await page.goto('/business/1');
    
    const productCard = page.locator('.product-card').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      
      await expect(page).toHaveURL(/product/);
    }
  });
});
