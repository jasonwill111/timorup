// Media Delete Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { getR2Bucket } from '@/lib/media';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const deleteMedia = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async (input) => {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    const auth = await initAuth();
    const { user } = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => ({ user: null, session: null }));

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
    }

    try {
      const item = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      if (item.length === 0) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } };
      }

      const mediaItem = item[0];
      if (mediaItem.createdById !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
      }

      // Delete from R2 if URL is R2 path
      if (mediaItem.url && !mediaItem.url.startsWith('data:') && !mediaItem.url.startsWith('http')) {
        const bucket = getR2Bucket();
        if (bucket) {
          try {
            await bucket.delete(mediaItem.url);
          } catch (e) {
            console.error('Failed to delete from R2:', e);
          }
        }
      }

      await db.delete(media).where(eq(media.id, input.id));
      return { success: true };
    } catch (error) {
      return { success: false, error: { code: 'DELETE_ERROR', message: getErrorMessage(error) } };
    }
  },
});