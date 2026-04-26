// Admin API - Update order status (confirm payment)
export const prerender = false;

import { db } from '@/lib/db';
import { orders, businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT({ params, request }: { params: Record<string, string>; request: Request }) {
  try {
    const body = await request.json();
    const { status, expiryDate } = body;
    const { id } = params;

    // Get current order
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)
      .get();

    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Order not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Calculate expiry date if setting to paid
    let newExpiryDate = order.expiryDate;
    let paidDate = order.paidDate;

    if (status === 'paid' && !order.paidDate) {
      paidDate = new Date();
      // Default expiry: 30 days for monthly, 365 days for yearly
      const planType = order.planType || 'basic';
      const isYearly = planType.includes('yearly');
      const days = isYearly ? 365 : 30;

      if (expiryDate) {
        newExpiryDate = new Date(expiryDate);
      } else {
        newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + days);
      }
    }

    // Update order
    await db.update(orders)
      .set({
        status: status || order.status,
        paidDate,
        expiryDate: newExpiryDate,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .run();

    // If payment confirmed, update business page with plan info
    if (status === 'paid' && order.businessPageId) {
      const planType = order.planType
        .replace('-yearly', '')
        .replace('-monthly', '')
        .replace('basic', 'basic')
        .replace('pro', 'pro')
        .replace('max', 'max');

      await db.update(businessPages)
        .set({
          planType,
          expiryDate: newExpiryDate,
          status: order.status === 'draft' ? 'live' : order.status,
          updatedAt: new Date(),
        })
        .where(eq(businessPages.id, order.businessPageId))
        .run();
    }

    return new Response(JSON.stringify({
      success: true,
      data: { id, status, expiryDate: newExpiryDate, paidDate }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to update order status' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
