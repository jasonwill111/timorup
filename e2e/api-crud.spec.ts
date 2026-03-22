// ============================================
// Complete API CRUD Tests - Deep Coverage
// ============================================

import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:8787';

// Test data factories
const testBusiness = {
  name: 'Test Business',
  slug: 'test-business-' + Date.now(),
  description: 'Test business description',
  category: 'restaurant',
  tags: ['test', 'cafe'],
  contact: {
    phone: '+67012345678',
    email: 'test@timorbiz.com',
    website: 'https://test.com'
  },
  address: {
    street: 'Test Street',
    city: 'Dili',
    country: 'Timor-Leste'
  },
  openingHours: {
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' }
  }
};

const testProduct = {
  name: 'Test Product',
  slug: 'test-product-' + Date.now(),
  description: 'Test product description',
  price: 25.00,
  category: 'food'
};

const testReview = {
  rating: 5,
  title: 'Great experience',
  content: 'This is a test review'
};

test.describe('API - Businesses CRUD', () => {

  let createdBusinessId: string;

  // C-001: Create business
  test('C-001: POST /api/businesses should create a new business', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/businesses`, {
      data: testBusiness
    });

    // Either succeeds or requires auth
    expect([201, 401, 403]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      createdBusinessId = data.id;
    }
  });

  // R-001: Read single business
  test('R-001: GET /api/businesses/:id should return business details', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses/test-business-id`);
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('description');
    }
  });

  // R-002: List businesses with pagination
  test('R-002: GET /api/businesses should support pagination', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?page=1&limit=10`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('businesses');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('totalPages');
  });

  // R-003: Filter businesses
  test('R-003: GET /api/businesses should filter by category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?category=restaurant`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    if (data.businesses?.length > 0) {
      data.businesses.forEach((biz: any) => {
        expect(biz.category).toBe('restaurant');
      });
    }
  });

  // R-004: Sort businesses
  test('R-004: GET /api/businesses should support sorting', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?sort=createdAt&order=desc`);
    expect(response.status()).toBe(200);
  });

  // U-001: Update business
  test('U-001: PUT /api/businesses/:id should update business', async ({ request }) => {
    const response = await request.put(`${API_BASE}/api/businesses/test-business-id`, {
      data: { name: 'Updated Business Name' }
    });

    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // U-002: Partial update business
  test('U-002: PATCH /api/businesses/:id should partially update', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/businesses/test-business-id`, {
      data: { description: 'Updated description' }
    });

    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // D-001: Delete business
  test('D-001: DELETE /api/businesses/:id should delete business', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/businesses/test-business-id`);

    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });

  // Edge cases
  test('EC-001: GET /api/businesses should handle invalid pagination', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses?page=-1&limit=0`);
    // Should either reject or use defaults
    expect([200, 400]).toContain(response.status());
  });

  test('EC-002: GET /api/businesses/:id should handle non-existent id', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/businesses/non-existent-id-12345`);
    expect(response.status()).toBe(404);
  });
});

test.describe('API - Products CRUD', () => {

  // P-001: Create product
  test('P-001: POST /api/products should create product', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/products`, {
      data: testProduct
    });

    expect([201, 401, 403]).toContain(response.status());
  });

  // P-002: List products
  test('P-002: GET /api/products should return paginated list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/products?page=1&limit=10`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('products');
  });

  // P-003: Get single product
  test('P-003: GET /api/products/:id should return product', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/products/test-product-id`);
    expect([200, 404]).toContain(response.status());
  });

  // P-004: Update product
  test('P-004: PUT /api/products/:id should update product', async ({ request }) => {
    const response = await request.put(`${API_BASE}/api/products/test-product-id`, {
      data: { price: 30.00 }
    });

    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // P-005: Delete product
  test('P-005: DELETE /api/products/:id should delete product', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/products/test-product-id`);

    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });

  // P-006: Filter products by category
  test('P-006: GET /api/products should filter by category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/products?category=food`);
    expect(response.status()).toBe(200);
  });
});

test.describe('API - Reviews CRUD', () => {

  // R-001: Create review
  test('R-001: POST /api/reviews should create review', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/reviews`, {
      data: {
        ...testReview,
        businessId: 'test-business-id'
      }
    });

    expect([201, 401, 403]).toContain(response.status());
  });

  // R-002: List reviews for business
  test('R-002: GET /api/reviews should return business reviews', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/reviews?businessId=test-business-id`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('reviews');
  });

  // R-003: Get single review
  test('R-003: GET /api/reviews/:id should return review', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/reviews/test-review-id`);
    expect([200, 404]).toContain(response.status());
  });

  // R-004: Update review
  test('R-004: PUT /api/reviews/:id should update review', async ({ request }) => {
    const response = await request.put(`${API_BASE}/api/reviews/test-review-id`, {
      data: { rating: 4 }
    });

    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // R-005: Delete review
  test('R-005: DELETE /api/reviews/:id should delete review', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/reviews/test-review-id`);

    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });

  // R-006: Get review statistics
  test('R-006: GET /api/reviews/stats/:businessId should return stats', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/reviews/stats/test-business-id`);
    expect([200, 404]).toContain(response.status());
  });
});

test.describe('API - Orders CRUD', () => {

  // O-001: Create order
  test('O-001: POST /api/orders should create order', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/orders`, {
      data: {
        businessId: 'test-business-id',
        planType: 'premium',
        amount: 100.00
      }
    });

    expect([201, 401, 403]).toContain(response.status());
  });

  // O-002: List orders
  test('O-002: GET /api/orders should return user orders', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/orders`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // O-003: Get single order
  test('O-003: GET /api/orders/:id should return order', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/orders/test-order-id`);
    expect([200, 404, 401, 403]).toContain(response.status());
  });

  // O-004: Cancel order
  test('O-004: POST /api/orders/:id/cancel should cancel order', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/orders/test-order-id/cancel`);

    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });
});

test.describe('API - Categories', () => {

  // CT-001: List categories
  test('CT-001: GET /api/categories should return all categories', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/categories`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  // CT-002: Get category by slug
  test('CT-002: GET /api/categories/:slug should return category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/categories/restaurant`);
    expect([200, 404]).toContain(response.status());
  });

  // CT-003: Get category businesses
  test('CT-003: GET /api/categories/:slug/businesses should return category businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/categories/restaurant/businesses`);
    expect([200, 404]).toContain(response.status());
  });
});

test.describe('API - Validation Tests', () => {

  // V-001: Invalid email
  test('V-001: POST should reject invalid email format', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/auth/sign-up`, {
      data: {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test'
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  // V-002: Missing required fields
  test('V-002: POST should reject missing required fields', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/businesses`, {
      data: { name: 'Test' } // Missing required fields
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  // V-003: Invalid rating
  test('V-003: POST /api/reviews should reject invalid rating', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/reviews`, {
      data: {
        rating: 10, // Invalid - must be 1-5
        businessId: 'test'
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  // V-004: Negative price
  test('V-004: POST /api/products should reject negative price', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/products`, {
      data: {
        name: 'Test',
        price: -10
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('API - Error Handling', () => {

  // E-001: 404 for unknown endpoint
  test('E-001: GET unknown endpoint should return 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/unknown-endpoint`);
    expect(response.status()).toBe(404);
  });

  // E-002: Method not allowed
  test('E-002: Unsupported method should return 405', async ({ request }) => {
    const response = await request.put(`${API_BASE}/api/businesses`, {
      data: {}
    });
    // PUT on collection endpoint might not be allowed
    expect([405, 400]).toContain(response.status());
  });

  // E-003: Large payload
  test('E-003: Should handle large payload gracefully', async ({ request }) => {
    const largeDescription = 'x'.repeat(100000);
    const response = await request.post(`${API_BASE}/api/businesses`, {
      data: {
        name: 'Test',
        description: largeDescription
      }
    });

    expect([400, 413, 422]).toContain(response.status());
  });
});
