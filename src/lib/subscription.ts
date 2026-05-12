// Subscription and SKU limit helper functions
import { getDb } from './db';
import { businessPages, products, plans } from '@/db/schema';
import { eq, count, and, lt } from 'drizzle-orm';

/**
 * Get SKU limit from plans table by plan type
 * planType format: 'basic-monthly', 'pro-yearly', 'max-monthly', etc.
 */
export async function getPlanSkuLimit(planType: string | null): Promise<number> {
  if (!planType) return 0;

  const db = await getDb();

  // Try exact match first
  const plan = await db.select({ skuLimit: plans.skuLimit })
    .from(plans)
    .where(eq(plans.id, planType))
    .limit(1)
    .get();

  if (plan) return plan.skuLimit;

  // Fallback: try to match by tier name
  const tier = planType.split('-')[0]; // 'basic', 'pro', 'max'
  const planByTier = await db.select({ skuLimit: plans.skuLimit })
    .from(plans)
    .where(eq(plans.name, tier.charAt(0).toUpperCase() + tier.slice(1)))
    .limit(1)
    .get();

  return planByTier?.skuLimit ?? 0;
}

export interface PlanLimits {
  skuLimit: number;
  maxImages: number; // per SKU
  maxVideos: number; // per SKU
  maxBusinessImages: number; // business page level
  maxBusinessVideos: number; // business page level
}

/**
 * Get plan limits from DB
 * Handles both full plan ID (e.g., "pro-monthly") and tier name (e.g., "pro")
 */
export async function getPlanLimits(planType: string | null): Promise<PlanLimits | null> {
  if (!planType) return null;

  const db = await getDb();

  // Try exact match first
  const plan = await db.select({
    skuLimit: plans.skuLimit,
    maxImages: plans.maxImages,
    maxVideos: plans.maxVideos,
    maxBusinessImages: plans.maxBusinessImages,
    maxBusinessVideos: plans.maxBusinessVideos,
  })
    .from(plans)
    .where(eq(plans.id, planType))
    .limit(1)
    .get();

  if (plan) return plan;

  // Fallback: try to match by tier name (e.g., "pro" -> "Pro")
  // Get the tier part (e.g., "pro" from "pro-monthly")
  const tier = planType.split('-')[0];
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);

  const planByTier = await db.select({
    skuLimit: plans.skuLimit,
    maxImages: plans.maxImages,
    maxVideos: plans.maxVideos,
    maxBusinessImages: plans.maxBusinessImages,
    maxBusinessVideos: plans.maxBusinessVideos,
  })
    .from(plans)
    .where(eq(plans.name, capitalizedTier))
    .limit(1)
    .get();

  return planByTier || null;
}

export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'cancelled';

// Grace period in days
export const GRACE_PERIOD_DAYS = 60;

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planType: string | null;
  skuLimit: number;
  skuCount: number;
  expiryDate: Date | null;
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
    .from(businessPages)
    .where(eq(businessPages.id, businessId))
    .limit(1)
    .get();

  if (!business) return null;

  // Count SKUs for this business
  const skuResult = await db.select({ count: count() })
    .from(products)
    .where(eq(products.businessPageId, businessId))
    .get();

  const skuCount = skuResult?.count ?? 0;
  const planType = business.planType || null;
  const skuLimit = await getPlanSkuLimit(planType);

  // Check grace period
  const now = new Date();
  const gracePeriodEnd = business.gracePeriodEndDate
    ? new Date(business.gracePeriodEndDate * 1000)
    : null;

  const isInGracePeriod = gracePeriodEnd
    ? now < gracePeriodEnd && now > new Date((business.expiryDate || 0) * 1000)
    : false;

  return {
    status: (business.subscriptionStatus as SubscriptionStatus) || 'none',
    planType,
    skuLimit,
    skuCount,
    expiryDate: business.expiryDate ? new Date(business.expiryDate * 1000) : null,
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
  if (info.skuCount >= info.skuLimit) {
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
  return expiryTimestamp + (GRACE_PERIOD_DAYS * 24 * 60 * 60);
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
