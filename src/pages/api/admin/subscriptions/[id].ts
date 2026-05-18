// Admin API - Update order (full edit)
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ params, request }: { params: Record<string, string>; request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const { id } = params;

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

    return new Response(JSON.stringify({
      success: true,
      data: order
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to get order' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT({ params, request }: { params: Record<string, string>; request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const { planType, amount, status, expiryDate, adminNotes } = body;
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
    let newExpiryDate = expiryDate ? new Date(expiryDate) : order.expiryDate;
    let paidDate = order.paidDate;

    if (status === 'paid' && order.status !== 'paid' && !order.paidDate) {
      paidDate = new Date();

      // Calculate expiry if not provided
      if (!expiryDate) {
        const isYearly = planType?.includes('yearly') || order.planType.includes('yearly');
        const days = isYearly ? 365 : 30;
        newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + days);
      }
    }

    // Calculate amount if not provided
    const planAmounts: Record<string, number> = {
      'basic-monthly': 29,
      'basic-yearly': 290,
      'pro-monthly': 59,
      'pro-yearly': 590,
      'max-monthly': 89,
      'max-yearly': 890,
    };
    const finalAmount = amount ?? planAmounts[planType || order.planType] ?? order.amount;

    // Update order
    await db.update(orders)
      .set({
        planType: planType || order.planType,
        amount: finalAmount,
        status: status || order.status,
        paidDate,
        expiryDate: newExpiryDate,
        adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .run();

    // If payment confirmed, update business with plan info
    if (status === 'paid' && order.typeId) {
      const finalPlanType = (planType || order.planType)
        .replace('-yearly', '')
        .replace('-monthly', '');

      await db.update(businesses)
        .set({
          planType: finalPlanType,
          expiryDate: newExpiryDate,
          status: order.status === 'draft' ? 'live' : order.status,
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, order.typeId))
        .run();
    }

    return new Response(JSON.stringify({
      success: true,
      data: { id, planType, amount: finalAmount, status, expiryDate: newExpiryDate, paidDate }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to update order' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE({ params, request }: { params: Record<string, string>; request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const { id } = params;

    // Delete order
    await db.delete(orders)
      .where(eq(orders.id, id))
      .run();

    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to delete order' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
