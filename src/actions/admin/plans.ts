// Astro Server Actions for Admin Plans Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { plans as plansTable } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

// Input validation schema
const UpdatePlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  period: z.enum(['monthly', 'yearly']),
  amount: z.coerce.number().int().min(0),
  skuLimit: z.coerce.number().int().min(0),
  maxImages: z.coerce.number().int().min(0),
  maxVideos: z.coerce.number().int().min(0),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const adminPlans = {
  // Get all plans (admin view - includes inactive)
  getAll: defineAction({
    handler: async () => {
      const db = await getDb();
      const allPlans = await db.select()
        .from(plansTable)
        .orderBy(asc(plansTable.sortOrder))
        .all();

      return allPlans.map(plan => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
      }));
    }
  }),

  // Update a plan
  update: defineAction({
    input: UpdatePlanSchema,
    handler: async (input) => {
      const db = await getDb();

      // Build update data
      const updateData: Record<string, unknown> = {
        name: input.name,
        period: input.period,
        amount: input.amount,
        skuLimit: input.skuLimit,
        maxImages: input.maxImages,
        maxVideos: input.maxVideos,
        description: input.description || null,
        features: input.features ? JSON.stringify(input.features) : null,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
        updatedAt: Math.floor(Date.now() / 1000),
      };

      await db.update(plansTable)
        .set(updateData)
        .where(eq(plansTable.id, input.id))
        .run();

      // Fetch updated plan
      const updated = await db.select()
        .from(plansTable)
        .where(eq(plansTable.id, input.id))
        .limit(1)
        .get();

      return {
        success: true,
        data: updated ? {
          ...updated,
          features: updated.features ? JSON.parse(updated.features) : [],
        } : null,
      };
    }
  }),

  // Get active plans (public view)
  getActive: defineAction({
    handler: async () => {
      const db = await getDb();
      const activePlans = await db.select()
        .from(plansTable)
        .where(eq(plansTable.active, true))
        .orderBy(asc(plansTable.sortOrder))
        .all();

      return activePlans.map(plan => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
      }));
    }
  }),
};
