// Astro Server Actions for Admin Subscriptions Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { orders, businesses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

const listSchema = z.object({
  status: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'paid', 'cancelled', 'refunded']),
  expiresAt: z.number().optional(),
});

const updateSchema = z.object({
  id: z.string(),
  servicePackageId: z.string().optional(),
  variantSnapshot: z.string().optional(),
  type: z.string().optional(),
  typeId: z.string().optional(),
  amount: z.number().optional(),
  status: z.enum(['pending', 'paid', 'cancelled', 'refunded']).optional(),
  expiresAt: z.number().optional(),
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
        servicePackageId: orders.servicePackageId,
        variantSnapshot: orders.variantSnapshot,
        type: orders.type,
        typeId: orders.typeId,
        userId: orders.userId,
        amount: orders.amount,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        expiresAt: orders.expiresAt,
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

      // Calculate expiresAt if setting to paid
      let newExpiresAt = order.expiresAt;
      let paidDate = order.paidDate;

      if (input.status === 'paid' && !order.paidDate) {
        paidDate = new Date();
        const variantSnapshot = order.variantSnapshot ? JSON.parse(order.variantSnapshot) : null;
        const durationValue = variantSnapshot?.durationValue || 30;
        const durationUnit = variantSnapshot?.durationUnit || 'days';

        if (input.expiresAt) {
          newExpiresAt = input.expiresAt;
        } else {
          const expiresDate = new Date();
          if (durationUnit === 'months') {
            expiresDate.setMonth(expiresDate.getMonth() + durationValue);
          } else if (durationUnit === 'years') {
            expiresDate.setFullYear(expiresDate.getFullYear() + durationValue);
          } else {
            expiresDate.setDate(expiresDate.getDate() + durationValue);
          }
          newExpiresAt = Math.floor(expiresDate.getTime() / 1000);
        }
      }

      // Update order
      await db.update(orders)
        .set({
          status: input.status,
          paidDate,
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id))
        .run();

      // If payment confirmed, update business
      if (input.status === 'paid' && order.typeId) {
        const variantSnapshot = order.variantSnapshot ? JSON.parse(order.variantSnapshot) : null;
        const limits = variantSnapshot?.limits || {};
        const planSlug = order.servicePackageId || 'unknown';

        await db.update(businesses)
          .set({
            planSlug,
            limits: JSON.stringify(limits),
            expiresAt: newExpiresAt ? new Date(newExpiresAt * 1000) : null,
            status: 'live',
            subscriptionStatus: 'active',
            gracePeriodEndDate: null,
            updatedAt: new Date(),
          })
          .where(eq(businesses.id, order.typeId))
          .run();
      }

      return { success: true, data: { id: input.id, status: input.status, expiresAt: newExpiresAt, paidDate } };
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

      // Calculate expiresAt if setting to paid
      let newExpiresAt = input.expiresAt ? input.expiresAt : order.expiresAt;
      let paidDate = order.paidDate;

      if (input.status === 'paid' && order.status !== 'paid' && !order.paidDate) {
        paidDate = new Date();

        if (!input.expiresAt) {
          const variantSnapshot = (input.variantSnapshot || order.variantSnapshot) ? JSON.parse(input.variantSnapshot || order.variantSnapshot) : null;
          const durationValue = variantSnapshot?.durationValue || 30;
          const durationUnit = variantSnapshot?.durationUnit || 'days';

          const expiresDate = new Date();
          if (durationUnit === 'months') {
            expiresDate.setMonth(expiresDate.getMonth() + durationValue);
          } else if (durationUnit === 'years') {
            expiresDate.setFullYear(expiresDate.getFullYear() + durationValue);
          } else {
            expiresDate.setDate(expiresDate.getDate() + durationValue);
          }
          newExpiresAt = Math.floor(expiresDate.getTime() / 1000);
        }
      }

      // Update order
      await db.update(orders)
        .set({
          servicePackageId: input.servicePackageId || order.servicePackageId,
          variantSnapshot: input.variantSnapshot || order.variantSnapshot,
          type: input.type || order.type,
          typeId: input.typeId || order.typeId,
          amount: input.amount ?? order.amount,
          status: input.status || order.status,
          paidDate,
          expiresAt: newExpiresAt,
          adminNotes: input.adminNotes !== undefined ? input.adminNotes : order.adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id))
        .run();

      // If payment confirmed, update business
      if (input.status === 'paid' && order.typeId) {
        const variantSnapshot = (input.variantSnapshot || order.variantSnapshot) ? JSON.parse(input.variantSnapshot || order.variantSnapshot) : null;
        const limits = variantSnapshot?.limits || {};
        const planSlug = input.servicePackageId || order.servicePackageId || 'unknown';

        await db.update(businesses)
          .set({
            planSlug,
            limits: JSON.stringify(limits),
            expiresAt: newExpiresAt ? new Date(newExpiresAt * 1000) : null,
            status: order.status === 'draft' ? 'live' : order.status,
            updatedAt: new Date(),
          })
          .where(eq(businesses.id, order.typeId))
          .run();
      }

      return {
        success: true,
        data: {
          id: input.id,
          servicePackageId: input.servicePackageId || order.servicePackageId,
          amount: input.amount ?? order.amount,
          status: input.status || order.status,
          expiresAt: newExpiresAt,
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

      if (!order) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } };
      }

      return { success: true, data: order };
    },
  }),
};