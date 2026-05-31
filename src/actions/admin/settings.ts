// Astro Server Actions for Admin Settings Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

export const settings = {
  // Get all settings
  getAll: defineAction({
    handler: async () => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
      const settingsResult = await db.select().from(siteSettings).all() as { key: string; value: string }[];

      const settings: Record<string, unknown> = {};
      settingsResult.forEach((s) => {
        if (s.key === 'payment_info') {
          settings[s.key] = { qrCode: s.value };
        } else {
          settings[s.key] = { value: s.value };
        }
      });

      return { success: true, data: settings };
    },
  }),

  // Update a single setting
  update: defineAction({
    input: z.object({
      key: z.string(),
      value: z.string(),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const existing = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1)
        .get();

      if (existing) {
        await db.update(siteSettings)
          .set({ value: input.value, updatedAt: Math.floor(Date.now() / 1000) })
          .where(eq(siteSettings.key, input.key))
          .run();
      } else {
        await db.insert(siteSettings).values({
          id: `setting-${Date.now()}`,
          key: input.key,
          value: input.value,
        }).run();
      }

      return { success: true, data: { key: input.key, value: input.value } };
    },
  }),

  // Save all settings at once
  saveAll: defineAction({
    input: z.object({
      settings: z.record(z.string(), z.union([
        z.string(),
        z.object({ value: z.string().optional() }),
        z.object({ qrCode: z.string().optional() }),
      ])),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      for (const [key, valueObj] of Object.entries(input.settings)) {
        let value: string;
        if (typeof valueObj === 'object' && valueObj !== null && 'value' in valueObj) {
          value = String((valueObj as { value?: string }).value ?? '');
        } else if (typeof valueObj === 'object' && valueObj !== null && 'qrCode' in valueObj) {
          value = String((valueObj as { qrCode?: string }).qrCode ?? '');
        } else {
          value = String(valueObj ?? '');
        }

        const existing = await db.select()
          .from(siteSettings)
          .where(eq(siteSettings.key, key))
          .limit(1)
          .get();

        if (existing) {
          await db.update(siteSettings)
            .set({ value, updatedAt: Math.floor(Date.now() / 1000) })
            .where(eq(siteSettings.key, key))
            .run();
        } else {
          await db.insert(siteSettings)
            .values({ id: key, key, value })
            .run();
        }
      }

      return { success: true, message: 'Settings saved successfully' };
    },
  }),
};