// Admin API - Blogs Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const db = await getDb();
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).all();

    return new Response(JSON.stringify({
      success: true,
      data: posts
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin blogs error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch blog posts' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
