// Admin API - SKUs Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  const skus = await db.select().from(products).orderBy(desc(products.createdAt)).all();

  return new Response(JSON.stringify({
    success: true,
    data: skus
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}