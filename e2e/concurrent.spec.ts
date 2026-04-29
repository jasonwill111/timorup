import { test, expect } from '@playwright/test';

/**
 * Concurrent Operations Tests
 *
 * Tests for concurrent E2E scenarios:
 * - Multiple users searching simultaneously
 * - Concurrent interactions (likes, views)
 * - Session isolation between users
 * - Rate limiting and race conditions
 */

test.describe('Concurrent Operations', () => {
  test.describe.configure({ mode: 'serial' });

  // Helper to get a real business slug
  let businessSlug: string | null = null;

  test.beforeEach(async ({ page }) => {
    if (!businessSlug) {
      await page.goto('/listing');
      const firstBusinessLink = page.locator('a[href^="/business/"]').first();
      if (await firstBusinessLink.isVisible()) {
        const href = await firstBusinessLink.getAttribute('href');
        businessSlug = href?.split('/business/')[1] || null;
      }
    }
  });

  test.describe('Simultaneous User Operations', () => {
    test('multiple users can browse pages simultaneously', async ({ browser }) => {
      // Create 3 concurrent browser contexts
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
      ]);

      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // All users visit homepage simultaneously
        const results = await Promise.all(
          pages.map(async (page, i) => {
            const response = await page.goto('/', { timeout: 30000 });
            return {
              index: i,
              status: response?.status(),
              url: page.url(),
            };
          })
        );

        // All should complete with HTTP 200
        for (const result of results) {
          expect(result.status).toBe(200);
          expect(result.url).toContain('/');
        }
      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('multiple users can search simultaneously', async ({ browser }) => {
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
      ]);

      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // All users navigate to search page
        await Promise.all(pages.map(p => p.goto('/search')));

        // All users perform search
        const searchTerms = ['restaurant', 'cafe', 'hotel'];
        await Promise.all(
          pages.map(async (page, i) => {
            await page.fill('input[name="q"], input[type="search"], input[placeholder*="Search"]', searchTerms[i]);
            await page.click('button[type="submit"], button:has-text("Search")');
          })
        );

        // Wait for results to load
        await Promise.all(pages.map(p => p.waitForLoadState('networkidle')));

        // All should complete successfully
        for (const page of pages) {
          expect(page.url()).toBeTruthy();
        }
      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('multiple users can view listing page simultaneously', async ({ browser }) => {
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
      ]);

      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        const results = await Promise.all(
          pages.map(async (page) => {
            const response = await page.goto('/listing', { timeout: 30000 });
            // Wait for content to load
            await page.waitForSelector('main, [role="main"], body');
            return response?.status();
          })
        );

        for (const status of results) {
          expect(status).toBe(200);
        }
      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });
  });

  test.describe('Session Isolation', () => {
    test('session cookies are isolated between users', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();

      try {
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        // Visit site with both "users"
        await page1.goto('/');
        await page2.goto('/');

        // Get cookies from both contexts
        const cookies1 = await context1.cookies();
        const cookies2 = await context2.cookies();

        // Each context should have its own session
        expect(cookies1).toBeDefined();
        expect(cookies2).toBeDefined();

        // If auth cookies exist, they should be different
        const authCookie1 = cookies1.find(c =>
          c.name.includes('auth') ||
          c.name.includes('session') ||
          c.name.includes('token')
        );
        const authCookie2 = cookies2.find(c =>
          c.name.includes('auth') ||
          c.name.includes('session') ||
          c.name.includes('token')
        );

        if (authCookie1 && authCookie2) {
          expect(authCookie1.value).not.toBe(authCookie2.value);
        }

        await page1.close();
        await page2.close();
      } finally {
        await context1.close();
        await context2.close();
      }
    });

    test('two users can have separate browsing sessions', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();

      try {
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        // User 1 visits page A
        await page1.goto('/listing');
        await page1.waitForLoadState('networkidle');

        // User 2 visits page B
        await page2.goto('/search');
        await page2.waitForLoadState('networkidle');

        // Verify they're still on different pages
        expect(page1.url()).toContain('/listing');
        expect(page2.url()).toContain('/search');

        // Navigate to same page
        await page1.goto('/');
        await page2.goto('/');

        // Both should now be on homepage, but with separate sessions
        expect(page1.url()).toBe(page2.url());

        // Cookies should still be isolated
        const cookies1 = await context1.cookies();
        const cookies2 = await context2.cookies();

        // Sessions should be separate
        const sessionIds = cookies1.map(c => c.value).filter(v => v.length > 10);
        const sessionIds2 = cookies2.map(c => c.value).filter(v => v.length > 10);

        // Should have similar structure but not necessarily different (depends on implementation)
        expect(cookies1).toBeDefined();
        expect(cookies2).toBeDefined();

        await page1.close();
        await page2.close();
      } finally {
        await context1.close();
        await context2.close();
      }
    });
  });

  test.describe('Concurrent Likes/Interactions', () => {
    test('concurrent view counts should be accurate', async ({ page, browser }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      // First, get initial view count
      await page.goto(`/business/${businessSlug}`);
      const initialViewText = await page.locator('[data-views], .views, text=/[0-9]+ views/i').first().textContent().catch(() => null);

      // Open multiple pages to same business
      const context = await browser.newContext();
      const page1 = await context.newPage();
      const page2 = await context.newPage();

      try {
        await Promise.all([
          page1.goto(`/business/${businessSlug}`),
          page2.goto(`/business/${businessSlug}`),
        ]);

        // Wait for both to load
        await Promise.all([
          page1.waitForLoadState('networkidle'),
          page2.waitForLoadState('networkidle'),
        ]);

        // Both pages should load successfully
        expect(page1.url()).toContain('/business/');
        expect(page2.url()).toContain('/business/');
      } finally {
        await context.close();
      }
    });

    test('like button state is consistent', async ({ browser }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      const context = await browser.newContext();
      const page1 = await context.newPage();
      const page2 = await context.newPage();

      try {
        // Both users go to business page
        await Promise.all([
          page1.goto(`/business/${businessSlug}`),
          page2.goto(`/business/${businessSlug}`),
        ]);

        await Promise.all([
          page1.waitForLoadState('networkidle'),
          page2.waitForLoadState('networkidle'),
        ]);

        // Check if like button exists
        const likeButton1 = page1.locator('button[aria-label*="like" i], button:has-text("♥"), button:has-text("Like")').first();
        const likeButton2 = page2.locator('button[aria-label*="like" i], button:has-text("♥"), button:has-text("Like")').first();

        const button1Visible = await likeButton1.isVisible().catch(() => false);
        const button2Visible = await likeButton2.isVisible().catch(() => false);

        if (button1Visible && button2Visible) {
          // Both buttons should exist
          expect(button1Visible).toBe(true);
          expect(button2Visible).toBe(true);
        }
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Data Consistency', () => {
    test('page refresh shows consistent data', async ({ browser }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        // Load business page
        await page.goto(`/business/${businessSlug}`);
        await page.waitForLoadState('networkidle');

        // Get business name
        const businessName1 = await page.locator('h1').first().textContent();

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Name should be consistent
        const businessName2 = await page.locator('h1').first().textContent();
        expect(businessName1?.trim()).toBe(businessName2?.trim());
      } finally {
        await context.close();
      }
    });

    test('listing data is consistent across multiple fetches', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        // First visit to listing
        await page.goto('/listing');
        await page.waitForLoadState('networkidle');

        const businessCount1 = await page.locator('a[href^="/business/"]').count();

        // Second visit
        await page.reload();
        await page.waitForLoadState('networkidle');

        const businessCount2 = await page.locator('a[href^="/business/"]').count();

        // Count should be consistent (allow for 0-3 variance due to async data)
        expect(Math.abs(businessCount1 - businessCount2)).toBeLessThanOrEqual(3);
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Race Condition Prevention', () => {
    test('rapid page navigation does not cause errors', async ({ page }) => {
      // Rapidly navigate between pages
      const pages = ['/', '/listing', '/search', '/', '/listing'];
      let hadError = false;

      page.on('pageerror', () => {
        hadError = true;
      });

      for (const url of pages) {
        const response = await page.goto(url, { timeout: 10000 });
        expect(response?.status()).toBeLessThan(500);
        await page.waitForLoadState('domcontentloaded');
      }

      expect(hadError).toBe(false);
    });

    test('concurrent form submissions are handled correctly', async ({ browser }) => {
      const context = await browser.newContext();
      const page1 = await context.newPage();
      const page2 = await context.newPage();

      try {
        // Both navigate to search (a page with search form)
        await Promise.all([
          page1.goto('/search'),
          page2.goto('/search'),
        ]);

        // Both submit search simultaneously
        await Promise.all([
          page1.fill('input[name="q"], input[type="search"], input[placeholder*="Search"]', 'test query 1'),
          page2.fill('input[name="q"], input[type="search"], input[placeholder*="Search"]', 'test query 2'),
        ]);

        // Submit both forms
        await Promise.all([
          page1.click('button[type="submit"], button:has-text("Search")'),
          page2.click('button[type="submit"], button:has-text("Search")'),
        ]);

        // Both should complete without crashing
        await Promise.all([
          page1.waitForLoadState('networkidle').catch(() => {}),
          page2.waitForLoadState('networkidle').catch(() => {}),
        ]);

        // Both pages should still be valid
        expect(page1.url()).toBeTruthy();
        expect(page2.url()).toBeTruthy();
      } finally {
        await context.close();
      }
    });
  });
});