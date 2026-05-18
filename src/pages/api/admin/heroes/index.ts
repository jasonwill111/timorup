// Admin API - Heroes Management (Banner API wrapper)
export const prerender = false;

import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { desc, eq } from 'drizzle-orm';

// GET - List all heroes (banners)
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const heroList = await db.select().from(adBanners).orderBy(desc(adBanners.createdAt)).all();

    return new Response(JSON.stringify({
      success: true,
      data: heroList
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin heroes error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch heroes' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create hero
export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const { title, description, imageId, ctaText, ctaLink, order } = body;

    const id = `hero-${Date.now()}`;

    await db.insert(adBanners).values({
      id,
      title,
      description: description || '',
      imageId: imageId || null,
      ctaText: ctaText || '',
      ctaLink: ctaLink || '',
      order: order || 0,
      isActive: 1,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create hero error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create hero' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
