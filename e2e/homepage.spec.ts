import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8788';

test.describe('Homepage Card Hover Fix', () => {
  test.beforeEach(async ({ page }) => {
    // 禁用代理
    await page.context().clearCookies();
  });

  test('should load homepage and check business cards', async () => {
    // 创建自定义浏览器上下文，无代理
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to homepage:', BASE_URL);
    await page.goto(BASE_URL + '/');
    console.log('Page loaded, waiting...');
    await page.waitForLoadState('load');
    
    console.log('Checking page content...');
    const html = await page.content();
    console.log('HTML length:', html.length);
    console.log('Has business-card:', html.includes('business-card'));
    
    // Verify page loaded
    await expect(page).toHaveTitle(/TimorUp/);
    
    // Check business cards exist
    const cards = await page.locator('.business-card').count();
    console.log('Business cards count:', cards);
    expect(cards).toBeGreaterThan(0);
    
    await browser.close();
  });
});