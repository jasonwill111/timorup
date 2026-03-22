import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:8787';

// ==================== AUTH API TESTS ====================

test.describe('API - Authentication', () => {
  test('POST /api/auth/signup should reject invalid email', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/auth/sign-up`, {
      data: {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      }
    });
    // Should return error for invalid email
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/auth/signup should reject short password', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/auth/sign-up`, {
      data: {
        email: 'test@example.com',
        password: '123', // Too short - minimum 8 characters
        name: 'Test User'
      }
    });
    // Should return error for short password
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/auth/signin should reject missing credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/auth/sign-in`, {
      data: {}
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /api/auth/get-session should work without auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/auth/get-session`);
    // Should return 200 even without session
    expect([200, 401]).toContain(response.status());
  });
});

// ==================== BUSINESSES API TESTS ====================

test.describe('API - Businesses', () => {
  test('GET /api/businesses should return list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
  });

  test('GET /api/businesses should support search query', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?search=test`);
    expect(response.status()).toBe(200);
  });

  test('GET /api/businesses should support category filter', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?category=test-category`);
    expect(response.status()).toBe(200);
  });

  test('GET /api/businesses/:id should return business', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses/non-existent-id`);
    // Should return either 404 or 200 with data
    expect([200, 404]).toContain(response.status());
  });

  test('GET /api/businesses/featured should return featured businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses/featured`);
    expect(response.status()).toBe(200);
  });
});

// ==================== CATEGORIES API TESTS ====================

test.describe('API - Categories', () => {
  test('GET /api/categories should return list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/categories`);
    expect(response.status()).toBe(200);
  });

  test('GET /api/categories/:slug should return category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/categories/test`);
    expect([200, 404]).toContain(response.status());
  });
});

// ==================== MEDIA API TESTS ====================

test.describe('API - Media', () => {
  test('GET /api/media should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/media`);
    expect([401, 403]).toContain(response.status());
  });

  test('POST /api/media/upload should require auth', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/media/upload`);
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/media/count/:businessId should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/media/count/test-business-id`);
    expect([401, 403]).toContain(response.status());
  });
});

// ==================== PRODUCTS API TESTS ====================

test.describe('API - Products', () => {
  test('GET /api/products should return list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/products`);
    expect(response.status()).toBe(200);
  });

  test('GET /api/products/:id should return product', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/products/non-existent`);
    expect([200, 404]).toContain(response.status());
  });
});

// ==================== REVIEWS API TESTS ====================

test.describe('API - Reviews', () => {
  test('GET /api/reviews should return list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/reviews?businessId=test`);
    expect(response.status()).toBe(200);
  });

  test('POST /api/reviews should require auth', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/reviews`, {
      data: { businessId: 'test', rating: 5 }
    });
    expect([401, 403]).toContain(response.status());
  });
});

// ==================== ORDERS API TESTS ====================

test.describe('API - Orders', () => {
  test('GET /api/orders should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/orders`);
    expect([401, 403]).toContain(response.status());
  });

  test('POST /api/orders should require auth', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/orders`, {
      data: { businessId: 'test', planType: 'basic' }
    });
    expect([401, 403]).toContain(response.status());
  });
});

// ==================== ACCOUNT API TESTS ====================

test.describe('API - Account', () => {
  test('GET /api/account should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/account`);
    expect([401, 403]).toContain(response.status());
  });
});

// ==================== ADMIN API TESTS ====================

test.describe('API - Admin', () => {
  test('GET /api/admin/users should require admin auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users`);
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/admin/businesses should require admin auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/businesses`);
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/admin/orders should require admin auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/orders`);
    expect([401, 403]).toContain(response.status());
  });
});

// ==================== BANNERS API TESTS ====================

test.describe('API - Banners', () => {
  test('GET /api/banners should return list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/banners`);
    expect(response.status()).toBe(200);
  });
});

// ==================== SITEMAP API TESTS ====================

test.describe('API - Sitemap', () => {
  test('GET /sitemap.xml should return sitemap', async ({ request }) => {
    const response = await request.get(`${API_BASE}/sitemap.xml`);
    expect(response.status()).toBe(200);
  });
});
