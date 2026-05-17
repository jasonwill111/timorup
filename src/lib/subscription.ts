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
  } catch (e) {
    console.warn('[Subscription] Failed to parse plan variants JSON:', e instanceof Error ? e.message : String(e));
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

// Dashboard interface - same as SubscriptionInfo but grouped
export interface SubscriptionDashboard {
  businessId: string;
  status: SubscriptionStatus;
  planSlug: string | null;
  skuLimit: number;
  skuCount: number;
  maxImages: number;
  maxVideos: number;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
  isInGracePeriod: boolean;
  isActive: boolean;
}

/**
 * Get subscription info for a business
 * Uses getSubscriptionDashboard for batching
 */
export async function getSubscriptionInfo(businessId: string): Promise<SubscriptionInfo | null> {
  const dashboard = await getSubscriptionDashboard(businessId);
  if (!dashboard) return null;

  return {
    status: dashboard.status,
    planSlug: dashboard.planSlug,
    skuLimit: dashboard.skuLimit,
    skuCount: dashboard.skuCount,
    expiresAt: dashboard.expiresAt,
    gracePeriodEndDate: dashboard.gracePeriodEndDate,
    isInGracePeriod: dashboard.isInGracePeriod,
    isActive: dashboard.isActive,
  };
}

/**
 * Check if user can create SKU for a business
 */
export async function canCreateSku(businessId: string): Promise<{ can: boolean; reason?: string }> {
  const info = await getSubscriptionDashboard(businessId);
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
  const info = await getSubscriptionDashboard(businessId);
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
  const info = await getSubscriptionDashboard(businessId);
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
 * Get subscription dashboard - BATCHED VERSION
 * Reduces 3+ DB calls to fewer calls for complete subscription info
 */
export interface SubscriptionDashboard {
  businessId: string;
  status: SubscriptionStatus;
  planSlug: string | null;
  skuLimit: number;
  skuCount: number;
  maxImages: number;
  maxVideos: number;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
  isInGracePeriod: boolean;
  isActive: boolean;
}

/**
 * Get full subscription dashboard for a business
 * Batched: 1 business query + 1 SKU count + 1 plan lookup (if needed)
 *
 * Use this for any operation requiring full subscription context
 */
export async function getSubscriptionDashboard(businessId: string): Promise<SubscriptionDashboard | null> {
  const db = await getDb();
  if (!db) return null;

  // Query 1: Get business with subscription info
  const business = await db.select({
    id: businesses.id,
    planSlug: businesses.planSlug,
    subscriptionStatus: businesses.subscriptionStatus,
    subscriptionExpiresAt: businesses.subscriptionExpiresAt,
    gracePeriodEndDate: businesses.gracePeriodEndDate,
  })
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1)
    .get();

  if (!business) return null;

  // Query 2: Count SKUs
  const skuResult = await db.select({ count: count() })
    .from(products)
    .where(eq(products.businessId, businessId))
    .get();

  const skuCount = skuResult?.count ?? 0;
  const planSlug = business.planSlug || null;

  // Query 3: Get plan limits (only if plan exists)
  let skuLimit = 0;
  let maxImages = 0;
  let maxVideos = 0;

  if (planSlug) {
    const plan = await db.select({ variants: servicePackages.variants })
      .from(servicePackages)
      .where(eq(servicePackages.slug, planSlug))
      .limit(1)
      .get();

    if (plan?.variants) {
      try {
        const variants = JSON.parse(plan.variants);
        if (Array.isArray(variants) && variants.length > 0) {
          skuLimit = variants[0].limits?.skuLimit ?? 0;
          maxImages = variants[0].limits?.maxImages ?? 0;
          maxVideos = variants[0].limits?.maxVideos ?? 0;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  // Calculate grace period status
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
    businessId,
    status: (business.subscriptionStatus as SubscriptionStatus) || 'none',
    planSlug,
    skuLimit,
    skuCount,
    maxImages,
    maxVideos,
    expiresAt,
    gracePeriodEndDate: gracePeriodEnd,
    isInGracePeriod,
    isActive: business.subscriptionStatus === 'active',
  };
}

/**
 * Check if listing is past grace period (ready for deletion)
 */
export async function isPastGracePeriod(businessId: string): Promise<boolean> {
  const dashboard = await getSubscriptionDashboard(businessId);
  if (!dashboard || !dashboard.gracePeriodEndDate) return false;
  return new Date() > dashboard.gracePeriodEndDate;
}
