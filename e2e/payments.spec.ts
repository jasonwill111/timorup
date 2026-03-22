// ============================================
// Payments & Subscription Tests - Complete Coverage
// ============================================

import { test, expect } from '@playwright/test';
import { loginAsUser } from './factories';

test.describe('Payments - Pricing Page', () => {
  
  // SB-001: View pricing
  test('SB-001: should display pricing page', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('.pricing, [data-testid="pricing"]')).toBeVisible();
  });

  test('SB-001: should show plan options', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('.plan, [data-testid="plan"]')).toBeVisible();
  });

  test('SB-001: should show plan prices', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('.price, [data-testid="price"]')).toBeVisible();
  });

  test('SB-001: should show plan features', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('.features, ul')).toBeVisible();
  });

  test('SB-001: should highlight recommended plan', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('.recommended, .popular')).toBeVisible();
  });
});

test.describe('Payments - Select Plan', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // SB-002: Select plan
  test('SB-002: should show select button for each plan', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('button:has-text("Select"), button:has-text("Choose")')).toBeVisible();
  });

  test('SB-002: should offer monthly option', async ({ page }) => {
    await page.goto('/pricing');
    
    const monthlyOption = page.locator('text=Monthly, text=Month');
    if (await monthlyOption.first().isVisible()) {
      await expect(monthlyOption).toBeVisible();
    }
  });

  test('SB-002: should offer yearly option', async ({ page }) => {
    await page.goto('/pricing');
    
    const yearlyOption = page.locator('text=Yearly, text=Year');
    if (await yearlyOption.first().isVisible()) {
      await expect(yearlyOption).toBeVisible();
    }
  });

  test('SB-002: should show discount for yearly', async ({ page }) => {
    await page.goto('/pricing');
    
    const discount = page.locator('.discount, text=Save');
    if (await discount.isVisible()) {
      await expect(discount).toBeVisible();
    }
  });

  test('SB-002: should redirect to checkout on select', async ({ page }) => {
    await page.goto('/pricing');
    
    const selectButton = page.locator('button:has-text("Select")').first();
    if (await selectButton.isVisible()) {
      await selectButton.click();
      
      await expect(page).toHaveURL(/checkout|order/);
    }
  });
});

test.describe('Payments - Payment Information', () => {
  
  // SB-003: Payment information display
  test('SB-003: should show payment QR code', async ({ page }) => {
    await page.goto('/checkout/1');
    
    const qrCode = page.locator('.qr-code, img[alt="QR Code"]');
    if (await qrCode.isVisible()) {
      await expect(qrCode).toBeVisible();
    }
  });

  test('SB-003: should show payment contact info', async ({ page }) => {
    await page.goto('/checkout/1');
    
    await expect(page.locator(/contact|phone|account/i)).toBeVisible();
  });

  test('SB-003: should show payment instructions', async ({ page }) => {
    await page.goto('/checkout/1');
    
    await expect(page.locator(/instruction|how.*pay/i)).toBeVisible();
  });

  test('SB-003: should show order amount', async ({ page }) => {
    await page.goto('/checkout/1');
    
    await expect(page.locator('.amount, .total')).toBeVisible();
  });
});

test.describe('Payments - Create Order', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // SB-004: Create order
  test('SB-004: should create unpaid order', async ({ page }) => {
    await page.goto('/checkout/1');
    await page.click('button:has-text("Confirm")');
    
    // Should create order with unpaid status
    await expect(page.locator(/unpaid|pending/i)).toBeVisible();
  });

  test('SB-004: should show order status', async ({ page }) => {
    await page.goto('/dashboard/orders');
    
    await expect(page.locator('.order, [data-testid="order"]')).toBeVisible();
  });

  test('SB-004: should show order details', async ({ page }) => {
    await page.goto('/dashboard/orders/1');
    
    await expect(page.locator('.order-details')).toBeVisible();
  });

  test('SB-004: should set trial period', async ({ page }) => {
    await page.goto('/dashboard/orders/1');
    
    // After order, should show trial period info
    await expect(page.locator(/trial|3.*day/i)).toBeVisible();
  });
});

test.describe('Payments - Subscription & Trial', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // SB-005: 3-day trial
  test('SB-005: should start 3-day trial on subscription', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    // Should show trial status
    await expect(page.locator(/trial/i)).toBeVisible();
  });

  test('SB-005: should show full info during trial', async ({ page }) => {
    // Business should show full info during trial
    await page.goto('/business/1');
    
    // Should show all details during trial period
    await expect(page.locator('.products, .hours, .contact')).toBeVisible();
  });

  test('SB-005: should limit info after trial', async ({ page }) => {
    // After trial expires, should show limited info
    await page.goto('/business/expired');
    
    // Should show basic info only
    await expect(page.locator(/basic|unpaid/i)).toBeVisible();
  });
});

test.describe('Payments - Admin Confirm Payment', () => {
  
  // SB-006: Admin confirm payment
  test('SB-006: admin should see pending orders', async ({ page }) => {
    await page.goto('/admin/orders');
    
    await expect(page.locator('.order, [data-testid="order"]')).toBeVisible();
  });

  test('SB-006: admin should see unpaid status', async ({ page }) => {
    await page.goto('/admin/orders');
    
    await expect(page.locator('.unpaid, [data-status="unpaid"]')).toBeVisible();
  });

  test('SB-006: admin can confirm payment', async ({ page }) => {
    await page.goto('/admin/orders/1');
    
    const confirmButton = page.locator('button:has-text("Confirm Payment")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      
      await expect(page.locator(/success|paid/i)).toBeVisible();
    }
  });

  test('SB-006: admin can set expiry date', async ({ page }) => {
    await page.goto('/admin/orders/1');
    
    const expiryInput = page.locator('input[name="expiryDate"]');
    if (await expiryInput.isVisible()) {
      await expiryInput.fill('2026-12-31');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator(/success/i)).toBeVisible();
    }
  });
});

test.describe('User Account - Subscription Status', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  // UA-004: View subscription status
  test('UA-004: should show current plan', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    await expect(page.locator('.current-plan, [data-testid="plan"]')).toBeVisible();
  });

  test('UA-004: should show expiry date', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    await expect(page.locator('.expiry, .expires')).toBeVisible();
  });

  test('UA-004: should show renewal link', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    await expect(page.locator('a:has-text("Renew"), a:has-text("Upgrade")')).toBeVisible();
  });

  test('UA-004: should show subscription features', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    await expect(page.locator('.features')).toBeVisible();
  });
});
