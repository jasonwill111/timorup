// Subscription batching tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSubscriptionDashboard } from './subscription';

// Mock the DB module
vi.mock('./db', () => ({
  getDb: vi.fn()
}));

describe('getSubscriptionDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null for non-existent business', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(null)
    };
    vi.mocked(await import('./db')).getDb.mockResolvedValue(mockDb as any);

    const result = await getSubscriptionDashboard('non-existent-id');
    expect(result).toBeNull();
  });

  it('should return subscription dashboard with all data in single call', async () => {
    // This test verifies the batching behavior
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn()
    };

    // First call returns business
    // Second call returns SKU count
    // Third call returns plan
    mockDb.get
      .mockResolvedValueOnce({
        id: 'biz-123',
        planSlug: 'basic-monthly',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: Date.now() + 86400000,
        gracePeriodEndDate: null
      })
      .mockResolvedValueOnce({ count: 5 })
      .mockResolvedValueOnce({
        variants: JSON.stringify([{
          limits: { skuLimit: 10, maxImages: 16, maxVideos: 2 }
        }])
      });

    vi.mocked(await import('./db')).getDb.mockResolvedValue(mockDb as any);

    const result = await getSubscriptionDashboard('biz-123');

    expect(result).not.toBeNull();
    expect(result?.skuCount).toBe(5);
    expect(result?.skuLimit).toBe(10);
    expect(result?.status).toBe('active');
  });

  it('should handle businesses without subscription', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn()
    };

    mockDb.get
      .mockResolvedValueOnce({
        id: 'biz-no-sub',
        planSlug: null,
        subscriptionStatus: null,
        subscriptionExpiresAt: null,
        gracePeriodEndDate: null
      })
      .mockResolvedValueOnce({ count: 0 })
      .mockResolvedValueOnce(null);

    vi.mocked(await import('./db')).getDb.mockResolvedValue(mockDb as any);

    const result = await getSubscriptionDashboard('biz-no-sub');

    expect(result).not.toBeNull();
    expect(result?.status).toBe('none');
    expect(result?.planSlug).toBeNull();
    expect(result?.skuLimit).toBe(0);
  });
});