// Admin API - Update User Role
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

type Role = 'user' | 'editor' | 'admin' | 'super_admin';

const VALID_ROLES: Role[] = ['user', 'editor', 'admin', 'super_admin'];

async function requireSuperAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser || adminUser.role !== 'super_admin') {
    return { authorized: false, error: unauthorizedResponse() };
  }
  return { authorized: true, user: adminUser };
}

export async function PATCH({ request, params }: { request: Request; params: { id: string } }) {
  const authResult = await requireSuperAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  const currentUser = authResult.user;
  const targetUserId = params.id;

  try {
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !VALID_ROLES.includes(role)) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_ROLE', message: 'Invalid role specified' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const db = await getDb();
if (!db) throw new Error("Database not available");

    // Get target user
    const targetUser = await db.select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1)
      .get() ?? undefined;

    if (!targetUser) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Prevent self-demotion
    if (targetUserId === currentUser.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'SELF_DEMOTION', message: 'Cannot change your own role' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Update role
    await db.update(users)
      .set({ role, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(users.id, targetUserId))
      .run();

    return new Response(JSON.stringify({
      success: true,
      data: { id: targetUserId, role }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error instanceof Error ? error.message : 'Failed to update role' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
