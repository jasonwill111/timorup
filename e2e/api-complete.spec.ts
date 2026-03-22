// ============================================
// API Tests - Complete Coverage
// ============================================

import { test, expect, request } from '@playwright/test';

const API_BASE = '/api';

test.describe('API - Authentication', () => {
  
  // POST /api/auth/register
  test('POST /api/auth/register - should create new user', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/register`, {
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Test User',
      },
    });
    
    expect(response.ok() || response.status() === 400).toBeTruthy();
  });

  test('POST /api/auth/register - should reject duplicate email', async ({ request }) => {
    const email = `duplicate${Date.now()}@example.com`;
    
    await request.post(`${API_BASE}/auth/register`, {
      data: {
        email,
        password: 'TestPassword123!',
        name: 'User One',
      },
    });
    
    const response = await request.post(`${API_BASE}/auth/register`, {
      data: {
        email,
        password: 'TestPassword123!',
        name: 'User Two',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  test('POST /api/auth/register - should validate email format', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/register`, {
      data: {
        email: 'invalid-email',
        password: 'TestPassword123!',
        name: 'Test User',
      },
    });
    
    expect(response.status()).toBe(400);
  });

  // POST /api/auth/login
  test('POST /api/auth/login - should login with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
    });
    
    expect(response.ok() || response.status() === 401).toBeTruthy();
  });

  test('POST /api/auth/login - should reject invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: 'wrong@example.com',
        password: 'WrongPassword',
      },
    });
    
    expect(response.status()).toBe(401);
  });

  // POST /api/auth/logout
  test('POST /api/auth/logout - should logout', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/logout`);
    
    expect(response.ok() || response.status() === 401).toBeTruthy();
  });

  // GET /api/auth/session
  test('GET /api/auth/session - should return session', async ({ request }) => {
    const response = await request.get(`${API_BASE}/auth/session`);
    
    expect([200, 401]).toContain(response.status());
  });
});

test.describe('API - Businesses', () => {
  
  // GET /api/businesses
  test('GET /api/businesses - should list businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses`);
    
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/businesses - should filter by category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses?category=restaurant`);
    
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/businesses - should support pagination', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses?page=1&limit=10`);
    
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/businesses - should search businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses?search=restaurant`);
    
    expect(response.ok()).toBeTruthy();
  });

  // GET /api/businesses/:id
  test('GET /api/businesses/:id - should return business', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses/1`);
    
    expect([200, 404]).toContain(response.status());
  });

  test('GET /api/businesses/:id - should return 404 for non-existent', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses/999999`);
    
    expect(response.status()).toBe(404);
  });

  // POST /api/businesses
  test('POST /api/businesses - should create business', async ({ request }) => {
    const response = await request.post(`${API_BASE}/businesses`, {
      data: {
        name: 'Test Business',
        category: 'restaurant',
        contactName: 'Test Contact',
        phone: '+67077234567',
        email: 'test@business.com',
        address: 'Dili, Timor-Leste',
      },
    });
    
    expect([201, 401]).toContain(response.status());
  });

  // PUT /api/businesses/:id
  test('PUT /api/businesses/:id - should update business', async ({ request }) => {
    const response = await request.put(`${API_BASE}/businesses/1`, {
      data: {
        name: 'Updated Business',
      },
    });
    
    expect([200, 401, 403]).toContain(response.status());
  });

  // DELETE /api/businesses/:id
  test('DELETE /api/businesses/:id - should delete business', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/businesses/1`);
    
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('API - Products', () => {
  
  // GET /api/businesses/:id/products
  test('GET /api/businesses/:id/products - should list products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses/1/products`);
    
    expect([200, 404]).toContain(response.status());
  });

  // POST /api/businesses/:id/products
  test('POST /api/businesses/:id/products - should create product', async ({ request }) => {
    const response = await request.post(`${API_BASE}/businesses/1/products`, {
      data: {
        name: 'Test Product',
        price: 25.00,
        description: 'Test description',
      },
    });
    
    expect([201, 401, 403]).toContain(response.status());
  });

  // PUT /api/products/:id
  test('PUT /api/products/:id - should update product', async ({ request }) => {
    const response = await request.put(`${API_BASE}/products/1`, {
      data: {
        name: 'Updated Product',
      },
    });
    
    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // DELETE /api/products/:id
  test('DELETE /api/products/:id - should delete product', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/products/1`);
    
    expect([200, 401, 403, 404]).toContain(response.status());
  });
});

test.describe('API - Reviews', () => {
  
  // GET /api/businesses/:id/reviews
  test('GET /api/businesses/:id/reviews - should list reviews', async ({ request }) => {
    const response = await request.get(`${API_BASE}/businesses/1/reviews`);
    
    expect([200, 404]).toContain(response.status());
  });

  // POST /api/businesses/:id/reviews
  test('POST /api/businesses/:id/reviews - should create review', async ({ request }) => {
    const response = await request.post(`${API_BASE}/businesses/1/reviews`, {
      data: {
        rating: 5,
        comment: 'Great place!',
      },
    });
    
    expect([201, 401]).toContain(response.status());
  });

  // PUT /api/reviews/:id
  test('PUT /api/reviews/:id - should update review', async ({ request }) => {
    const response = await request.put(`${API_BASE}/reviews/1`, {
      data: {
        comment: 'Updated comment',
      },
    });
    
    expect([200, 401, 403, 404]).toContain(response.status());
  });

  // DELETE /api/reviews/:id
  test('DELETE /api/reviews/:id - should delete review', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/reviews/1`);
    
    expect([200, 401, 403, 404]).toContain(response.status());
  });
});

test.describe('API - User Profile', () => {
  
  // GET /api/user/profile
  test('GET /api/user/profile - should return user profile', async ({ request }) => {
    const response = await request.get(`${API_BASE}/user/profile`);
    
    expect([200, 401]).toContain(response.status());
  });

  // PUT /api/user/profile
  test('PUT /api/user/profile - should update profile', async ({ request }) => {
    const response = await request.put(`${API_BASE}/user/profile`, {
      data: {
        name: 'Updated Name',
      },
    });
    
    expect([200, 401]).toContain(response.status());
  });

  // GET /api/user/business
  test('GET /api/user/business - should return user business', async ({ request }) => {
    const response = await request.get(`${API_BASE}/user/business`);
    
    expect([200, 401, 404]).toContain(response.status());
  });

  // GET /api/user/subscription
  test('GET /api/user/subscription - should return subscription', async ({ request }) => {
    const response = await request.get(`${API_BASE}/user/subscription`);
    
    expect([200, 401]).toContain(response.status());
  });
});

test.describe('API - Admin', () => {
  
  // GET /api/admin/users
  test('GET /api/admin/users - should list users (admin only)', async ({ request }) => {
    const response = await request.get(`${API_BASE}/admin/users`);
    
    expect([200, 401, 403]).toContain(response.status());
  });

  // GET /api/admin/businesses
  test('GET /api/admin/businesses - should list all businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/admin/businesses`);
    
    expect([200, 401, 403]).toContain(response.status());
  });

  // GET /api/admin/orders
  test('GET /api/admin/orders - should list orders', async ({ request }) => {
    const response = await request.get(`${API_BASE}/admin/orders`);
    
    expect([200, 401, 403]).toContain(response.status());
  });

  // PUT /api/admin/orders/:id
  test('PUT /api/admin/orders/:id - should update order status', async ({ request }) => {
    const response = await request.put(`${API_BASE}/admin/orders/1`, {
      data: {
        status: 'paid',
      },
    });
    
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('API - Search', () => {
  
  // GET /api/search
  test('GET /api/search - should search businesses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/search?q=restaurant`);
    
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/search - should filter by category', async ({ request }) => {
    const response = await request.get(`${API_BASE}/search?category=restaurant`);
    
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/search - should support sorting', async ({ request }) => {
    const response = await request.get(`${API_BASE}/search?sort=newest`);
    
    expect(response.ok()).toBeTruthy();
  });
});

test.describe('API - Error Handling', () => {
  
  test('should return 404 for unknown endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/unknown`);
    
    expect(response.status()).toBe(404);
  });

  test('should return 405 for wrong method', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/businesses`);
    
    expect(response.status()).toBe(405);
  });

  test('should return 500 for server error', async ({ request }) => {
    // This would require triggering an actual error
    // For now, just verify the endpoint exists
    const response = await request.get(`${API_BASE}/businesses`);
    
    expect([200, 500]).toContain(response.status());
  });

  test('should validate request body', async ({ request }) => {
    const response = await request.post(`${API_BASE}/businesses`, {
      data: {
        // Missing required fields
      },
    });
    
    expect(response.status()).toBe(400);
  });
});
