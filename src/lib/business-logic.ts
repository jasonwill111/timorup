// Business logic utilities
import { db } from './db';
import { businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Check if a user already has a business page.
 * Uses the indexed ownerId column for O(log n) lookup.
 *
 * @param dbInstance - The Drizzle DB instance (defaults to module-level db)
 * @param userId - The user's ID
 * @returns The user's business record if found, null otherwise
 */
export async function hasUserBusiness(
  dbInstance: typeof db,
  userId: string
) {
  const [result] = await dbInstance
    .select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
    })
    .from(businessPages)
    .where(eq(businessPages.ownerId, userId))
    .limit(1);

  return result ?? null;
}
