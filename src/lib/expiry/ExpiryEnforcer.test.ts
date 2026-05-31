/**
 * Tests for ExpiryEnforcer - RED phase (failing tests first)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExpiryEnforcer } from './ExpiryEnforcer';
import { GRACE_PERIOD_DAYS } from './types';
import type { SubscriptionData } from './types';

// Mock system time for consistent tests
const mockNow = new Date('2026-05-09T12:00:00Z');

describe('ExpiryEnforcer - TDD RED Phase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const enforcer = new ExpiryEnforcer();

  describe('isInGracePeriod', () => {
    it('returns true for expired subscription within 60-day grace period', () => {
      // 30 days ago - within grace period
      const expired30DaysAgo = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired30DaysAgo,
        gracePeriodEndDate: null,
      };

      expect(enforcer.isInGracePeriod(subscription)).toBe(true);
    });

    it('returns false for expired subscription past 60-day grace period', () => {
      // 70 days ago - past grace period
      const expired70DaysAgo = new Date(mockNow.getTime() - 70 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired70DaysAgo,
        gracePeriodEndDate: null,
      };

      expect(enforcer.isInGracePeriod(subscription)).toBe(false);
    });

    it('returns false for active subscription', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      expect(enforcer.isInGracePeriod(subscription)).toBe(false);
    });

    it('returns false for cancelled subscription', () => {
      const subscription: SubscriptionData = {
        status: 'cancelled',
        expiresAt: new Date('2026-04-09'),
        gracePeriodEndDate: null,
      };

      expect(enforcer.isInGracePeriod(subscription)).toBe(false);
    });
  });

  describe('isPastGracePeriod', () => {
    it('returns false for exactly 60 days ago (boundary)', () => {
      const exactly60DaysAgo = new Date(mockNow.getTime() - 60 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: exactly60DaysAgo,
        gracePeriodEndDate: null,
      };

      // Should NOT be past grace - grace ends at end of 60th day
      expect(enforcer.isPastGracePeriod(subscription)).toBe(false);
    });

    it('returns true for 61 days ago', () => {
      const days61Ago = new Date(mockNow.getTime() - 61 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: days61Ago,
        gracePeriodEndDate: null,
      };

      expect(enforcer.isPastGracePeriod(subscription)).toBe(true);
    });

    it('returns false for active subscription', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      expect(enforcer.isPastGracePeriod(subscription)).toBe(false);
    });
  });

  describe('canCreateSku', () => {
    it('rejects null subscription', () => {
      const result = enforcer.canCreateSku(null, 0, 10);

      expect(result.can).toBe(false);
      expect(result.reason).toBe('Business not found');
    });

    it('rejects status=none', () => {
      const subscription: SubscriptionData = {
        status: 'none',
        expiresAt: null,
        gracePeriodEndDate: null,
      };

      const result = enforcer.canCreateSku(subscription, 0, 10);

      expect(result.can).toBe(false);
      expect(result.reason).toBe('Business is pending payment confirmation');
    });

    it('allows active subscription within SKU limit', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      const result = enforcer.canCreateSku(subscription, 0, 10);

      expect(result.can).toBe(true);
    });

    it('rejects expired status regardless of grace period', () => {
      // In grace period
      const expired30DaysAgo = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired30DaysAgo,
        gracePeriodEndDate: null,
      };

      const result = enforcer.canCreateSku(subscription, 0, 10);

      expect(result.can).toBe(false);
      expect(result.reason).toBe('Subscription expired');
    });

    it('rejects cancelled status', () => {
      const subscription: SubscriptionData = {
        status: 'cancelled',
        expiresAt: null,
        gracePeriodEndDate: null,
      };

      const result = enforcer.canCreateSku(subscription, 0, 10);

      expect(result.can).toBe(false);
      expect(result.reason).toBe('Subscription cancelled');
    });

    it('rejects when SKU limit reached', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      const result = enforcer.canCreateSku(subscription, 10, 10);

      expect(result.can).toBe(false);
      expect(result.reason).toContain('SKU limit reached');
    });
  });

  describe('canEditBusiness', () => {
    it('rejects null subscription', () => {
      const result = enforcer.canEditBusiness(null);

      expect(result.can).toBe(false);
      expect(result.reason).toBe('Business not found');
    });

    it('allows active subscription', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      const result = enforcer.canEditBusiness(subscription);

      expect(result.can).toBe(true);
    });

    it('rejects expired subscription in grace period', () => {
      const expired30DaysAgo = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired30DaysAgo,
        gracePeriodEndDate: null,
      };

      const result = enforcer.canEditBusiness(subscription);

      expect(result.can).toBe(false);
      expect(result.reason).toContain('Cannot edit during grace period');
    });

    it('allows expired subscription past grace period', () => {
      // past grace period allows editing (but SKU creation is still blocked)
      const expired70DaysAgo = new Date(mockNow.getTime() - 70 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired70DaysAgo,
        gracePeriodEndDate: null,
      };

      const result = enforcer.canEditBusiness(subscription);

      expect(result.can).toBe(true);
    });
  });

  describe('getDaysRemainingInGrace', () => {
    it('returns 0 for active subscription', () => {
      const subscription: SubscriptionData = {
        status: 'active',
        expiresAt: new Date('2026-06-09'),
        gracePeriodEndDate: null,
      };

      expect(enforcer.getDaysRemainingInGrace(subscription)).toBe(0);
    });

    it('returns positive number for expired within grace', () => {
      const expired30DaysAgo = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired30DaysAgo,
        gracePeriodEndDate: null,
      };

      // 60 - 30 = 30 days remaining
      expect(enforcer.getDaysRemainingInGrace(subscription)).toBe(30);
    });

    it('returns 0 for expired past grace', () => {
      const expired70DaysAgo = new Date(mockNow.getTime() - 70 * 24 * 60 * 60 * 1000);

      const subscription: SubscriptionData = {
        status: 'expired',
        expiresAt: expired70DaysAgo,
        gracePeriodEndDate: null,
      };

      expect(enforcer.getDaysRemainingInGrace(subscription)).toBe(0);
    });
  });

  describe('GRACE_PERIOD_DAYS constant', () => {
    it('should be 60 days', () => {
      expect(GRACE_PERIOD_DAYS).toBe(60);
    });
  });
});