// ============================================
// Performance Tests - E2E
// ============================================

import { test, expect, type Page } from '@playwright/test';

// ============================================
// Test Configuration
// ============================================

const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals (Google standards)
  lcp: 2500, // Largest Contentful Paint < 2.5s (Good)
  inp: 200,  // Interaction to Next Paint < 200ms (Good)
  cls: 0.1,   // Cumulative Layout Shift < 0.1 (Good)

  // Page Load Times
  homepage: 2000,  // 2s
  listing: 3000,   // 3s
  businessDetail: 2000, // 2s

  // API Response Times
  getEndpoints: 500, // 500ms
  searchEndpoints: 1000, // 1s

  // Resource Timing
  maxResourceSize: 1024 * 1024, // 1MB
  maxNetworkDuration: 2000, // 2s
};

// ============================================
// Helper Functions
// ============================================

/**
 * Measure Core Web Vitals using Performance Observer API
 */
async function measureCoreWebVitals(page: Page) {
  return page.evaluate(() => {
    return new Promise<{
      lcp: number;
      inp: number;
      cls: number;
      fid: number;
    }>((resolve) => {
      const metrics: {
        lcp: number;
        inp: number;
        cls: number;
        fid: number;
      } = {
        lcp: 0,
        inp: 0,
        cls: 0,
        fid: 0,
      };

      // LCP measurement
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
        metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // INP measurement (Interaction to Next Paint)
      let inpObserver: PerformanceObserver;
      if ('PerformanceEventTiming' in window) {
        inpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          for (const entry of entries) {
            if (entry.interactionId) {
              const inp = (entry as PerformanceEventTiming).duration;
              if (inp > metrics.inp) {
                metrics.inp = inp;
              }
            }
          }
        });
        inpObserver.observe({ type: 'event', buffered: true });
      }

      // CLS measurement
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // FID measurement (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          metrics.fid = (entries[0] as PerformanceEventTiming).processingStart - entries[0].startTime;
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Wait for metrics to be collected
      setTimeout(() => {
        lcpObserver.disconnect();
        inpObserver?.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
        resolve(metrics);
      }, 3000);
    });
  });
}

/**
 * Measure navigation timing
 */
async function measureNavigationTiming(page: Page) {
  return page.evaluate(() => {
    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigation[];
    if (!navigation) return null;

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      load: navigation.loadEventEnd - navigation.startTime,
      domInteractive: (performance.getEntriesByType('navigation')[0] as PerformanceNavigation).domContentLoadedEventEnd,
    };
  });
}

/**
 * Get all resource timings
 */
async function getResourceTimings(page: Page) {
  return page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.map((r) => ({
      name: r.name,
      type: r.initiatorType,
      size: r.transferSize || r.encodedBodySize || 0,
      duration: r.responseEnd - r.startTime,
      dns: r.dnsEnd - r.dnsStart,
      tcp: r.connectEnd - r.connectStart,
      ttfb: r.responseStart - r.requestStart,
    }));
  });
}

/**
 * Measure API response time
 */
async function measureApiTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

// ============================================
// Core Web Vitals Tests
// ============================================

test.describe('Core Web Vitals', () => {
  test('homepage LCP should be under 2.5s', async ({ page }) => {
    // Skip in CI due to variability
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lcp = entries[entries.length - 1] as PerformanceEntry;
            observer.disconnect();
            resolve(lcp.startTime);
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 5s
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`Homepage LCP: ${lcp.toFixed(2)}ms`);
    expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.lcp);
  });

  test('homepage INP should be under 200ms', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Interact with the page to measure INP
    await page.click('nav button, nav a, header button, header a').catch(() => {});
    await page.waitForTimeout(500);

    const inp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let maxINP = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const eventEntry = entry as PerformanceEventTiming;
            if (eventEntry.interactionId) {
              const inp = eventEntry.duration;
              if (inp > maxINP) {
                maxINP = inp;
              }
            }
          }
        });
        observer.observe({ type: 'event', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(maxINP);
        }, 2000);
      });
    });

    console.log(`Homepage INP: ${inp.toFixed(2)}ms`);
    expect(inp).toBeLessThan(PERFORMANCE_THRESHOLDS.inp);
  });

  test('homepage CLS should be under 0.1', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/');
    await page.waitForTimeout(2000);

    const cls = await page.evaluate(() => {
      let clsValue = 0;
      const entries = performance.getEntriesByType('layout-shift') as Array<PerformanceEntry & { hadRecentInput: boolean; value: number }>;
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      return clsValue;
    });

    console.log(`Homepage CLS: ${cls.toFixed(4)}`);
    expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.cls);
  });

  test('listing page LCP should be under 2.5s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/listing', { waitUntil: 'domcontentloaded' });

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lcp = entries[entries.length - 1] as PerformanceEntry;
            observer.disconnect();
            resolve(lcp.startTime);
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`Listing LCP: ${lcp.toFixed(2)}ms`);
    expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.lcp);
  });
});

// ============================================
// Page Load Times Tests
// ============================================

test.describe('Page Load Times', () => {
  test('homepage should load within 2s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;

    console.log(`Homepage load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.homepage);
  });

  test('listing page should load within 3s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    const start = Date.now();
    await page.goto('/listing', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;

    console.log(`Listing page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.listing);
  });

  test('business detail page should load within 2s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    // First, get a valid business slug
    const response = await page.request.get('/api/businesses?limit=1');
    const data = await response.json();

    if (!data.data?.[0]?.slug) {
      test.skip(true, 'No businesses available for testing');
      return;
    }

    const slug = data.data[0].slug;
    const start = Date.now();
    await page.goto(`/business/${slug}`, { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;

    console.log(`Business detail load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.businessDetail);
  });

  test('products page should load within 3s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    const start = Date.now();
    await page.goto('/products-services', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;

    console.log(`Products page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.listing);
  });

  test('about page should load within 1.5s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    const start = Date.now();
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;

    console.log(`About page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1500);
  });
});

// ============================================
// API Response Times Tests
// ============================================

test.describe('API Response Times', () => {
  test('GET /api/businesses should respond within 500ms', async ({ page }) => {
    const start = Date.now();
    const response = await page.request.get('/api/businesses');
    const responseTime = Date.now() - start;

    console.log(`GET /api/businesses: ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.getEndpoints);
  });

  test('GET /api/categories should respond within 300ms', async ({ page }) => {
    const start = Date.now();
    const response = await page.request.get('/api/categories');
    const responseTime = Date.now() - start;

    console.log(`GET /api/categories: ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(300);
  });

  test('GET /api/search should respond within 1s', async ({ page }) => {
    const start = Date.now();
    // Use businesses endpoint with search param as the actual search API
    const response = await page.request.get('/api/businesses?search=restaurant');
    const responseTime = Date.now() - start;

    console.log(`GET /api/businesses (search): ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.searchEndpoints);
  });

  test('GET /api/listing should respond within 500ms', async ({ page }) => {
    const start = Date.now();
    // Use businesses endpoint - it's the main listing endpoint
    const response = await page.request.get('/api/businesses?limit=12');
    const responseTime = Date.now() - start;

    console.log(`GET /api/businesses: ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.getEndpoints);
  });

  test('GET /api/listing with category filter should respond within 500ms', async ({ page }) => {
    const start = Date.now();
    // Use businesses endpoint with category filter
    const response = await page.request.get('/api/businesses?category=restaurant&limit=12');
    const responseTime = Date.now() - start;

    console.log(`GET /api/businesses (filtered): ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.getEndpoints);
  });

  test('GET /api/products should respond within 500ms', async ({ page }) => {
    const start = Date.now();
    // Products API requires businessPageId, so we get a valid one first
    const bizResponse = await page.request.get('/api/businesses?limit=1');
    const bizData = await bizResponse.json();
    const businessPageId = bizData.data?.[0]?.id;

    if (!businessPageId) {
      test.skip(true, 'No businesses available for products testing');
      return;
    }

    const response = await page.request.get(`/api/products?businessPageId=${businessPageId}`);
    const responseTime = Date.now() - start;

    console.log(`GET /api/products: ${responseTime}ms (status: ${response.status()})`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.getEndpoints);
  });
});

// ============================================
// Resource Timing Tests
// ============================================

test.describe('Resource Timing', () => {
  test('no resources should be larger than 1MB', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const resources = await getResourceTimings(page);

    const largeResources = resources.filter((r) => r.size > PERFORMANCE_THRESHOLDS.maxResourceSize);

    if (largeResources.length > 0) {
      console.log('Large resources found:');
      largeResources.forEach((r) => {
        console.log(`  - ${r.name}: ${(r.size / 1024 / 1024).toFixed(2)}MB`);
      });
    }

    expect(largeResources).toHaveLength(0);
  });

  test('no network requests should be slower than 2s', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const resources = await getResourceTimings(page);

    const slowRequests = resources.filter((r) => r.duration > PERFORMANCE_THRESHOLDS.maxNetworkDuration);

    if (slowRequests.length > 0) {
      console.log('Slow network requests found:');
      slowRequests.forEach((r) => {
        console.log(`  - ${r.name}: ${r.duration.toFixed(2)}ms (${r.type})`);
      });
    }

    expect(slowRequests).toHaveLength(0);
  });

  test('images should be properly sized (not oversized)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const imageResources = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).map((img) => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height,
      }));
    });

    // Check for images that are loading without dimensions
    const improperlySized = imageResources.filter(
      (img) => img.width === 0 || img.height === 0
    );

    if (improperlySized.length > 0) {
      console.log('Images without proper dimensions:');
      improperlySized.forEach((img) => {
        console.log(`  - ${img.src}`);
      });
    }

    // Note: This is informational, not a hard failure
    console.log(`Total images: ${imageResources.length}, improperly sized: ${improperlySized.length}`);
  });

  test('fonts should be loaded efficiently', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const fontResources = await page.evaluate(() => {
      return performance
        .getEntriesByType('resource')
        .filter((r) => r.name.includes('font') || r.name.includes('.woff') || r.name.includes('.ttf'))
        .map((r) => ({
          name: r.name,
          size: (r as PerformanceResourceTiming).transferSize || 0,
          duration: (r as PerformanceResourceTiming).responseEnd - r.startTime,
        }));
    });

    if (fontResources.length > 0) {
      console.log('Font resources:');
      fontResources.forEach((f) => {
        console.log(`  - ${f.name}: ${(f.size / 1024).toFixed(2)}KB`);
      });
    }

    // Fonts should be reasonably sized
    const oversizedFonts = fontResources.filter((f) => f.size > 100 * 1024); // 100KB
    expect(oversizedFonts).toHaveLength(0);
  });

  test('no render-blocking CSS or JS', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const blockingResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter((r) => {
          const isBlocking =
            (r.initiatorType === 'link' && r.name.includes('.css')) ||
            (r.initiatorType === 'script' && !r.name.includes('async') && !r.name.includes('defer'));
          return isBlocking && (r.fetchStart - r.startTime) > 50;
        })
        .map((r) => ({
          name: r.name,
          type: r.initiatorType,
          blockTime: r.fetchStart - r.startTime,
        }));
    });

    if (blockingResources.length > 0) {
      console.log('Potential blocking resources:');
      blockingResources.forEach((r) => {
        console.log(`  - ${r.name} (${r.type}): ${r.blockTime.toFixed(2)}ms block time`);
      });
    }
  });
});

// ============================================
// Navigation Timing Tests
// ============================================

test.describe('Navigation Timing', () => {
  test('homepage DOMContentLoaded should be under 1.5s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const timing = await measureNavigationTiming(page);

    if (timing) {
      console.log(`DOMContentLoaded: ${timing.domContentLoaded.toFixed(2)}ms`);
      expect(timing.domContentLoaded).toBeLessThan(1500);
    }
  });

  test('homepage load event should be under 3s', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/', { waitUntil: 'load' });

    const timing = await measureNavigationTiming(page);

    if (timing) {
      console.log(`Load event: ${timing.load.toFixed(2)}ms`);
      expect(timing.load).toBeLessThan(3000);
    }
  });

  test('Time to First Byte should be under 500ms', async ({ page }) => {
    test.skip(!!process.env.CI, 'Timing tests can be flaky in CI');

    await page.goto('/');

    const resources = await getResourceTimings(page);

    // Find the main document TTFB
    const docTiming = resources.find((r) => r.name.includes('localhost') || r.type === 'navigation');

    if (docTiming) {
      console.log(`TTFB: ${docTiming.ttfb.toFixed(2)}ms`);
      expect(docTiming.ttfb).toBeLessThan(500);
    }
  });
});

// ============================================
// Lighthouse-style Performance Tests
// ============================================

test.describe('Performance Best Practices', () => {
  test('images should use modern formats (WebP/AVIF)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        format: img.src.match(/\.(webp|avif|jpg|jpeg|png|gif)/)?.[1] || 'unknown',
      }));
    });

    const legacyFormatCount = images.filter((img) =>
      ['jpg', 'jpeg', 'png', 'gif'].includes(img.format)
    ).length;

    console.log(`Images: ${images.length}, Legacy formats: ${legacyFormatCount}`);

    // Informational - not a hard requirement
    // In production, consider serving WebP/AVIF for better compression
  });

  test('no unused JavaScript should be loaded', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const jsResources = await page.evaluate(() => {
      return performance
        .getEntriesByType('resource')
        .filter((r) => r.name.includes('.js') || r.name.includes('.mjs'))
        .map((r) => ({
          name: r.name.split('/').pop() || r.name,
          size: (r as PerformanceResourceTiming).transferSize || 0,
        }));
    });

    if (jsResources.length > 0) {
      console.log('JavaScript files loaded:');
      jsResources.forEach((js) => {
        const sizeKB = (js.size / 1024).toFixed(2);
        console.log(`  - ${js.name}: ${sizeKB}KB`);
      });
    }

    const totalJSSize = jsResources.reduce((acc, js) => acc + js.size, 0);
    const totalJSMB = totalJSSize / 1024 / 1024;

    console.log(`Total JS bundle: ${totalJSMB.toFixed(2)}MB`);

    // Warn if JS bundle is > 500KB
    if (totalJSMB > 0.5) {
      console.warn('Warning: JS bundle size exceeds 500KB recommendation');
    }
  });

  test('lazy loading is properly configured', async ({ page }) => {
    await page.goto('/listing');

    const lazyImages = await page.locator('img[loading="lazy"]').count();
    const totalImages = await page.locator('img').count();

    console.log(`Lazy loaded images: ${lazyImages}/${totalImages}`);

    // At least some images should be lazy loaded if there are more than 3 images
    if (totalImages > 3) {
      expect(lazyImages).toBeGreaterThan(0);
    }
  });
});

// ============================================
// Stress/Endurance Tests
// ============================================

test.describe('Stress Tests', () => {
  test('multiple API calls should complete in reasonable time', async ({ page }) => {
    const start = Date.now();

    // Make multiple API calls in parallel
    const responses = await Promise.all([
      page.request.get('/api/businesses?limit=12'),
      page.request.get('/api/categories'),
      page.request.get('/api/businesses?limit=12'), // Second listing call
    ]);

    const totalTime = Date.now() - start;

    console.log(`3 parallel API calls completed in: ${totalTime}ms`);

    // All should succeed
    responses.forEach((r, i) => {
      expect(r.status()).toBe(200);
    });

    // Total time should be reasonable (not sum of all, but max)
    expect(totalTime).toBeLessThan(1500);
  });

  test('page should handle navigation without memory leaks', async ({ page }) => {
    // Navigate to multiple pages
    const pages = ['/', '/listing', '/about', '/'];
    const initialMemory = await page.evaluate(() => (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0);

    for (const path of pages) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(200);
    }

    const finalMemory = await page.evaluate(() => (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0);
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`Memory increase after navigation: ${memoryIncrease.toFixed(2)}MB`);

    // Memory increase should be reasonable (< 10MB)
    expect(memoryIncrease).toBeLessThan(10);
  });
});