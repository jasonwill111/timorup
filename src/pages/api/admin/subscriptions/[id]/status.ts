// Admin API - Update subscription status (confirm/reject payment)
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { calculateGracePeriodEnd } from '@/lib/subscription';

export async function PUT({ params, request }: { params: Record<string, string>; request: Request }) {
  // Require admin/editor role
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
    return unauthorizedResponse();
  }

  const db = await getDb();
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

    // Calculate timestamp for storage
    let expiryTimestamp: number | null = null;
    if (newExpiryDate) {
      expiryTimestamp = Math.floor(newExpiryDate.getTime() / 1000);
    }

    // Update order
    await db.update(orders)
      .set({
        status: status || order.status,
        paidDate,
        expiryDate: expiryTimestamp,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .run();

    // If payment confirmed, update business with plan info
    if (status === 'paid' && order.typeId) {
      const planType = order.planType
        .replace('-yearly', '')
        .replace('-monthly', '');

      const expiryTimestamp = Math.floor(newExpiryDate.getTime() / 1000);

      await db.update(businesses)
        .set({
          planType,
          expiryDate: expiryTimestamp,
          status: 'live', // Publish the listing
          subscriptionStatus: 'active', // Activate subscription
          gracePeriodEndDate: null, // Clear grace period on renewal
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, order.typeId))
        .run();
    }

    // If payment rejected, update order status
    if (status === 'rejected') {
      // Optionally keep listing in pending_payment state
    }

    return new Response(JSON.stringify({
      success: true,
      data: { id, status, expiryDate: expiryTimestamp, paidDate }
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
