// API endpoint to get all categories
export const prerender = false;

import { getDb } from '@/lib/db';
import { categories } from '@/db/schema';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET() {
  try {
    const db = await getDb();
    const allCategories = await db.select().from(categories).all();
    
    // Cache in production: stale-while-revalidate for 60 seconds
    const cacheHeaders = process.env.NODE_ENV === 'production'
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
