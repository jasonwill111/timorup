/**
 * ExpiryEnforcer - Subscription expiry logic module
 * Centralizes all subscription expiry and permission checks
 */
import { GRACE_PERIOD_DAYS } from './types';
import type { SubscriptionData, PermissionResult } from './types';

export class ExpiryEnforcer {
  protected readonly gracePeriodDays: number = GRACE_PERIOD_DAYS;

  /**
   * Check if subscription is within the 60-day grace period after expiry
   */
  isInGracePeriod(subscription: SubscriptionData): boolean {
    if (subscription.status === 'none') return false;
    if (subscription.status === 'cancelled') return false;

    const now = new Date();

    // If gracePeriodEndDate is explicitly set, use it
    if (subscription.gracePeriodEndDate) {
      return now < subscription.gracePeriodEndDate && subscription.expiresAt && now > subscription.expiresAt;
    }

    // Otherwise calculate from expiresAt
    if (!subscription.expiresAt) return false;

    const gracePeriodEnd = new Date(subscription.expiresAt.getTime() + this.gracePeriodDays * 24 * 60 * 60 * 1000);
    return now < gracePeriodEnd && subscription.expiresAt < now;
  }

  /**
   * Check if subscription has passed the 60-day grace period
   */
  isPastGracePeriod(subscription: SubscriptionData): boolean {
    if (subscription.status !== 'expired') return false;

    const now = new Date();

    // If gracePeriodEndDate is explicitly set, use it
    if (subscription.gracePeriodEndDate) {
      return now > subscription.gracePeriodEndDate;
    }

    // Otherwise calculate from expiresAt
    if (!subscription.expiresAt) return false;

    const gracePeriodEnd = new Date(subscription.expiresAt.getTime() + this.gracePeriodDays * 24 * 60 * 60 * 1000);
    return now > gracePeriodEnd;
  }

  /**
   * Check if user can create a SKU for the business
   */
  canCreateSku(
    subscription: SubscriptionData | null,
    skuCount: number,
    skuLimit: number
  ): PermissionResult {
    if (!subscription) {
      return { can: false, reason: 'Business not found' };
    }

    if (subscription.status === 'none') {
      return { can: false, reason: 'Business is pending payment confirmation' };
    }

    if (subscription.status === 'cancelled') {
      return { can: false, reason: 'Subscription cancelled' };
    }

    if (subscription.status === 'expired') {
      return { can: false, reason: 'Subscription expired' };
    }

    // Check SKU limit
    if (skuLimit > 0 && skuCount >= skuLimit) {
      return { can: false, reason: `SKU limit reached (${skuCount}/${skuLimit})` };
    }

    return { can: true };
  }

  /**
   * Check if user can edit business content
   * Cannot edit during grace period - must renew subscription first
   */
  canEditBusiness(subscription: SubscriptionData | null): PermissionResult {
    if (!subscription) {
      return { can: false, reason: 'Business not found' };
    }

    // Cannot edit during grace period
    if (this.isInGracePeriod(subscription)) {
      return { can: false, reason: 'Cannot edit during grace period. Please renew your subscription.' };
    }

    return { can: true };
  }

  /**
   * Get days remaining in grace period
   */
  getDaysRemainingInGrace(subscription: SubscriptionData): number {
    if (!this.isInGracePeriod(subscription)) {
      return 0;
    }

    const now = new Date();
    let gracePeriodEnd: Date;

    if (subscription.gracePeriodEndDate) {
      gracePeriodEnd = subscription.gracePeriodEndDate;
    } else if (subscription.expiresAt) {
      gracePeriodEnd = new Date(subscription.expiresAt.getTime() + this.gracePeriodDays * 24 * 60 * 60 * 1000);
    } else {
      return 0;
    }

    const diff = gracePeriodEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}