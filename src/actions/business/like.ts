// Business Server Action - Like/Save
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createErrorResponse, ErrorCode } from '@/lib/errors';


export const like = defineAction({
  accept: 'form',
  input: z.object({
    slug: z.string().min(1, 'Slug is required'),
    action: z.enum(['like', 'save']),
  }),
  handler: async (input) => {
    const db = await getDb();
if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");

    try {
      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .limit(1)
        .get() ?? undefined;

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      if (input.action === 'like') {
        await db.update(businesses)
          .set({ likes: (business.likes || 0) + 1 })
          .where(eq(businesses.id, business.id))
          .run();

        return { success: true, data: { likes: (business.likes || 0) + 1 } };
      }

      if (input.action === 'save') {
        await db.update(businesses)
          .set({ saves: (business.saves || 0) + 1 })
          .where(eq(businesses.id, business.id))
          .run();

        return { success: true, data: { saves: (business.saves || 0) + 1 } };
      }

      return { success: false, error: { message: 'Invalid action' } };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});