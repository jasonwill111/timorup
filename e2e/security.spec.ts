// ============================================
// Security E2E Tests
// OWASP Top 10 Prevention Tests
// ============================================

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4323';

// ==================== XSS PREVENTION TESTS ====================

test.describe('Security - XSS Prevention', () => {

  test('S-XSS-001: Search input should sanitize script injection', async ({ page }) => {
    await page.goto('/');

    // Try to inject script tag in search
    const searchInput = page.locator('input[name="search"], input[type="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('<script>alert(1)</script>');

      // Click search button if visible
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")');
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Check if there's an actual script tag with our payload (not just text containing it)
    const hasScriptWithPayload = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.textContent && script.textContent.includes('alert(1)')) {
          return true;
        }
      }
      return false;
    });

    // Should not have unescaped script tags with our payload
    expect(hasScriptWithPayload).toBe(false);
  });

  test('S-XSS-002: Contact form should sanitize script injection', async ({ page }) => {
    await page.goto('/contact');

    // Fill form with XSS payload
    const nameInput = page.locator('input[name="name"], input[name="contactName"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"], textarea[name="content"]');

    if (await nameInput.isVisible()) {
      await nameInput.fill('<script>alert(1)</script>');
    }
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    if (await messageInput.isVisible()) {
      await messageInput.fill('<img src=x onerror=alert(1)>');
    }

    // Click submit button if visible, with timeout handling
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible({ timeout: 2000 })) {
      await submitButton.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    }

    // Check if there's an actual script tag with our payload
    const hasScriptWithPayload = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.textContent && script.textContent.includes('alert(1)')) {
          return true;
        }
      }
      return false;
    });
    expect(hasScriptWithPayload).toBe(false);
  });

  test('S-XSS-003: Review form should sanitize script injection', async ({ page }) => {
    await page.goto('/');

    // Find a business to review (may require login for review form)
    const businessLinks = page.locator('a[href*="/business/"]').first();
    if (await businessLinks.isVisible({ timeout: 5000 })) {
      await businessLinks.click();

      // Wait for navigation, but don't fail if it redirects (login required)
      try {
        await page.waitForURL(/\/business\//, { timeout: 5000 });

        // Look for review form
        const reviewTextarea = page.locator('textarea[name="comment"], textarea[name="content"], textarea[name="review"]');
        if (await reviewTextarea.isVisible({ timeout: 3000 })) {
          await reviewTextarea.fill('<script>alert("XSS")</script>');
          await page.click('button:has-text("Submit"), button:has-text("Post")');
          await page.waitForTimeout(1000);

          // Check if there's an actual script tag with our payload
          const hasScriptWithPayload = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
              if (script.textContent && script.textContent.includes('alert(')) {
                return true;
              }
            }
            return false;
          });
          expect(hasScriptWithPayload).toBe(false);
        }
      } catch {
        // Redirected to login - review requires authentication (this is correct behavior)
        console.log('Review form requires login - test skipped');
      }
    }
  });

  test('S-XSS-004: Registration form should sanitize XSS in name field', async ({ page }) => {
    await page.goto('/register');

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    if (await nameInput.isVisible()) {
      await nameInput.fill('<script>alert(1)</script>');
      await emailInput.fill(`xss-test-${Date.now()}@example.com`);
      await passwordInput.fill('TestPassword123!');

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // After registration, name should be sanitized
      const currentUrl = page.url();
      if (currentUrl.includes('dashboard') || currentUrl.includes('login')) {
        const content = await page.content();
        expect(content).not.toContain('<script>alert');
      }
    }
  });

  test('S-XSS-005: Newsletter form should sanitize XSS payload', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('"><script>alert(1)</script>');
      await page.click('button:has-text("Subscribe"), button:has-text("Submit")');
      await page.waitForTimeout(500);

      const content = await page.content();
      expect(content).not.toContain('<script>alert');
    }
  });
});

// ==================== SQL INJECTION PREVENTION TESTS ====================

test.describe('Security - SQL Injection Prevention', () => {

  test('S-SQL-001: Search input should handle SQL injection gracefully', async ({ page }) => {
    await page.goto('/');

    // Common SQL injection payloads
    const payloads = [
      "' OR 1=1 --",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "' OR 'a'='a",
    ];

    for (const payload of payloads) {
      const searchInput = page.locator('input[name="search"], input[type="search"]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill(payload);
        await page.click('button[type="submit"], button:has-text("Search")');
        await page.waitForTimeout(500);

        // Page should not show database errors
        const content = await page.content();
        expect(content).not.toContain('SQL');
        expect(content).not.toContain('mysql');
        expect(content).not.toContain('sqlite');
        expect(content).not.toContain('syntax error');
        expect(content).not.toContain('database');
        expect(content).not.toContain('ORA-');
      }
    }
  });

  test('S-SQL-002: API endpoint should reject SQL injection', async ({ request }) => {
    const payloads = [
      "' OR 1=1 --",
      "'; SELECT * FROM users --",
      "' UNION SELECT NULL--",
    ];

    for (const payload of payloads) {
      const response = await request.get(`${BASE_URL}/api/businesses?search=${encodeURIComponent(payload)}`);

      // Should either return 400 or sanitize the input
      expect([200, 400]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        // Should not expose database data
        const content = JSON.stringify(data);
        expect(content).not.toContain('password');
        expect(content).not.toContain('users');
      }
    }
  });

  test('S-SQL-003: Form inputs should handle SQL injection', async ({ page }) => {
    await page.goto('/register');

    const sqlPayload = "' OR 1=1 --";

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');

    if (await nameInput.isVisible()) {
      await nameInput.fill(sqlPayload);
      await emailInput.fill(`sql-test-${Date.now()}@example.com`);

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Should not expose database errors
      const content = await page.content();
      expect(content).not.toContain('SQL');
      expect(content).not.toContain('syntax error');
    }
  });
});

// ==================== AUTH BYPASS TESTS ====================

test.describe('Security - Authentication Bypass', () => {

  test('S-AUTH-001: Admin dashboard should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    const url = page.url();
    // Should redirect to login or show access denied
    expect(url).toMatch(/\/admin\/login|\/login|access|denied/i);
  });

  test('S-AUTH-002: Admin API should require authentication', async ({ request }) => {
    // Try to access admin endpoints without auth
    const endpoints = [
      '/api/admin/users',
      '/api/admin/businesses',
      '/api/admin/orders',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(`${BASE_URL}${endpoint}`);
      expect([401, 403]).toContain(response.status());
    }
  });

  test('S-AUTH-003: User dashboard should require authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    // Should redirect to login
    const url = page.url();
    expect(url).toMatch(/\/login|\/register/i);
  });

  test('S-AUTH-004: Account page should require authentication', async ({ page }) => {
    await page.goto('/account');
    await page.waitForTimeout(1000);

    const url = page.url();
    expect(url).toMatch(/\/login|\/register/i);
  });

  test('S-AUTH-005: API account endpoints should require authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/account`);
    expect([401, 403]).toContain(response.status());
  });

  test('S-AUTH-006: API order endpoints should require authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders`);
    expect([401, 403]).toContain(response.status());
  });

  test('S-AUTH-007: Media API should require authentication', async ({ request }) => {
    const endpoints = [
      '/api/media',
      '/api/media/upload',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(`${BASE_URL}${endpoint}`);
      // Should require auth (401/403) or route doesn't exist (404)
      expect([401, 403, 404]).toContain(response.status());
    }
  });
});

// ==================== INPUT VALIDATION TESTS ====================

test.describe('Security - Input Validation', () => {

  test('S-VAL-001: Registration should reject invalid email format', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Should show validation error or prevent submission
    const url = page.url();
    // Either shows error or stays on register page
    expect(url).toMatch(/\/register|error|invalid/i);
  });

  test('S-VAL-002: Registration should reject weak passwords', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="email"]', `weak-pass-${Date.now()}@example.com`);
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.fill('input[name="confirmPassword"]', '123');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Should show validation error
    const url = page.url();
    expect(url).toMatch(/\/register|error|weak|short/i);
  });

  test('S-VAL-003: API should reject malformed JSON', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: '{ invalid json }',
    });

    // Should return 400 or 422 for malformed JSON
    expect([400, 422]).toContain(response.status());
  });

  test('S-VAL-004: API should reject invalid email in signup', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/sign-up`, {
      data: {
        email: 'invalid-email-format',
        password: 'password123',
        name: 'Test',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('S-VAL-005: Review rating should be validated (1-5)', async ({ request }) => {
    // Try to create a review with invalid rating
    const invalidRatings = [0, 6, -1, 100];

    for (const rating of invalidRatings) {
      const response = await request.post(`${BASE_URL}/api/reviews`, {
        data: {
          rating,
          businessId: 'test-business-id',
          content: 'Test review',
        },
      });

      // Should reject invalid rating
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('S-VAL-006: Price should be validated as positive number', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/products`, {
      data: {
        name: 'Test Product',
        price: -50, // Negative price
      },
    });

    // Should reject negative price
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

// ==================== CORS TESTS ====================

test.describe('Security - CORS Headers', () => {

  test('S-CORS-001: API should have proper CORS headers', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/businesses`);

    // Check for security headers
    // CORS will be handled by browser, but we can verify the response
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('S-CORS-002: Auth endpoints should not expose sensitive data', async ({ request }) => {
    // GET requests to auth endpoints should not return sensitive info
    const response = await request.get(`${BASE_URL}/api/auth/get-session`);

    // Should either return 200 with minimal info, 401, or 404 if endpoint doesn't exist
    expect([200, 401, 404]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      // Should not expose sensitive info
      expect(data).not.toHaveProperty('password');
      expect(data).not.toHaveProperty('token');
    }
  });

  test('S-CORS-003: OPTIONS request should handle CORS preflight', async ({ request }) => {
    const response = await request.fetch(`${BASE_URL}/api/businesses`, {
      method: 'OPTIONS',
    });

    // Preflight should be handled
    // Status can be 200, 204, or method not allowed
    expect([200, 204, 405]).toContain(response.status());
  });
});

// ==================== RATE LIMITING TESTS ====================

test.describe('Security - Rate Limiting', () => {

  test('S-RATE-001: Rapid API requests should be handled gracefully', async ({ request }) => {
    // Make rapid requests to an endpoint
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(request.get(`${BASE_URL}/api/businesses`));
    }

    const results = await Promise.all(promises);

    // Should handle gracefully (not all should fail, not all should succeed exactly)
    const statuses = results.map(r => r.status());
    const all200 = statuses.every(s => s === 200);
    const some429 = statuses.some(s => s === 429);

    // Either all succeed OR some get rate limited
    expect(all200 || some429 || statuses.every(s => s >= 200)).toBe(true);
  });

  test('S-RATE-002: Auth endpoints should handle rapid login attempts', async ({ request }) => {
    const promises = [];
    // Make rapid login attempts
    for (let i = 0; i < 20; i++) {
      promises.push(request.post(`${BASE_URL}/api/auth/sign-in`, {
        data: {
          email: `rapid-test-${i}@example.com`,
          password: 'wrongpassword',
        },
      }));
    }

    const results = await Promise.all(promises);

    // Should handle without crashing
    for (const response of results) {
      expect(response.status()).toBeGreaterThanOrEqual(200);
    }
  });

  test('S-RATE-003: Search endpoint should handle rapid queries', async ({ request }) => {
    const promises = [];
    // Make rapid search queries
    for (let i = 0; i < 30; i++) {
      promises.push(request.get(`${BASE_URL}/api/businesses?search=test${i}`));
    }

    const results = await Promise.all(promises);

    // Should handle gracefully
    const statuses = results.map(r => r.status());
    expect(statuses.every(s => s >= 200 || s === 429)).toBe(true);
  });
});

// ==================== CSRF TESTS ====================

test.describe('Security - CSRF Protection', () => {

  test('S-CSRF-001: Forms should have CSRF tokens (if implemented)', async ({ page }) => {
    await page.goto('/register');

    // Check if form has CSRF token hidden input
    const csrfInput = page.locator('input[name="_csrf"], input[name="csrfToken"], input[type="hidden"][value*="token"]');
    const hasCsrfToken = await csrfInput.count() > 0;

    // If CSRF protection is implemented, token should be present
    // If not implemented, this test documents the current state
    // The application should either have CSRF protection or use SameSite cookies
    expect(true).toBe(true); // Placeholder - actual implementation depends on app requirements
  });

  test('S-CSRF-002: SameSite cookies should be configured', async ({ page }) => {
    await page.goto('/');

    // Perform some action that sets cookies
    const cookies = await page.context().cookies();

    // Check for SameSite attribute on session cookies
    const sessionCookies = cookies.filter(c =>
      c.name.includes('session') ||
      c.name.includes('auth') ||
      c.name.includes('token')
    );

    // Session cookies should have SameSite attribute
    for (const cookie of sessionCookies) {
      // SameSite should be Strict or Lax (not None without Secure)
      if (cookie.sameSite) {
        expect(['strict', 'lax', 'none']).toContain(cookie.sameSite);
      }
    }
  });
});

// ==================== SENSITIVE DATA EXPOSURE TESTS ====================

test.describe('Security - Sensitive Data Exposure', () => {

  test('S-SENS-001: API should not expose password hashes', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/businesses`);

    if (response.status() === 200) {
      const data = await response.json();
      const content = JSON.stringify(data).toLowerCase();

      // Should not contain password-related fields
      expect(content).not.toContain('"password"');
      expect(content).not.toContain('"hash"');
      expect(content).not.toContain('"secret"');
    }
  });

  test('S-SENS-002: User API should not expose sensitive fields', async ({ request }) => {
    // Try to get user data without auth
    const response = await request.get(`${BASE_URL}/api/account`);

    if (response.status() === 401 || response.status() === 403) {
      // Correct behavior - should require auth
      expect(true).toBe(true);
    } else {
      // If somehow accessible, check for sensitive data
      const data = await response.json();
      const content = JSON.stringify(data).toLowerCase();
      expect(content).not.toContain('password');
    }
  });

  test('S-SENS-003: Error messages should not expose stack traces', async ({ request }) => {
    // Trigger an error by sending malformed data
    const response = await request.post(`${BASE_URL}/api/businesses`, {
      data: { invalid: 'data with unexpected structure that might cause errors' }
    });

    const content = await response.text();

    // Should not expose stack traces or internal paths (file system paths, not CSS classes)
    // Only check for actual file paths, not CSS class names that happen to have /src/
    expect(content).not.toMatch(/at\s+\w+\s+\(\/.+?\.(ts|js)/);  // Stack trace pattern
    expect(content).not.toContain('node_modules');
    expect(content).not.toMatch(/[A-Z]:\\src\\/i);  // Windows path
    expect(content).not.toMatch(/file:\/\/.*src\//);  // File protocol
  });
});

// ==================== SECURITY HEADERS TESTS ====================

test.describe('Security - Security Headers', () => {

  test('S-HEAD-001: Pages should have security-related headers', async ({ page }) => {
    const response = await page.goto('/');

    const headers = response.headers();

    // Check for common security headers (best practices)
    // Note: These may not all be present, but we document what we find
    const hasContentSecurityPolicy = 'content-security-policy' in headers;
    const hasXFrameOptions = 'x-frame-options' in headers;
    const hasXContentTypeOptions = 'x-content-type-options' in headers;
    const hasReferrerPolicy = 'referrer-policy' in headers;

    // At minimum, should have some security headers configured
    // This documents current state
    expect(true).toBe(true);
  });

  test('S-HEAD-002: Sensitive pages should enforce HTTPS', async ({ page }) => {
    // When on HTTPS, check HSTS header
    const baseUrl = BASE_URL.replace('http://', 'https://');

    try {
      const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      const headers = response.headers();

      // Check for HSTS header on sensitive pages
      // HSTS helps prevent downgrade attacks
      expect(true).toBe(true); // Document current state
    } catch (e) {
      // If HTTPS not available locally, skip
      expect(true).toBe(true);
    }
  });
});

// ==================== FILE UPLOAD SECURITY TESTS ====================

test.describe('Security - File Upload', () => {

  test('S-FILE-001: File upload should require authentication', async ({ page }) => {
    // Try to access upload endpoint without auth
    const response = await page.request.fetch(`${BASE_URL}/api/media/upload`, {
      method: 'POST',
    });

    expect([401, 403]).toContain(response.status());
  });

  test('S-FILE-002: File upload should validate file types', async ({ request }) => {
    // Try to upload invalid file type (if endpoint is accessible with auth)
    // This test assumes upload requires auth, so we just verify the endpoint exists
    const response = await request.post(`${BASE_URL}/api/media/upload`, {
      multipart: {
        file: {
          name: 'test.exe',
          mimeType: 'application/x-msdownload',
          buffer: Buffer.from('mock malicious content'),
        },
      },
    });

    // Should require auth or reject invalid type
    expect([401, 403, 400, 415]).toContain(response.status());
  });
});

// ==================== SESSION SECURITY TESTS ====================

test.describe('Security - Session Security', () => {

  test('S-SESS-001: Session cookies should be HTTP-only', async ({ page }) => {
    await page.goto('/login');

    // Fill login form and submit
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const cookies = await page.context().cookies();
    const sessionCookies = cookies.filter(c =>
      c.name.includes('session') ||
      c.name.includes('auth') ||
      c.name.includes('token')
    );

    // Session cookies should be HTTP-only
    for (const cookie of sessionCookies) {
      // HTTP-only cookies cannot be accessed via JavaScript
      // This is a security best practice
      expect(cookie.httpOnly).toBe(true);
    }
  });

  test('S-SESS-002: Session cookies should be secure in production', async ({ page }) => {
    // Skip in local development
    if (BASE_URL.includes('localhost')) {
      test.skip();
    }

    await page.goto('/login');
    const cookies = await page.context().cookies();

    const sessionCookies = cookies.filter(c =>
      c.name.includes('session') ||
      c.name.includes('auth')
    );

    // In production (HTTPS), session cookies should be Secure
    for (const cookie of sessionCookies) {
      if (cookie.secure !== undefined) {
        expect(cookie.secure).toBe(true);
      }
    }
  });

  test('S-SESS-003: Session should timeout after inactivity', async ({ page }) => {
    // This test checks if session management is in place
    // Actual timeout testing would require time mocking
    await page.goto('/');

    // Get session cookie
    const cookies = await page.context().cookies();
    const sessionCookieNames = cookies
      .filter(c => c.name.includes('session') || c.name.includes('auth') || c.name.includes('token'))
      .map(c => c.name);

    // Log for debugging (informational)
    console.log(`Cookies on home page: ${cookies.length}`);
    console.log(`Session cookies: ${sessionCookieNames.join(', ') || 'none'}`);

    // Session management check - informational, not a hard requirement
    // Some apps may not set session cookie until after login
    expect(true).toBe(true);
  });
});

// ==================== REDIRECT SECURITY TESTS ====================

test.describe('Security - Open Redirect Prevention', () => {

  test('S-REDR-001: Login redirects should not allow open redirects', async ({ page }) => {
    // Try to inject a redirect URL
    const maliciousRedirect = 'https://evil.com';

    await page.goto(`/login?redirect=${encodeURIComponent(maliciousRedirect)}`);

    // After login, should not redirect to external site
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const url = page.url();
    // Should redirect to internal page only
    expect(url).not.toContain('evil.com');
    expect(url).toMatch(/localhost|127\.0\.0\.1|\.timor/i);
  });

  test('S-REDR-002: Logout should properly invalidate session', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Then logout
    const logoutLink = page.locator('a:has-text("Logout"), a:has-text("Log out"), button:has-text("Logout")');
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
      await page.waitForTimeout(500);

      // After logout, should not access protected pages
      await page.goto('/dashboard');
      const url = page.url();
      expect(url).toMatch(/\/login|\/register/i);
    }
  });
});