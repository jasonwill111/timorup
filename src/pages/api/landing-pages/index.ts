// Landing Pages API - Store AI-generated landing pages
export const prerender = false;

import { getDb } from '@/lib/db';
import { landingPages } from '@/db/schema';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaSecondary: z.string().optional(),
});

const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().optional(),
});

const ctaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(), // Tiptap HTML
  buttonText: z.string().optional(),
});

const createLandingSchema = z.object({
  pageType: z.enum(['promotion', 'product-showcase', 'event', 'seasonal']).default('promotion'),
  title: z.string().min(1),
  slug: z.string().optional(),
  heroImageId: z.string().optional(), // Media ID
  hero: heroSchema,
  description: z.string().optional(), // Tiptap HTML
  features: z.array(featureSchema).optional(),
  cta: ctaSchema.optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const pages = await db.select().from(landingPages).all();
    return new Response(JSON.stringify({ success: true, data: pages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Landing pages error:', error);
    return new Response(JSON.stringify({ success: false, error: { message: 'Failed to fetch' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const data = createLandingSchema.parse(body);

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);

    const newPage = {
      id: nanoid(),
      pageType: data.pageType,
      title: data.title,
      slug,
      heroImageId: data.heroImageId || null,
      hero: JSON.stringify(data.hero),
      description: data.description || null, // Tiptap HTML
      features: data.features ? JSON.stringify(data.features) : null,
      cta: data.cta ? JSON.stringify(data.cta) : null,
      status: data.status,
      createdBy: user.id,
    };

    await db.insert(landingPages).values(newPage);

    return new Response(JSON.stringify({ success: true, data: { id: newPage.id, slug } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create landing page error:', error);
    return new Response(JSON.stringify({ success: false, error: { message: 'Failed to create landing page' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}