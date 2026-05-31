/**
 * Expiry module types
 * Subscription status and permission result types for ExpiryEnforcer
 */

export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'cancelled';

export interface SubscriptionData {
  status: SubscriptionStatus;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
}

export interface PermissionResult {
  can: boolean;
  reason?: string;
}

export const GRACE_PERIOD_DAYS = 60;