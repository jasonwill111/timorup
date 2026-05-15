import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8787';

test.describe('SEO: Sitemap & Breadcrumb', () => {

  test('sitemap.xml returns valid XML', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/sitemap.xml`);

    // Check status
    expect(response.status()).toBeGreaterThanOrEqual(200);

    // Check content type
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/xml');

    // Get text content
    const text = await response.text();

    // Check XML declaration
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');

    // Check urlset
    expect(text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    // Check homepage URL
    expect(text).toContain('<loc>https://timorlist.com/</loc>');

    // Check changefreq and priority for homepage
    expect(text).toContain('<changefreq>daily</changefreq>');
    expect(text).toContain('<priority>1.0</priority>');

    console.log('Sitemap XML valid: YES');
    console.log('Content length:', text.length);
  });

  test('sitemap includes static pages', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/sitemap.xml`);
    const text = await response.text();

    const staticPages = [
      '/about',
      '/contact',
      '/pricing',
      '/faq',
      '/blog',
      '/businesses',
      '/non-profits',
      '/public-sectors',
      '/categories'
    ];

    for (const page2 of staticPages) {
      expect(text).toContain(`<loc>https://timorlist.com${page2}</loc>`);
    }

    console.log('All static pages in sitemap: YES');
  });

  test('sitemap has lastmod for entries', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/sitemap.xml`);
    const text = await response.text();

    // Check that lastmod is present
    expect(text).toContain('<lastmod>');

    console.log('lastmod present: YES');
  });

  test('business page has BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto(`${BASE_URL}/businesses`);
    await page.waitForLoadState('networkidle');

    // Find a business link
    const businessLink = page.locator('a[href^="/business/"]').first();
    if (await businessLink.isVisible()) {
      await businessLink.click();
      await page.waitForLoadState('networkidle');

      // Check for BreadcrumbList
      const bodyContent = await page.content();
      expect(bodyContent).toContain('"@type": "BreadcrumbList"');
      expect(bodyContent).toContain('"@type": "ListItem"');

      // Check breadcrumb structure
      expect(bodyContent).toContain('"position": 1');
      expect(bodyContent).toContain('"position": 2');
      expect(bodyContent).toContain('"position": 3');

      console.log('Business page BreadcrumbList: YES');
    } else {
      console.log('No business found to test');
    }
  });

  test('non-profit page has BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-profits`);
    await page.waitForLoadState('networkidle');

    const npLink = page.locator('a[href^="/non-profit/"]').first();
    if (await npLink.isVisible()) {
      await npLink.click();
      await page.waitForLoadState('networkidle');

      const bodyContent = await page.content();
      expect(bodyContent).toContain('"@type": "BreadcrumbList"');
      console.log('Non-profit page BreadcrumbList: YES');
    }
  });

  test('public-sector page has BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto(`${BASE_URL}/public-sectors`);
    await page.waitForLoadState('networkidle');

    const psLink = page.locator('a[href^="/public-sector/"]').first();
    if (await psLink.isVisible()) {
      await psLink.click();
      await page.waitForLoadState('networkidle');

      const bodyContent = await page.content();
      expect(bodyContent).toContain('"@type": "BreadcrumbList"');
      console.log('Public sector page BreadcrumbList: YES');
    }
  });

  test('robots.txt points to sitemap.xml', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/robots.txt`);
    const text = await response.text();

    // Check sitemap reference
    expect(text).toContain('Sitemap: https://timorlist.com/sitemap.xml');

    // Check admin disallow
    expect(text).toContain('Disallow: /admin/');

    console.log('robots.txt sitemap reference: YES');
  });

});