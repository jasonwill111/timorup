// Like/Save Business API
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST - Like a business
export async function POST({ params, request }: { params: { slug: string }, request: Request }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { userId, action } = body; // action: 'like' or 'save'

    // Find business by slug
    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1);

    if (business.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const biz = business[0];
    
    if (action === 'like') {
      await db.update(businessPages)
        .set({ likes: (biz.likes || 0) + 1 })
        .where(eq(businessPages.id, biz.id));
        
      return new Response(JSON.stringify({
        success: true,
        data: { likes: (biz.likes || 0) + 1 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (action === 'save') {
      await db.update(businessPages)
        .set({ saves: (biz.saves || 0) + 1 })
        .where(eq(businessPages.id, biz.id));
        
      return new Response(JSON.stringify({
        success: true,
        data: { saves: (biz.saves || 0) + 1 }
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
