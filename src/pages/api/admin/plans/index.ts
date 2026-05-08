// Admin API - List all plans
export const prerender = false;

import { getDb } from '@/lib/db';
import { plans } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

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
