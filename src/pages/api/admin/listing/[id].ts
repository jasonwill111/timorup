import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  industry: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  countryCode: z.string().optional(),
  contactNumber: z.string().optional().nullable(),
  email: z.email().optional().nullable().or(z.literal('')),
  registrationUrl: z.url().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  aboutUs: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  yearOfEstablishment: z.number().optional().nullable(),
  status: z.enum(['draft', 'live', 'suspended']).optional(),
});

export const GET: APIRoute = async ({ params }) => {
  const listing = await db
    .select()
    .from(businessPages)
    .where(eq(businessPages.id, params.id ?? ''))
    .get();

  if (!listing) {
    return new Response(JSON.stringify({ error: 'Listing not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(listing), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const existing = await db
      .select()
      .from(businessPages)
      .where(eq(businessPages.id, params.id ?? ''))
      .get();

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Listing not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.contactName !== undefined) updateData.contactName = data.contactName;
    if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
    if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.registrationUrl !== undefined) updateData.registrationUrl = data.registrationUrl || null;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.aboutUs !== undefined) updateData.aboutUs = data.aboutUs;
    if (data.tags !== undefined) updateData.tags = data.tags ? JSON.stringify(data.tags) : null;
    if (data.yearOfEstablishment !== undefined) updateData.yearOfEstablishment = data.yearOfEstablishment;
    if (data.status !== undefined) updateData.status = data.status;

    await db
      .update(businessPages)
      .set(updateData)
      .where(eq(businessPages.id, params.id ?? ''));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.error('Error updating listing:', error);
    return new Response(JSON.stringify({ error: 'Failed to update listing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  await db
    .delete(businessPages)
    .where(eq(businessPages.id, params.id ?? ''));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
