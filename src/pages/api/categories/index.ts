// API endpoint to get categories by entity type
export const prerender = false;

import { getDb } from '@/lib/db';
import {
  businessCategories,
  nonProfitCategories,
  publicSectorCategories,
  listingCategories,
} from '@/db/schema';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getCategoryTable(entityType: string) {
  switch (entityType) {
    case 'business':
      return businessCategories;
    case 'nonprofit':
      return nonProfitCategories;
    case 'public_sector':
      return publicSectorCategories;
    case 'listing':
      return listingCategories;
    default:
      return businessCategories;
  }
}

export async function GET({ url }: { url: URL }) {
  try {
    const entityType = url.searchParams.get('type') || 'business';
    const db = await getDb();
if (!db) throw new Error("Database not available");
    const table = getCategoryTable(entityType);
    const allCategories = await db.select().from(table).all() as unknown[];

    // Cache in production: stale-while-revalidate for 60 seconds
    const cacheHeaders = import.meta.env.PROD
      ? { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=600' }
      : { 'Cache-Control': 'no-store' };

    return new Response(JSON.stringify({
      success: true,
      data: allCategories,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...cacheHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}