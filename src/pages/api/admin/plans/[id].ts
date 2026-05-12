// Admin API - Update single plan
export const prerender = false;

import { getDb } from '@/lib/db';
import { plans, businessPages } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { z } from 'zod';

const UpdatePlanSchema = z.object({
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

export async function DELETE({ params, request }: { params: { id: string }; request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== 'super_admin') {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Only super_admin can delete plans' }
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = await getDb();
  const { id } = params;

  try {
    // Check plan exists
    const existing = await db.select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1)
      .get();

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Plan not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if any businesses are using this plan
    const businessesUsingPlan = await db.select({ count: count() })
      .from(businessPages)
      .where(eq(businessPages.planType, id))
      .get();

    if (businessesUsingPlan && businessesUsingPlan.count > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: `Cannot delete plan. ${businessesUsingPlan.count} business(es) currently using this plan.`,
          hint: 'Deactivate the plan instead to prevent new subscriptions while keeping existing businesses active.'
        }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.delete(plans).where(eq(plans.id, id)).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Plan deleted'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to delete plan' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
    return unauthorizedResponse();
  }

  const db = await getDb();
  const { id } = params;

  try {
    const body = await request.json();
    const parsed = UpdatePlanSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid request data', details: parsed.error.flatten() }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { name, amount, skuLimit, maxImages, maxVideos, maxBusinessImages, maxBusinessVideos, features, description, sortOrder, active } = parsed.data;

    // Check plan exists
    const existing = await db.select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1)
      .get();

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Plan not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (name !== undefined) updateData.name = name;
    if (amount !== undefined) updateData.amount = amount;
    if (skuLimit !== undefined) updateData.skuLimit = skuLimit;
    if (maxImages !== undefined) updateData.maxImages = maxImages;
    if (maxVideos !== undefined) updateData.maxVideos = maxVideos;
    if (maxBusinessImages !== undefined) updateData.maxBusinessImages = maxBusinessImages;
    if (maxBusinessVideos !== undefined) updateData.maxBusinessVideos = maxBusinessVideos;
    if (features !== undefined) updateData.features = JSON.stringify(features);
    if (description !== undefined) updateData.description = description;
    if (active !== undefined) updateData.active = active;

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

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...updated,
        features: (() => {
          try {
            return updated?.features ? JSON.parse(updated.features) : [];
          } catch {
            return [];
          }
        })(),
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to update plan' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
