// Slug uniqueness check API
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessPages, blogPosts, landingPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { slugCheckSchema } from '@/lib/api-validation';

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);

  // Validate query params with Zod
  const result = slugCheckSchema.safeParse({
    slug: queryParams.slug,
    excludeId: queryParams.excludeId ? parseInt(queryParams.excludeId) : undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.issues[0]?.message || 'Invalid slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { slug, excludeId } = result.data;

  const db = await getDb();
  let exists = false;

  // Type-safe table selection using union type
  type TableType = typeof businessPages | typeof blogPosts | typeof landingPages;
  type SlugFieldType = typeof businessPages.slug | typeof blogPosts.slug | typeof landingPages.slug;

  let table: TableType;
  let slugField: SlugFieldType;

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