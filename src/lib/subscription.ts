// Subscription and SKU limit helper functions
import { getDb } from './db';
import { businesses, products, servicePackages } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export interface PlanLimits {
  skuLimit: number;
  maxImages: number;
  maxVideos: number;
  maxBusinessImages: number;
  maxBusinessVideos: number;
}

/**
 * Get plan limits from DB by plan slug
 * Now queries servicePackages table with variants JSON
 */
export async function getPlanLimits(planSlug: string | null): Promise<PlanLimits | null> {
  if (!planSlug) return null;

  const db = await getDb();

  const plan = await db.select()
    .from(servicePackages)
    .where(eq(servicePackages.slug, planSlug))
    .limit(1)
    .get();

  if (!plan) return null;

  try {
    const variants = JSON.parse(plan.variants);
    if (!Array.isArray(variants) || variants.length === 0) return null;

    // Use first variant's limits (or could be configurable)
    const variant = variants[0];
    return {
      skuLimit: variant.limits?.skuLimit ?? 0,
      maxImages: variant.limits?.maxImages ?? 0,
      maxVideos: variant.limits?.maxVideos ?? 0,
      maxBusinessImages: variant.limits?.maxBusinessImages ?? 0,
      maxBusinessVideos: variant.limits?.maxBusinessVideos ?? 0,
    };
  } catch {
    return null;
  }
}

export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'cancelled';

// Grace period in days
export const GRACE_PERIOD_DAYS = 60;

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planSlug: string | null;
  skuLimit: number;
  skuCount: number;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
  isInGracePeriod: boolean;
  isActive: boolean;
}

/**
 * Get subscription info for a business
 */
export async function getSubscriptionInfo(businessId: string): Promise<SubscriptionInfo | null> {
  const db = await getDb();

  const business = await db.select()
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1)
    .get();

  if (!business) return null;

  // Count SKUs for this business
  const skuResult = await db.select({ count: count() })
    .from(products)
    .where(eq(products.businessId, businessId))
    .get();

  const skuCount = skuResult?.count ?? 0;
  const planSlug = business.planSlug || null;
  const planLimits = planSlug ? await getPlanLimits(planSlug) : null;
  const skuLimit = planLimits?.skuLimit ?? 0;

  // Check grace period
  const now = new Date();
  const gracePeriodEnd = business.gracePeriodEndDate
    ? new Date(business.gracePeriodEndDate)
    : null;
  const expiresAt = business.subscriptionExpiresAt
    ? new Date(business.subscriptionExpiresAt)
    : null;

  const isInGracePeriod = gracePeriodEnd
    ? now < gracePeriodEnd && expiresAt && now > expiresAt
    : false;

  return {
    status: (business.subscriptionStatus as SubscriptionStatus) || 'none',
    planSlug,
    skuLimit,
    skuCount,
    expiresAt,
    gracePeriodEndDate: gracePeriodEnd,
    isInGracePeriod,
    isActive: business.subscriptionStatus === 'active',
  };
}

/**
 * Check if user can create SKU for a business
 */
export async function canCreateSku(businessId: string): Promise<{ can: boolean; reason?: string }> {
  const info = await getSubscriptionInfo(businessId);
  if (!info) return { can: false, reason: 'Business not found' };

  // Non-profit or business without subscription
  if (info.status === 'none') {
    return { can: false, reason: 'Business is pending payment confirmation' };
  }

  // Expired
  if (info.status === 'expired') {
    return { can: false, reason: 'Subscription expired' };
  }

  // Cancelled
  if (info.status === 'cancelled') {
    return { can: false, reason: 'Subscription cancelled' };
  }

  // In grace period
  if (info.isInGracePeriod) {
    return { can: false, reason: 'Cannot create SKUs during grace period' };
  }

  // Check SKU limit
  if (info.skuLimit > 0 && info.skuCount >= info.skuLimit) {
    return { can: false, reason: `SKU limit reached (${info.skuCount}/${info.skuLimit})` };
  }

  return { can: true };
}

/**
 * Check if user can edit business content
 */
export async function canEditBusiness(businessId: string): Promise<{ can: boolean; reason?: string }> {
  const info = await getSubscriptionInfo(businessId);
  if (!info) return { can: false, reason: 'Business not found' };

  // In grace period - cannot edit
  if (info.isInGracePeriod) {
    return { can: false, reason: 'Cannot edit during grace period. Please renew your subscription.' };
  }

  return { can: true };
}

/**
 * Check if business is in grace period
 */
export async function isInGracePeriod(businessId: string): Promise<boolean> {
  const info = await getSubscriptionInfo(businessId);
  return info?.isInGracePeriod ?? false;
}

/**
 * Calculate grace period end date from expiry date
 */
export function calculateGracePeriodEnd(expiryTimestamp: number): number {
  return expiryTimestamp + (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Get days remaining in grace period
 */
export async function getGracePeriodDaysRemaining(businessId: string): Promise<number> {
  const info = await getSubscriptionInfo(businessId);
  if (!info || !info.isInGracePeriod || !info.gracePeriodEndDate) return 0;

  const now = new Date();
  const diff = info.gracePeriodEndDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if listing is past grace period (ready for deletion)
 */
export async function isPastGracePeriod(businessId: string): Promise<boolean> {
  const info = await getSubscriptionInfo(businessId);
  if (!info || !info.gracePeriodEndDate) return false;

  return new Date() > info.gracePeriodEndDate;
}
