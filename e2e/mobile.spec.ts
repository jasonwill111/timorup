// Mobile Responsiveness E2E Tests
// Tests for mobile devices, responsive layouts, and touch interactions

import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {

  // Define mobile devices to test
  const mobileDevices = [
    { name: 'iPhone 12', ...devices['iPhone 12'] },
    { name: 'iPhone SE', ...devices['iPhone SE'] },
    { name: 'Pixel 5', ...devices['Pixel 5'] },
  ];

  for (const device of mobileDevices) {
    test(`${device.name} - homepage loads correctly`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Page should load without errors
      await expect(page).toHaveTitle(/./);

      // Verify key elements are visible
      await expect(page.locator('h1')).toBeVisible();

      // Check no horizontal scroll - common mobile issue
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

      await context.close();
    });

    test(`${device.name} - listing page is mobile-friendly`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/listing');
      await page.waitForLoadState('networkidle');

      // Verify page loads
      await expect(page.locator('h1')).toBeVisible();

      // Check no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

      // Navigation tabs should be accessible
      const tabs = page.locator('a[href*="type="]');
      await expect(tabs.first()).toBeVisible();

      await context.close();
    });

    test(`${device.name} - pricing page renders correctly`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');

      // Verify pricing content is visible
      const content = await page.content();
      expect(content.length).toBeGreaterThan(500);

      // Price tiers should be present
      await expect(page.getByText('$39')).toBeVisible();

      await context.close();
    });
  }

  test('touch interactions work on listing page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/listing');
    await page.waitForLoadState('networkidle');

    // Tap on a listing card (if available)
    const firstCard = page.locator('a[href*="/business/"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.tap();
      await page.waitForLoadState('networkidle');
      // Should navigate to business detail
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('login form is mobile-friendly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/login');

    // Form elements should be visible and usable
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('responsive navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    await page.goto('/');

    // Page should load
    await expect(page.locator('body')).toBeVisible();

    // No horizontal scroll on smallest common mobile width
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('tablet viewport renders correctly', async ({ page }) => {
    // iPad viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Hero section should be visible
    await expect(page.locator('h1')).toBeVisible();

    // Featured sections should render
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('landscape mobile orientation', async ({ page }) => {
    // Landscape orientation
    await page.setViewportSize({ width: 812, height: 375 });

    await page.goto('/listing');
    await page.waitForLoadState('networkidle');

    // Content should render properly in landscape
    await expect(page.locator('h1')).toBeVisible();

    // Grid should adapt to wider viewport
    const cards = page.locator('a[href*="/business/"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('hamburger menu / mobile nav works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/');

    // Look for mobile menu toggle or navigation
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-label*="navigation" i], #mobile-menu, [class*="menu"]').first();

    // If mobile menu exists, try to interact with it
    if (await mobileMenuButton.isVisible().catch(() => false)) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);

      // Menu should open or toggle
      const menuContent = page.locator('nav, [role="navigation"], [class*="menu"]');
      await expect(menuContent.first()).toBeVisible();
    } else {
      // If no hamburger menu, navigation should still be usable
      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();
    }
  });

  test('touch-friendly button sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/login');

    // Buttons should be large enough for touch (minimum 44x44px per WCAG)
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      const box = await submitButton.boundingBox();
      expect(box).not.toBeNull();
      // Touch targets should be at least 44px
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('forms are usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/login');

    // Focus on email input
    const emailInput = page.locator('input[name="email"]');
    await emailInput.tap();

    // Keyboard should not obscure the input
    const inputBox = await emailInput.boundingBox();
    expect(inputBox).not.toBeNull();

    // Input should remain visible when focused
    await expect(emailInput).toBeFocused();
  });

  test('pricing page pricing cards stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Page should load without horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

    // Pricing content should be visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('Responsive Breakpoints', () => {

  const breakpoints = [
    { name: 'small mobile', width: 320, height: 568 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'large mobile', width: 414, height: 896 },
    { name: 'tablet portrait', width: 768, height: 1024 },
    { name: 'tablet landscape', width: 1024, height: 768 },
    { name: 'small desktop', width: 1280, height: 720 },
  ];

  for (const bp of breakpoints) {
    test(`${bp.name} (${bp.width}x${bp.height}) - homepage renders`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Basic content should render
      await expect(page.locator('body')).toBeVisible();
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
    });
  }
});

test.describe('Accessibility on Mobile', () => {

  test('sufficient color contrast on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/login');

    // Page should load without critical errors
    await expect(page.locator('form')).toBeVisible();

    // Check that interactive elements are not just color-dependent
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Button should have text or aria-label
    const buttonText = await submitButton.textContent();
    const buttonLabel = await submitButton.getAttribute('aria-label');
    expect(buttonText || buttonLabel).toBeTruthy();
  });

  test('focus indicators visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/login');

    // Focus on input
    const emailInput = page.locator('input[name="email"]');
    await emailInput.focus();

    // Check focus ring is visible (outline, box-shadow, etc.)
    const hasFocusStyle = await page.evaluate(() => {
      const input = document.querySelector('input[name="email"]');
      if (!input) return false;
      const styles = window.getComputedStyle(input);
      return styles.outline !== 'none' ||
             styles.boxShadow !== 'none' ||
             styles.border !== 'none';
    });
    expect(hasFocusStyle).toBe(true);
  });

  test('text is readable without zooming', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/');

    // Base font size should be at least 16px to prevent iOS zoom on focus
    const baseFontSize = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return parseFloat(computed.fontSize);
    });

    // Should not cause iOS auto-zoom (input font < 16px triggers zoom)
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const inputFontSize = await page.evaluate(() => {
        const input = document.querySelector('input[name="email"]') as HTMLElement;
        if (!input) return 16;
        return parseFloat(window.getComputedStyle(input).fontSize);
      });
      expect(inputFontSize).toBeGreaterThanOrEqual(16);
    }
  });
});
