// Media Update Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const updateMedia = defineAction({
  input: z.object({
    id: z.string(),
    url: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    alt: z.string().optional(),
    businessId: z.string().optional(),
  }),
  handler: async (input) => {
    const db = await getDb();
    const auth = await initAuth();
    const { user } = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => ({ user: null, session: null }));

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
    }

    try {
      const [existing] = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      if (!existing || existing.createdById !== user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
      }

      const [updated] = await db.update(media)
        .set({
          url: input.url || existing.url,
          width: input.width || existing.width,
          height: input.height || existing.height,
          alt: input.alt || existing.alt,
          businessId: input.businessId || existing.businessId,
        })
        .where(eq(media.id, input.id))
        .returning();

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: { code: 'UPDATE_ERROR', message: getErrorMessage(error) } };
    }
  },
});