// Products Update Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { canEditBusiness } from '@/lib/subscription';
import { getAdminUser } from '@/lib/admin-auth';

const VALID_PRODUCT_TYPES = [
  'product', 'service', 'virtual', 'ticket', 'rental', 'subscription'
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const UpdateProductSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  priceFields: z.record(z.unknown()).optional().nullable(),
  productType: z.enum(['product', 'service', 'virtual', 'ticket', 'rental', 'subscription']).optional(),
  specifications: z.record(z.unknown()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  businessId: z.string().optional(),
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
      if (input.businessId) {
        const check = await canEditBusiness(input.businessId);
        if (!check.can) {
          return { success: false, error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' } };
        }
      }

      const existing = await db.select().from(products).where(eq(products.id, input.id)).limit(1).get();
      if (!existing) {
        return { success: false, error: { message: 'Product not found' } };
      }

      // Check grace period for existing product's business
      if (existing.businessId) {
        const check = await canEditBusiness(existing.businessId);
        if (!check.can) {
          return { success: false, error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' } };
        }
      }

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description || null;
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId || null;
      if (input.priceFields !== undefined) updateData.priceFields = input.priceFields ? JSON.stringify(input.priceFields) : null;
      if (input.productType !== undefined) updateData.productType = VALID_PRODUCT_TYPES.includes(input.productType) ? input.productType : 'product';
      if (input.specifications !== undefined) updateData.specifications = input.specifications ? JSON.stringify(input.specifications) : null;
      if (input.images !== undefined) updateData.images = input.images ? JSON.stringify(input.images) : null;
      if (input.featured !== undefined) updateData.featured = input.featured;
      if (input.active !== undefined) updateData.active = input.active;
      if (input.businessId !== undefined) updateData.businessId = input.businessId;

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = Math.floor(Date.now() / 1000);
        await db.update(products).set(updateData).where(eq(products.id, input.id)).run();
      }

      const updated = await db.select().from(products).where(eq(products.id, input.id)).limit(1).get();
      const parsedUpdated = updated ? {
        ...updated,
        priceFields: updated.priceFields ? parseJsonField(updated.priceFields as string) : null,
        specifications: updated.specifications ? parseJsonField(updated.specifications as string) : null,
        images: updated.images ? parseJsonField(updated.images as string) : null,
      } : null;

      return { success: true, data: parsedUpdated };
    } catch (error) {
      console.error('[Products:update] Database update failed:', getErrorMessage(error));
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});

export const deleteProduct = defineAction({
  input: z.object({ id: z.string() }),
  handler: async (input, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
    try {
      await db.delete(products).where(eq(products.id, input.id)).run();
      return { success: true };
    } catch (error) {
      console.error('[Products:delete] Database delete failed:', getErrorMessage(error));
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});