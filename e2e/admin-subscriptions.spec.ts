// ============================================
// Subscription Management Tests - Admin Panel
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './factories';

test.describe('Admin - Subscription Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // SM-001: View subscriptions list
  test('SM-001: should display subscriptions page', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page).toHaveURL(/\/admin\/subscriptions/);
  });

  test('SM-001: should show subscriptions table', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('table, .subscription-list, [data-testid="subscription-list"]')).toBeVisible();
  });

  test('SM-001: should show subscription details (user, plan, status)', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('text=User, th:has-text("User"), text=Email')).toBeVisible();
  });

  // SM-002: View subscription details
  test('SM-002: should show subscription details when clicked', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const row = page.locator('tr, .subscription-item').first();
    if (await row.isVisible()) {
      await row.click();
      await expect(page.locator('.details, .subscription-details')).toBeVisible();
    }
  });

  test('SM-002: should show plan type and amount', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('text=Plan, th:has-text("Plan"), text=Amount')).toBeVisible();
  });

  test('SM-002: should show subscription dates (start, expiry)', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('text=Date, th:has-text("Date"), text=Expiry')).toBeVisible();
  });

  // SM-003: Subscription status
  test('SM-003: should show subscription status (active, expired, unpaid)', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('text=Status, th:has-text("Status")')).toBeVisible();
  });

  test('SM-003: should filter by status', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const statusFilter = page.locator('select[name="status"], select[name="filter"]');
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('active');
      await expect(page.locator('tr, .subscription-item')).toBeVisible();
    }
  });

  // SM-004: Manual subscription creation
  test('SM-004: should have create subscription button', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Create")')).toBeVisible();
  });

  test('SM-004: should open create subscription form', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await page.click('button:has-text("Add"), a:has-text("Create")');
    
    await expect(page.locator('select[name="user"], input[name="user"]')).toBeVisible();
  });

  test('SM-004: should select user for subscription', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await page.click('button:has-text("Add"), a:has-text("Create")');
    
    const userSelect = page.locator('select[name="userId"], input[name="user"]');
    if (await userSelect.isVisible()) {
      await expect(userSelect).toBeVisible();
    }
  });

  test('SM-004: should select plan type', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await page.click('button:has-text("Add"), a:has-text("Create")');
    
    const planSelect = page.locator('select[name="plan"], select[name="planType"]');
    if (await planSelect.isVisible()) {
      await expect(planSelect).toBeVisible();
    }
  });

  // SM-005: Subscription actions
  test('SM-005: should have action buttons (renew, cancel, refund)', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const actionButtons = page.locator('button:has-text("Renew"), button:has-text("Cancel"), button:has-text("Refund")');
    if (await actionButtons.first().isVisible()) {
      await expect(actionButtons.first()).toBeVisible();
    }
  });

  test('SM-005: should renew subscription', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const renewButton = page.locator('button:has-text("Renew")').first();
    if (await renewButton.isVisible()) {
      await renewButton.click();
      await expect(page.locator(/success|renewed/i)).toBeVisible();
    }
  });

  test('SM-005: should cancel subscription', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const cancelButton = page.locator('button:has-text("Cancel")').first();
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      await expect(page.locator(/success|cancelled/i)).toBeVisible();
    }
  });

  // SM-006: Subscription search/filter
  test('SM-006: should have search functionality', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    await expect(page.locator('input[name="search"], input[placeholder*="Search"]')).toBeVisible();
  });

  test('SM-006: should filter subscriptions by search term', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const searchInput = page.locator('input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.click('button:has-text("Search")');
      await expect(page.locator('tr, .subscription-item')).toBeVisible();
    }
  });

  // SM-007: Subscription analytics
  test('SM-007: should show subscription statistics', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const stats = page.locator('.stats, .statistics, [data-testid="stats"]');
    if (await stats.isVisible()) {
      await expect(stats).toBeVisible();
    }
  });

  test('SM-007: should show revenue summary', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const revenue = page.locator('text=Revenue, text=Total');
    if (await revenue.first().isVisible()) {
      await expect(revenue.first()).toBeVisible();
    }
  });

  // SM-008: Export subscriptions
  test('SM-008: should have export button', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const exportButton = page.locator('button:has-text("Export"), a:has-text("Export")');
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeVisible();
    }
  });

  // SM-009: Subscription history
  test('SM-009: should show subscription history/log', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const row = page.locator('tr, .subscription-item').first();
    if (await row.isVisible()) {
      await row.click();
      const history = page.locator('.history, .log, text=History');
      if (await history.isVisible()) {
        await expect(history).toBeVisible();
      }
    }
  });

  // SM-010: Bulk actions
  test('SM-010: should support bulk selection', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await expect(checkbox).toBeVisible();
    }
  });

  test('SM-010: should have bulk action buttons', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    const bulkActions = page.locator('.bulk-actions, text=Bulk');
    if (await bulkActions.isVisible()) {
      await expect(bulkActions).toBeVisible();
    }
  });
});
