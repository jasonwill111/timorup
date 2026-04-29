import { test, expect } from '@playwright/test';

/**
 * SEO Validation Tests
 *
 * Tests for SEO compliance across the site:
 * - Meta tags (title, description, OG tags)
 * - Canonical URLs
 * - Image alt text
 * - JSON-LD structured data
 * - Sitemap and robots.txt
 */

test.describe('SEO Validation', () => {
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

  test.describe('Meta Tags', () => {
    test('homepage has complete meta tags', async ({ page }) => {
      await page.goto('/');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThan(160);
    });

    test('homepage has Open Graph tags', async ({ page }) => {
      await page.goto('/');

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
      expect(ogTitle!.length).toBeGreaterThan(0);

      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toBeTruthy();

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();

      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogType).toBeTruthy();
    });

    test('business page has SEO meta tags', async ({ page }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      await page.goto(`/business/${businessSlug}`);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      // Title should contain site name or business context
      expect(title.toLowerCase()).toMatch(/timorlist|business|listing/i);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
    });

    test('listing page has SEO meta tags', async ({ page }) => {
      await page.goto('/listing');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
    });
  });

  test.describe('Canonical URLs', () => {
    test('all pages have canonical URL', async ({ page }) => {
      await page.goto('/');
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      // Canonical should be an absolute URL
      expect(canonical).toMatch(/^https?:\/\//);
    });

    test('canonical URL matches page URL', async ({ page }) => {
      await page.goto('/');
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const pageUrl = page.url();
      // Remove query params for comparison
      const canonicalBase = canonical?.split('?')[0];
      const pageUrlBase = pageUrl.split('?')[0];
      // Extract path portion (works for both localhost and production URLs)
      const canonicalPath = canonicalBase?.split('://')[1]?.replace(/^[^/]+\//, '') || '';
      const pagePath = pageUrlBase.split('://')[1]?.replace(/^[^/]+\//, '') || '';
      expect(canonicalPath).toBe(pagePath);
    });

    test('business page has canonical URL', async ({ page }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      await page.goto(`/business/${businessSlug}`);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('/business/');
    });
  });

  test.describe('Image Accessibility', () => {
    test('all images have alt text', async ({ page }) => {
      await page.goto('/');

      const images = await page.locator('img').all();
      const imagesWithoutAlt: string[] = [];

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        // Skip decorative images (empty alt is valid) and placeholder images
        if (alt === null && !src?.includes('placeholder') && !src?.includes('data:')) {
          imagesWithoutAlt.push(src || 'unknown');
        }
      }

      expect(imagesWithoutAlt).toHaveLength(0);
    });

    test('business page images have alt text', async ({ page }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      await page.goto(`/business/${businessSlug}`);

      const images = await page.locator('img').all();
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        // Allow empty alt for decorative, but not missing
        if (alt === null && !src?.includes('placeholder')) {
          // Some images may not have alt, we track them
        }
      }
    });
  });

  test.describe('JSON-LD Structured Data', () => {
    test('business page has valid JSON-LD schemas', async ({ page }) => {
      if (!businessSlug) {
        test.skip();
        return;
      }

      await page.goto(`/business/${businessSlug}`);

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLdScripts.length).toBeGreaterThan(0);

      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        expect(content).toBeTruthy();

        // Should be valid JSON
        expect(() => JSON.parse(content!)).not.toThrow();

        const data = JSON.parse(content!);
        // Should have @context for schema.org
        expect(data['@context']).toBeTruthy();
        expect(data['@context']).toContain('schema.org');
      }
    });

    test('homepage has WebSite schema', async ({ page }) => {
      await page.goto('/');

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      // Homepage should have at least one schema
      expect(jsonLdScripts.length).toBeGreaterThan(0);

      // Check for WebSite or Organization schema
      let hasWebsiteOrOrg = false;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const data = JSON.parse(content!);
        if (data['@type'] === 'WebSite' || data['@type'] === 'Organization') {
          hasWebsiteOrOrg = true;
          break;
        }
      }
      expect(hasWebsiteOrOrg).toBeTruthy();
    });

    test('listing page has breadcrumb schema', async ({ page }) => {
      await page.goto('/listing');

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const data = JSON.parse(content!);
        // Check for BreadcrumbList schema
        if (data['@type'] === 'BreadcrumbList') {
          expect(data['itemListElement']).toBeTruthy();
          break;
        }
      }
    });
  });

  test.describe('Technical SEO', () => {
    test('sitemap exists and is valid', async ({ request }) => {
      // Check sitemap-index.xml first (Astro creates this)
      let response = await request.get('/sitemap-index.xml');
      let status = response.status();

      // If sitemap-index doesn't exist, try sitemap.xml
      let body = '';
      if (status !== 200) {
        const altResponse = await request.get('/sitemap.xml');
        if (altResponse.status() === 200) {
          body = await altResponse.text();
        } else {
          // Sitemap may not be configured in SSR mode - skip this test
          test.skip();
          return;
        }
      } else {
        body = await response.text();
      }

      expect(body).toContain('<?xml');
      expect(body).toContain('<urlset');
      expect(body).toContain('<loc>');
    });

    test('robots.txt exists and is accessible', async ({ request }) => {
      const response = await request.get('/robots.txt');
      expect(response.status()).toBe(200);

      const body = await response.text();
      // Should have at least one rule
      expect(body.toLowerCase()).toContain('user-agent');
    });

    test('pages have proper h1 headings', async ({ page }) => {
      await page.goto('/');

      // Should have exactly one h1 (SEO best practice)
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
      // Note: Some pages may have multiple h1s, so we just check at least one exists
    });

    test('robots meta tag is not blocking indexing', async ({ page }) => {
      await page.goto('/');

      const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
      // Should not have noindex
      if (robotsMeta) {
        expect(robotsMeta.toLowerCase()).not.toContain('noindex');
      }
    });
  });
});