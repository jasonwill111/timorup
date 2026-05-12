import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { categories, businesses, nonProfits, publicSectors } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { PaginationSchema } from '@/lib/validation';

export const GET: APIRoute = async ({ params, url }) => {
  const db = await getDb();
  const slug = params.slug;
  const { page, limit } = PaginationSchema.parse({
    page: url.searchParams.get('page') || '1',
    limit: url.searchParams.get('limit') || '6',
  });
  const offset = (page - 1) * limit;
  const entityType = url.searchParams.get('type'); // 'business' | 'nonprofit' | null

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

  // Query all three tables
  const bizListings = entityType && entityType !== 'business' ? [] : await db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      entityType: businesses.entityType,
      profileImageId: businesses.profileImageId,
      address: businesses.address,
      tags: businesses.tags,
      likes: businesses.likes,
    })
    .from(businesses)
    .where(eq(businesses.categoryId, category.id))
    .orderBy(desc(businesses.likes));

  const npListings = entityType && entityType !== 'nonprofit' ? [] : await db
    .select({
      id: nonProfits.id,
      title: nonProfits.title,
      slug: nonProfits.slug,
      entityType: nonProfits.entityType,
      profileImageId: nonProfits.profileImageId,
      address: nonProfits.address,
      tags: nonProfits.tags,
      likes: nonProfits.likes,
    })
    .from(nonProfits)
    .where(eq(nonProfits.categoryId, category.id))
    .orderBy(desc(nonProfits.likes));

  const psListings = entityType && entityType !== 'public_sector' ? [] : await db
    .select({
      id: publicSectors.id,
      title: publicSectors.title,
      slug: publicSectors.slug,
      entityType: publicSectors.entityType,
      profileImageId: publicSectors.profileImageId,
      address: publicSectors.address,
      tags: publicSectors.tags,
      likes: publicSectors.likes,
    })
    .from(publicSectors)
    .where(eq(publicSectors.categoryId, category.id))
    .orderBy(desc(publicSectors.likes));

  // Combine and sort by likes
  let allListings = [...bizListings, ...npListings, ...psListings]
    .sort((a, b) => b.likes - a.likes);

  // Apply pagination
  allListings = allListings.slice(offset, offset + limit);

  return new Response(JSON.stringify({
    category: category.slug,
    listings: allListings.map(l => ({
      ...l,
      tags: l.tags ? JSON.parse(l.tags) : []
    })),
    page,
    hasMore: allListings.length === limit
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
