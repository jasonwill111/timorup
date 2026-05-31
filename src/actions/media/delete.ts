// Media Delete Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { getR2Bucket } from '@/lib/media';
import { createErrorResponse, ErrorCode } from '@/lib/errors';


export const deleteMedia = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async (input) => {
    const db = await getDb();
if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    const auth = await initAuth();
    const sessionResult = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => null);
    const user = (sessionResult as { user?: { id: string; role?: string } } | null)?.user;

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
    }

    try {
      const item = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      if (item.length === 0 || !item[0]) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } };
      }

      const mediaItem = item[0]!;
      const userRole = (user as { role?: string }).role;
      if (mediaItem.createdById !== user.id && userRole !== 'admin' && userRole !== 'super_admin') {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
      }

      // Delete from R2 if R2Key is present
      if (mediaItem?.r2Key) {
        const bucket = getR2Bucket();
        if (bucket) {
          try {
            await bucket.delete(mediaItem.r2Key);
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