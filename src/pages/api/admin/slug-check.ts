// Slug uniqueness check API
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessPages, blogPosts, landingPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const type = url.searchParams.get('type') || 'listing'; // listing, blog, landing

  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = await getDb();
  let exists = false;
  let table: any;
  let slugField: any;

  switch (type) {
    case 'blog':
      table = blogPosts;
      slugField = blogPosts.slug;
      break;
    case 'landing':
      table = landingPages;
      slugField = landingPages.slug;
      break;
    default:
      table = businessPages;
      slugField = businessPages.slug;
  }

  try {
    const existing = await db.select().from(table).where(eq(slugField, slug)).limit(1).get();
    exists = !!existing;
  } catch {
    exists = false;
  }

  return new Response(JSON.stringify({
    success: true,
    unique: !exists,
    slug,
    type
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}