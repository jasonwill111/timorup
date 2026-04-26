import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { categories, businessPages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ params, url }) => {
  const slug = params.slug;
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '6');
  const offset = (page - 1) * limit;
  const entityType = url.searchParams.get('type'); // 'business' | 'organization' | null

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Category slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const category = await db.select().from(categories).where(eq(categories.slug, slug)).get();
  if (!category) {
    return new Response(JSON.stringify({ error: 'Category not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Build query - fetch more to filter by type
  const fetchLimit = entityType ? limit * 3 : limit;
  let query = db
    .select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      entityType: businessPages.entityType,
      profileImageId: businessPages.profileImageId,
      address: businessPages.address,
      tags: businessPages.tags,
    })
    .from(businessPages)
    .where(eq(businessPages.categoryId, category.id))
    .orderBy(desc(businessPages.likes))
    .limit(fetchLimit)
    .offset(offset);

  let listings = await query.all();

  // Filter by entity type if specified
  if (entityType) {
    listings = listings.filter(l => l.entityType === entityType).slice(0, limit);
  }

  return new Response(JSON.stringify({
    category: category.slug,
    listings: listings.map(l => ({
      ...l,
      tags: l.tags ? JSON.parse(l.tags) : []
    })),
    page,
    hasMore: listings.length === limit
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
