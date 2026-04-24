// Like/Save Business API
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ params, request }: { params: { slug: string }, request: Request }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { action } = body;

    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'like') {
      await db.update(businessPages)
        .set({ likes: (business.likes || 0) + 1 })
        .where(eq(businessPages.id, business.id))
        .run();

      return new Response(JSON.stringify({
        success: true,
        data: { likes: (business.likes || 0) + 1 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'save') {
      await db.update(businessPages)
        .set({ saves: (business.saves || 0) + 1 })
        .where(eq(businessPages.id, business.id))
        .run();

      return new Response(JSON.stringify({
        success: true,
        data: { saves: (business.saves || 0) + 1 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Invalid action' }
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Like/Save error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to process request' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
