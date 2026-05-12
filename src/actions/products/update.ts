// Products Update Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { canEditBusiness } from '@/lib/subscription';
import { getAdminUser } from '@/lib/admin-auth';

const VALID_SERVICE_TYPES = [
  'product', 'service', 'rental', 'food',
  'accommodation', 'automotive', 'healthcare',
  'education', 'beauty', 'event'
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const UpdateProductSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  price: z.number().optional().nullable(),
  priceUnit: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  priceFields: z.record(z.unknown()).optional().nullable(),
  serviceType: z.string().optional(),
  specifications: z.record(z.unknown()).optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  businessPageId: z.string().optional(),
});

const parseJsonField = (val: string): unknown => {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export const updateProduct = defineAction({
  input: UpdateProductSchema,
  handler: async (input, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();

    try {
      // Check grace period if updating business association
      if (input.businessPageId) {
        const check = await canEditBusiness(input.businessPageId);
        if (!check.can) {
          return { success: false, error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' } };
        }
      }

      const existing = await db.select().from(products).where(eq(products.id, input.id)).limit(1).get();
      if (!existing) {
        return { success: false, error: { message: 'Product not found' } };
      }

      // Check grace period for existing product's business
      if (existing.businessPageId) {
        const check = await canEditBusiness(existing.businessPageId);
        if (!check.can) {
          return { success: false, error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' } };
        }
      }

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.price !== undefined) updateData.price = input.price || null;
      if (input.priceUnit !== undefined) updateData.priceUnit = input.priceUnit || null;
      if (input.description !== undefined) updateData.description = input.description || null;
      if (input.priceFields !== undefined) updateData.priceFields = input.priceFields ? JSON.stringify(input.priceFields) : null;
      if (input.serviceType !== undefined) updateData.serviceType = VALID_SERVICE_TYPES.includes(input.serviceType) ? input.serviceType : 'product';
      if (input.specifications !== undefined) updateData.specifications = input.specifications ? JSON.stringify(input.specifications) : null;
      if (input.featured !== undefined) updateData.featured = input.featured;
      if (input.active !== undefined) updateData.active = input.active;

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = Math.floor(Date.now() / 1000);
        await db.update(products).set(updateData).where(eq(products.id, input.id)).run();
      }

      const updated = await db.select().from(products).where(eq(products.id, input.id)).limit(1).get();
      const parsedUpdated = updated ? {
        ...updated,
        priceFields: updated.priceFields ? parseJsonField(updated.priceFields as string) : null,
        specifications: updated.specifications ? parseJsonField(updated.specifications as string) : null,
      } : null;

      return { success: true, data: parsedUpdated };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});