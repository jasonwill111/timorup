// Astro Server Actions for Admin Plans Management (Extended)
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { plans, businesses } from '@/db/schema';
import { eq, asc, and, count } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

const CreatePlanSchema = z.object({
  name: z.string().min(1).max(100),
  period: z.enum(['monthly', 'yearly']),
  amount: z.number().positive(),
  skuLimit: z.number().int().nonnegative(),
  maxImages: z.number().int().nonnegative(),
  maxVideos: z.number().int().nonnegative(),
  maxBusinessImages: z.number().int().nonnegative().optional(),
  maxBusinessVideos: z.number().int().nonnegative().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().max(500).default(''),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

const UpdatePlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  amount: z.number().positive().optional(),
  skuLimit: z.number().int().nonnegative().optional(),
  maxImages: z.number().int().nonnegative().optional(),
  maxVideos: z.number().int().nonnegative().optional(),
  maxBusinessImages: z.number().int().nonnegative().optional(),
  maxBusinessVideos: z.number().int().nonnegative().optional(),
  features: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const plansAdmin = {
  // Get all plans (admin view - includes inactive)
  getAll: defineAction({
    handler: async () => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
      const allPlans = await db.select()
        .from(plans)
        .orderBy(asc(plans.sortOrder))
        .all();

      return {
        success: true,
        data: allPlans.map(plan => ({
          ...plan,
          features: plan.features ? JSON.parse(plan.features) : [],
        })),
      };
    },
  }),

  // Create new plan (super_admin only)
  create: defineAction({
    input: CreatePlanSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'super_admin') throw new Error('Only super_admin can create plans');

      const db = await getDb();

      // Check for duplicate name + period combination
      const existingPlan = await db.select()
        .from(plans)
        .where(and(
          eq(plans.name, input.name),
          eq(plans.period, input.period)
        ))
        .limit(1)
        .get();

      if (existingPlan) throw new Error('Plan with this name and period already exists');

      const id = `plan-${Date.now()}`;
      const features = input.features;

      await db.insert(plans).values({
        id,
        name: input.name,
        period: input.period,
        amount: input.amount,
        skuLimit: input.skuLimit,
        maxImages: input.maxImages,
        maxVideos: input.maxVideos,
        maxBusinessImages: input.maxBusinessImages ?? input.maxImages * 3,
        maxBusinessVideos: input.maxBusinessVideos ?? input.maxVideos,
        description: input.description,
        features: JSON.stringify(features),
        active: input.active,
        sortOrder: input.sortOrder,
      });

      return {
        success: true,
        data: { id, name: input.name, period: input.period, amount: input.amount, features },
      };
    },
  }),

  // Update plan
  update: defineAction({
    input: UpdatePlanSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
        throw new Error('Insufficient permissions');
      }

      const db = await getDb();
      const { id, ...data } = input;

      // Check plan exists
      const existing = await db.select()
        .from(plans)
        .where(eq(plans.id, id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Plan not found');

      // Build update object
      const updateData: Record<string, unknown> = {
        updatedAt: Math.floor(Date.now() / 1000),
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.skuLimit !== undefined) updateData.skuLimit = data.skuLimit;
      if (data.maxImages !== undefined) updateData.maxImages = data.maxImages;
      if (data.maxVideos !== undefined) updateData.maxVideos = data.maxVideos;
      if (data.maxBusinessImages !== undefined) updateData.maxBusinessImages = data.maxBusinessImages;
      if (data.maxBusinessVideos !== undefined) updateData.maxBusinessVideos = data.maxBusinessVideos;
      if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
      if (data.description !== undefined) updateData.description = data.description;
      if (data.active !== undefined) updateData.active = data.active;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      await db.update(plans)
        .set(updateData)
        .where(eq(plans.id, id))
        .run();

      // Fetch updated plan
      const updated = await db.select()
        .from(plans)
        .where(eq(plans.id, id))
        .limit(1)
        .get();

      return {
        success: true,
        data: updated ? {
          ...updated,
          features: updated.features ? JSON.parse(updated.features) : [],
        } : null,
      };
    },
  }),

  // Delete plan (super_admin only)
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'super_admin') throw new Error('Only super_admin can delete plans');

      const db = await getDb();

      // Check plan exists
      const existing = await db.select()
        .from(plans)
        .where(eq(plans.id, input.id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Plan not found');

      // Check if any businesses are using this plan
      const businessesUsingPlan = await db.select({ count: count() })
        .from(businesses)
        .where(eq(businesses.planType, input.id))
        .get();

      if (businessesUsingPlan && businessesUsingPlan.count > 0) {
        throw new Error(`Cannot delete plan. ${businessesUsingPlan.count} business(es) currently using this plan.`);
      }

      await db.delete(plans).where(eq(plans.id, input.id)).run();

      return { success: true, message: 'Plan deleted' };
    },
  }),

  // Get active plans (public view)
  getActive: defineAction({
    handler: async () => {
      const db = await getDb();
      const activePlans = await db.select()
        .from(plans)
        .where(eq(plans.active, true))
        .orderBy(asc(plans.sortOrder))
        .all();

      return {
        success: true,
        data: activePlans.map(plan => ({
          ...plan,
          features: plan.features ? JSON.parse(plan.features) : [],
        })),
      };
    },
  }),
};