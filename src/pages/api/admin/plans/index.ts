// Admin API - List and create plans
export const prerender = false;

import { getDb } from '@/lib/db';
import { plans } from '@/db/schema';
import { asc, eq, and } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { z } from 'zod';

const CreatePlanSchema = z.object({
  name: z.string().min(1).max(100),
  period: z.enum(['monthly', 'yearly']),
  amount: z.number().positive(),
  skuLimit: z.number().int().nonnegative(),
  maxImages: z.number().int().nonnegative(),
  maxVideos: z.number().int().nonnegative(),
  features: z.array(z.string()).default([]),
  description: z.string().max(500).default(''),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
    return unauthorizedResponse();
  }

  const db = await getDb();

  try {
    const allPlans = await db.select()
      .from(plans)
      .orderBy(asc(plans.sortOrder))
      .all();

    const plansWithParsedFeatures = allPlans.map(plan => ({
      ...plan,
      features: (() => {
        try {
          return plan.features ? JSON.parse(plan.features) : [];
        } catch {
          return [];
        }
      })(),
    }));

    return new Response(JSON.stringify({
      success: true,
      data: plansWithParsedFeatures,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch plans' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== 'super_admin') {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Only super_admin can create plans' }
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = await getDb();

  try {
    const body = await request.json();
    const parsed = CreatePlanSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid request data', details: parsed.error.flatten() }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { name, period, amount, skuLimit, maxImages, maxVideos, features, description, active, sortOrder } = parsed.data;

    // Check for duplicate name + period combination
    const existingPlan = await db.select()
      .from(plans)
      .where(and(
        eq(plans.name, name),
        eq(plans.period, period)
      ))
      .limit(1)
      .get();

    if (existingPlan) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: `A ${period} plan named "${name}" already exists` }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate plan ID
    const planId = `${name.toLowerCase().replace(/\s+/g, '-')}-${period}-${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);

    await db.insert(plans).values({
      id: planId,
      name,
      period,
      amount,
      skuLimit,
      maxImages,
      maxVideos,
      features: JSON.stringify(features),
      description,
      active,
      sortOrder,
      createdAt: now,
      updatedAt: now,
    }).run();

    // Fetch created plan
    const created = await db.select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1)
      .get();

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...created,
        features: features,
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create plan' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}