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
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const { status, expiryDate } = body;
    const { id } = params;

    // Get current order
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)
      .get() ?? undefined;

    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Order not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Calculate expiry date if setting to paid
    let newExpiryDate = order.expiresAt;
    let paidDate = order.paidDate;

    // Parse variantSnapshot to get plan info
    const variant = order.variantSnapshot ? JSON.parse(order.variantSnapshot) : null;
    const planName = variant?.name || 'basic-monthly';

    if (status === 'paid' && !order.paidDate) {
      paidDate = Math.floor(Date.now() / 1000);
      // Default expiry: 30 days for monthly, 365 days for yearly
      const isYearly = planName.includes('yearly');
      const days = isYearly ? 365 : 30;

      if (expiryDate) {
        newExpiryDate = Math.floor(expiryDate / 1000);
      } else {
        newExpiryDate = Math.floor((Date.now() + days * 86400000) / 1000);
      }
    }

    // Update order
    await db.update(orders)
      .set({
        status: status || order.status,
        paidDate,
        expiresAt: newExpiryDate,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(orders.id, id))
      .run();

    // If payment confirmed, update business with plan info
    if (status === 'paid' && order.typeId) {
      const finalPlanType = planName
        .replace('-yearly', '')
        .replace('-monthly', '');

      await db.update(businesses)
        .set({
          planType: finalPlanType,
          expiresAt: newExpiryDate,
          status: 'live', // Publish the listing
          subscriptionStatus: 'active', // Activate subscription
          gracePeriodEndDate: null, // Clear grace period on renewal
          updatedAt: Math.floor(Date.now() / 1000),
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
      data: { id, status, expiresAt: newExpiryDate, paidDate }
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
