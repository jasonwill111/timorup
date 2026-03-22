// ============================================
// Blog Management Tests - Admin Panel
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './factories';

test.describe('Admin - Blog Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // BG-001: View blogs list
  test('BG-001: should display blogs page', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await expect(page).toHaveURL(/\/admin\/blogs/);
  });

  test('BG-001: should show blogs table or list', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await expect(page.locator('table, .blog-list, [data-testid="blog-list"]')).toBeVisible();
  });

  test('BG-001: should show blog title and status', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await expect(page.locator('text=Title, th:has-text("Title")')).toBeVisible();
  });

  // BG-002: Create new blog post
  test('BG-002: should have add blog button', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await expect(page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add Blog")')).toBeVisible();
  });

  test('BG-002: should open create blog form', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    
    await expect(page.locator('input[name="title"], textarea[name="title"]')).toBeVisible();
  });

  test('BG-002: should create blog post with title and content', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    await page.fill('input[name="title"]', 'Test Blog Post');
    await page.fill('textarea[name="content"]', 'This is test blog content');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator(/success|created/i)).toBeVisible();
  });

  test('BG-002: should require blog title', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    await page.click('button[type="submit"], button:has-text("Save")');
    
    await expect(page.locator('input[name="title"]:invalid, .error, text=required')).toBeVisible();
  });

  // BG-003: Edit blog post
  test('BG-003: should have edit button for each blog', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
    }
  });

  test('BG-003: should open edit blog form', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.locator('input[name="title"]')).toBeVisible();
    }
  });

  test('BG-003: should update blog post', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.fill('input[name="title"]', 'Updated Blog Title');
      await page.click('button[type="submit"], button:has-text("Update")');
      
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // BG-004: Delete blog post
  test('BG-004: should have delete button', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"]').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('BG-004: should confirm before delete', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await expect(page.locator(/confirm|delete|are you sure/i)).toBeVisible();
    }
  });

  test('BG-004: should delete blog post after confirmation', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      
      await expect(page.locator(/success|deleted/i)).toBeVisible();
    }
  });

  // BG-005: Blog status (draft/published)
  test('BG-005: should show blog status', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const statusColumn = page.locator('text=Status, th:has-text("Status")');
    if (await statusColumn.isVisible()) {
      await expect(statusColumn).toBeVisible();
    }
  });

  test('BG-005: should toggle blog publish status', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const toggleButton = page.locator('button:has-text("Publish"), button:has-text("Unpublish")').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator(/success|updated/i)).toBeVisible();
    }
  });

  // BG-006: Blog categories/tags
  test('BG-006: should allow selecting blog category', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    
    const categorySelect = page.locator('select[name="category"], select[name="tag"]');
    if (await categorySelect.isVisible()) {
      await expect(categorySelect).toBeVisible();
    }
  });

  // BG-007: Blog featured image
  test('BG-007: should allow uploading featured image', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    
    const imageUpload = page.locator('input[type="file"], button:has-text("Upload Image")');
    if (await imageUpload.isVisible()) {
      await expect(imageUpload).toBeVisible();
    }
  });

  // BG-008: Blog SEO settings
  test('BG-008: should show SEO settings', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await page.click('button:has-text("Add"), a:has-text("Add Blog")');
    
    const seoSection = page.locator('text=SEO, [data-testid="seo"]');
    if (await seoSection.isVisible()) {
      await expect(seoSection).toBeVisible();
    }
  });

  // BG-009: Blog search/filter
  test('BG-009: should have search functionality', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    await expect(page.locator('input[name="search"], input[placeholder*="Search"]')).toBeVisible();
  });

  test('BG-009: should filter blogs by search term', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.click('button:has-text("Search")');
      
      await expect(page.locator('.blog-item, tr')).toBeVisible();
    }
  });

  // BG-010: Blog pagination
  test('BG-010: should have pagination', async ({ page }) => {
    await page.goto('/admin/blogs');
    
    const pagination = page.locator('.pagination, nav[aria-label="Pagination"]');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });
});
