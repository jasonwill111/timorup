// Business logic utilities
import { getDb } from './db';
import { businesses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Role type
type Role = 'user' | 'admin' | 'super_admin' | 'editor';

/**
 * Check if a user already has a LIVE business page.
 * Filters by status='live' to exclude deleted/archived businesses.
 *
 * @param userId - The user's ID
 * @returns The user's business record if found and live, null otherwise
 */
export async function hasUserBusiness(userId: string) {
  const db = await getDb();
if (!db) return null;
  const [result] = await db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      status: businesses.status,
    })
    .from(businesses)
    .where(
      and(
        eq(businesses.ownerId, userId),
        eq(businesses.status, 'live')
      )
    )
    .limit(1);

  return result ?? null;
}

/**
 * Check if a user can edit a business page.
 * Admin/super_admin can edit any listing.
 * Editor/user can only edit their own listings.
 *
 * @param userRole - The user's role
 * @param userId - The user's ID
 * @param businessOwnerId - The business owner's ID
 * @returns True if user can edit the business
 */
export function canEditBusiness(
  userRole: Role,
  userId: string,
  businessOwnerId: string
): boolean {
  // Admin+ can edit any listing
  if (userRole === 'admin' || userRole === 'super_admin') {
    return true;
  }

  // Editor/user can only edit their own listings
  return userId === businessOwnerId;
}
