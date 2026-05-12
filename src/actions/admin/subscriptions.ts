// Astro Server Actions for Admin Subscriptions Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { orders, businessPages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

const listSchema = z.object({
  status: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'paid', 'rejected']),
  expiryDate: z.number().optional(),
});

const updateSchema = z.object({
  id: z.string(),
  planType: z.string().optional(),
  amount: z.number().optional(),
  status: z.enum(['pending', 'paid', 'rejected', 'draft']).optional(),
  expiryDate: z.number().optional(),
  adminNotes: z.string().optional(),
});

export const subscriptions = {
  // List all orders with optional status filter
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      let query = db.select({
        id: orders.id,
        businessPageId: orders.businessPageId,
        userId: orders.userId,
        planType: orders.planType,
        amount: orders.amount,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        expiryDate: orders.expiryDate,
        paidDate: orders.paidDate,
        createdAt: orders.createdAt,
        adminNotes: orders.adminNotes,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

      if (input?.status) {
        query = query.where(eq(orders.status, input.status)) as typeof query;
      }

      const allOrders = await query.all();
      return { success: true, data: allOrders };
    },
  }),

  // Update subscription status (confirm/reject payment)
  updateStatus: defineAction({
    input: updateStatusSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
        throw new Error('Insufficient permissions');
      }

      const db = await getDb();

      // Get current order
      const order = await db.select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1)
        .get();

      if (!order) throw new Error('Order not found');

      // Calculate expiry date if setting to paid
      let newExpiryDate = order.expiryDate;
      let paidDate = order.paidDate;

      if (input.status === 'paid' && !order.paidDate) {
        paidDate = new Date();
        const planType = order.planType || 'basic';
        const isYearly = planType.includes('yearly');
        const days = isYearly ? 365 : 30;

        if (input.expiryDate) {
          newExpiryDate = new Date(input.expiryDate);
        } else {
          newExpiryDate = new Date();
          newExpiryDate.setDate(newExpiryDate.getDate() + days);
        }
      }

      // Calculate timestamp for storage
      let expiryTimestamp: number | null = null;
      if (newExpiryDate) {
        expiryTimestamp = newExpiryDate instanceof Date
          ? Math.floor(newExpiryDate.getTime() / 1000)
          : newExpiryDate;
      }

      // Update order
      await db.update(orders)
        .set({
          status: input.status,
          paidDate,
          expiryDate: expiryTimestamp,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id))
        .run();

      // If payment confirmed, update business page with plan info
      if (input.status === 'paid' && order.businessPageId) {
        const planType = order.planType
          .replace('-yearly', '')
          .replace('-monthly', '');

        const expiryTs = expiryTimestamp ? new Date(expiryTimestamp * 1000) : newExpiryDate;
        const expiry = expiryTs ? Math.floor(expiryTs.getTime() / 1000) : null;

        await db.update(businessPages)
          .set({
            planType,
            expiryDate: expiry,
            status: 'live',
            subscriptionStatus: 'active',
            gracePeriodEndDate: null,
            updatedAt: new Date(),
          })
          .where(eq(businessPages.id, order.businessPageId))
          .run();
      }

      return { success: true, data: { id: input.id, status: input.status, expiryDate: expiryTimestamp, paidDate } };
    },
  }),

  // Full order update (admin order management)
  update: defineAction({
    input: updateSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();

      // Get current order
      const order = await db.select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1)
        .get();

      if (!order) throw new Error('Order not found');

      // Calculate expiry date if setting to paid
      let newExpiryDate = input.expiryDate ? new Date(input.expiryDate) : order.expiryDate;
      let paidDate = order.paidDate;

      if (input.status === 'paid' && order.status !== 'paid' && !order.paidDate) {
        paidDate = new Date();

        if (!input.expiryDate) {
          const isYearly = input.planType?.includes('yearly') || order.planType.includes('yearly');
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
      const finalAmount = input.amount ?? planAmounts[input.planType || order.planType] ?? order.amount;

      // Update order
      await db.update(orders)
        .set({
          planType: input.planType || order.planType,
          amount: finalAmount,
          status: input.status || order.status,
          paidDate,
          expiryDate: newExpiryDate,
          adminNotes: input.adminNotes !== undefined ? input.adminNotes : order.adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id))
        .run();

      // If payment confirmed, update business page with plan info
      if (input.status === 'paid' && order.businessPageId) {
        const finalPlanType = (input.planType || order.planType)
          .replace('-yearly', '')
          .replace('-monthly', '');

        await db.update(businessPages)
          .set({
            planType: finalPlanType,
            expiryDate: newExpiryDate,
            status: order.status === 'draft' ? 'live' : order.status,
            updatedAt: new Date(),
          })
          .where(eq(businessPages.id, order.businessPageId))
          .run();
      }

      return {
        success: true,
        data: {
          id: input.id,
          planType: input.planType || order.planType,
          amount: finalAmount,
          status: input.status || order.status,
          expiryDate: newExpiryDate,
          paidDate,
        },
      };
    },
  }),

  // Delete order
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
      await db.delete(orders).where(eq(orders.id, input.id)).run();

      return { success: true };
    },
  }),

  // Get order by ID
  getById: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
      const order = await db.select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1)
        .get();

      return { success: true, data: order };
    },
  }),
};