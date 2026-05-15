// Business Server Action - Create Update (News)
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses, latestUpdates } from '@/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const createUpdate = defineAction({
  accept: 'form',
  input: z.object({
    slug: z.string().min(1, 'Business slug is required'),
    content: z.string().min(1, 'Content is required').max(2000, 'Content must be under 2000 characters'),
    images: z.array(z.string()).max(4).optional(),
  }),
  handler: async (input, { cookies }) => {
    const db = await getDb();

    try {
      // Authenticate
      const authApi = (await initAuth()).api;
      const cookieValue = cookies.get('better-auth.session_token')?.value || '';

      const session = await authApi.getSession({
        headers: { cookie: cookieValue ? `better-auth.session_token=${cookieValue}` : '' },
      });

      if (!session?.user) {
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in' } };
      }

      // Get business
      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .get();

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      if (business.ownerId !== session.user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission' } };
      }

      // Check daily limit (max 5 updates per day)
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const todayPosts = await db.select()
        .from(latestUpdates)
        .where(eq(latestUpdates.typeId, business.id))
        .where(eq(latestUpdates.type, 'businesses'))
        .all();

      const businessUpdates = todayPosts.filter(u => {
        const createdAt = typeof u.createdAt === 'number' ? u.createdAt : new Date(u.createdAt as unknown as string).getTime() / 1000;
        return createdAt >= todayStart.getTime() / 1000 && createdAt <= todayEnd.getTime() / 1000;
      });

      if (businessUpdates.length >= 5) {
        return { success: false, error: { message: 'Daily limit reached. You can only post 5 updates per day.' } };
      }

      const id = `upd-${Math.floor(Date.now() / 1000)}-${Math.random().toString(36).substr(2, 9)}`;

      await db.insert(latestUpdates).values({
        id,
        type: 'business',
        typeId: business.id,
        content: input.content,
        imageIds: input.images ? JSON.stringify(input.images) : null,
      }).run();

      return { success: true, data: { id, content: input.content } };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});

export const listUpdates = defineAction({
  accept: 'form',
  input: z.object({
    slug: z.string().min(1, 'Business slug is required'),
  }),
  handler: async (input) => {
    const db = await getDb();

    try {
      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .get();

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      const updates = await db.select()
        .from(latestUpdates)
        .where(eq(latestUpdates.typeId, business.id))
        .where(eq(latestUpdates.type, 'businesses'))
        .orderBy(desc(latestUpdates.createdAt))
        .limit(4)
        .all();

      const updatesWithImages = updates.map(u => ({
        ...u,
        images: u.images ? JSON.parse(u.images) : (u.imageIds ? JSON.parse(u.imageIds) : []),
      }));

      return { success: true, data: updatesWithImages };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});

export const deleteUpdate = defineAction({
  input: z.object({
    slug: z.string().min(1),
    id: z.string().min(1),
  }),
  handler: async (input, { cookies }) => {
    const db = await getDb();

    try {
      const authApi = (await initAuth()).api;
      const cookieValue = cookies.get('better-auth.session_token')?.value || '';
      const session = await authApi.getSession({
        headers: { cookie: cookieValue ? `better-auth.session_token=${cookieValue}` : '' },
      });

      if (!session?.user) {
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
      }

      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .get();

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      if (business.ownerId !== session.user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
      }

      await db.delete(latestUpdates).where(eq(latestUpdates.id, input.id)).run();
      return { success: true };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});