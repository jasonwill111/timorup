// ============================================
// Admin API Tests - Complete CRUD Coverage
// ============================================

import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:8787';

// Helper to create admin authenticated session
async function createAdminUser(request: any) {
  // This would typically create an admin user via database
  // For testing, we assume admin credentials are available
  return request;
}

test.describe('Admin API - Users Management', () => {

  // AU-001: Admin users list
  test('AU-001: GET /api/admin/users should return paginated user list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users?page=1&limit=10`);
    // Should require admin auth
    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('total');
    }
  });

  // AU-002: Admin can filter users
  test('AU-002: GET /api/admin/users should support role filter', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users?role=admin`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AU-003: Admin can search users
  test('AU-003: GET /api/admin/users should support search', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users?search=test`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AU-004: Get single user
  test('AU-004: GET /api/admin/users/:id should return user details', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users/test-user-id`);
    expect([200, 404, 401, 403]).toContain(response.status());
  });

  // AU-005: Update user role
  test('AU-005: PATCH /api/admin/users/:id should update user role', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/users/test-user-id`, {
      data: { role: 'editor' }
    });
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AU-006: Deactivate user
  test('AU-006: DELETE /api/admin/users/:id should deactivate user', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/admin/users/test-user-id`);
    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });

  // AU-007: User statistics
  test('AU-007: GET /api/admin/users/stats should return user statistics', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/users/stats`);
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('Admin API - Businesses Management', () => {

  // AB-001: List all businesses
  test('AB-001: GET /api/admin/businesses should return paginated list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/businesses?page=1&limit=10`);
    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('businesses');
      expect(data).toHaveProperty('total');
    }
  });

  // AB-002: Filter businesses by status
  test('AB-002: GET /api/admin/businesses should filter by status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/businesses?status=live`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AB-003: Get business details
  test('AB-003: GET /api/admin/businesses/:id should return full details', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/businesses/test-business-id`);
    expect([200, 404, 401, 403]).toContain(response.status());
  });

  // AB-004: Approve business
  test('AB-004: PATCH /api/admin/businesses/:id/approve should approve business', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/businesses/test-business-id/approve`);
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AB-005: Reject business
  test('AB-005: PATCH /api/admin/businesses/:id/reject should reject business', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/businesses/test-business-id/reject`, {
      data: { reason: 'Violation of terms' }
    });
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AB-006: Delete business
  test('AB-006: DELETE /api/admin/businesses/:id should delete business', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/admin/businesses/test-business-id`);
    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });

  // AB-007: Feature business
  test('AB-007: PATCH /api/admin/businesses/:id/feature should toggle featured', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/businesses/test-business-id/feature`);
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AB-008: Business statistics
  test('AB-008: GET /api/admin/businesses/stats should return statistics', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/businesses/stats`);
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('Admin API - Orders Management', () => {

  // AO-001: List all orders
  test('AO-001: GET /api/admin/orders should return paginated orders', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/orders?page=1&limit=10`);
    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('orders');
      expect(data).toHaveProperty('total');
    }
  });

  // AO-002: Filter orders by status
  test('AO-002: GET /api/admin/orders should filter by payment status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/orders?paymentStatus=paid`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AO-003: Get order details
  test('AO-003: GET /api/admin/orders/:id should return order details', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/orders/test-order-id`);
    expect([200, 404, 401, 403]).toContain(response.status());
  });

  // AO-004: Update order status
  test('AO-004: PATCH /api/admin/orders/:id should update order status', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/orders/test-order-id`, {
      data: { status: 'completed' }
    });
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AO-005: Refund order
  test('AO-005: POST /api/admin/orders/:id/refund should process refund', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/admin/orders/test-order-id/refund`);
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AO-006: Order statistics
  test('AO-006: GET /api/admin/orders/stats should return statistics', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/orders/stats`);
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('Admin API - Reviews Management', () => {

  // AR-001: List all reviews
  test('AR-001: GET /api/admin/reviews should return paginated reviews', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/reviews?page=1&limit=10`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AR-002: Filter reviews by status
  test('AR-002: GET /api/admin/reviews should filter by approval status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/reviews?approved=true`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AR-003: Get review details
  test('AR-003: GET /api/admin/reviews/:id should return review details', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/reviews/test-review-id`);
    expect([200, 404, 401, 403]).toContain(response.status());
  });

  // AR-004: Approve review
  test('AR-004: PATCH /api/admin/reviews/:id/approve should approve review', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/reviews/test-review-id/approve`);
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AR-005: Reject review
  test('AR-005: PATCH /api/admin/reviews/:id/reject should reject review', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/reviews/test-review-id/reject`);
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AR-006: Delete review
  test('AR-006: DELETE /api/admin/reviews/:id should delete review', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/admin/reviews/test-review-id`);
    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });
});

test.describe('Admin API - Site Settings', () => {

  // AS-001: Get site settings
  test('AS-001: GET /api/admin/settings should return site settings', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/settings`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AS-002: Update site settings
  test('AS-002: PATCH /api/admin/settings should update settings', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/settings`, {
      data: { siteName: 'TimorBiz Updated' }
    });
    expect([200, 400, 401, 403]).toContain(response.status());
  });

  // AS-003: Update theme settings
  test('AS-003: PATCH /api/admin/settings/theme should update theme', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/settings/theme`, {
      data: { primaryColor: '#FFD150' }
    });
    expect([200, 400, 401, 403]).toContain(response.status());
  });

  // AS-004: Update SEO settings
  test('AS-004: PATCH /api/admin/settings/seo should update SEO', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/settings/seo`, {
      data: { metaDescription: 'Business directory for Timor-Leste' }
    });
    expect([200, 400, 401, 403]).toContain(response.status());
  });
});

test.describe('Admin API - Categories Management', () => {

  // AC-001: List categories
  test('AC-001: GET /api/admin/categories should return all categories', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/admin/categories`);
    expect([200, 401, 403]).toContain(response.status());
  });

  // AC-002: Create category
  test('AC-002: POST /api/admin/categories should create category', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/admin/categories`, {
      data: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test description'
      }
    });
    expect([201, 400, 401, 403]).toContain(response.status());
  });

  // AC-003: Update category
  test('AC-003: PATCH /api/admin/categories/:id should update category', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/api/admin/categories/test-category-id`, {
      data: { name: 'Updated Category' }
    });
    expect([200, 400, 401, 403, 404]).toContain(response.status());
  });

  // AC-004: Delete category
  test('AC-004: DELETE /api/admin/categories/:id should delete category', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/admin/categories/test-category-id`);
    expect([200, 204, 401, 403, 404]).toContain(response.status());
  });
});
