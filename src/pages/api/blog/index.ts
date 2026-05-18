// Public API - Blog Listings
export const prerender = false;

import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

    const allBlogs = await db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(50)
      .all();

    return new Response(JSON.stringify({
      success: true,
      data: allBlogs,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Blog API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}