// Products Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { products, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { canCreateSku, canEditBusiness } from '@/lib/subscription';
import { getAdminUser } from '@/lib/admin-auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  businessId: z.string().min(1),
  categoryId: z.string().min(1),  // FK to product_categories.id
  productType: z.enum([
    'product', 'service', 'virtual', 'ticket', 'rental',
    'food', 'accommodation', 'automotive', 'healthcare',
    'education', 'beauty', 'event', 'subscription'
  ]).default('product'),
  specifications: z.record(z.string(), z.unknown()).optional().nullable(),  // { pricing: { basePrice, currency, unit, unitOptions, ... } }
  images: z.array(z.string()).optional().nullable(),
  featured: z.boolean().optional().default(false),
});

export const createProduct = defineAction({
  input: CreateProductSchema,
  handler: async (input, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      // Check business exists
      const business = await db.select({ id: businesses.id })
        .from(businesses)
        .where(eq(businesses.id, input.businessId))
        .limit(1)
        .get() ?? undefined;

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      // Check subscription status and SKU limit
      const canCreate = await canCreateSku(input.businessId);
      if (!canCreate.can) {
        return { success: false, error: { code: 'SKU_NOT_ALLOWED', message: canCreate.reason || 'Cannot create SKU' } };
      }

      const id = `prod-${Date.now()}`;
      const finalProductType = input.productType || 'product';

      // Stringify specifications
      const safeStringify = (val: unknown): string | null => {
        if (!val) return null;
        if (typeof val === 'string') {
          try { JSON.parse(val); return val; } catch { return val; }
        }
        return JSON.stringify(val);
      };

      await db.insert(products).values({
        id,
        slug: `prod-${id}`,
        title: input.title,
        description: input.description ?? null,
        businessId: input.businessId,
        businessPageId: input.businessId,
        categoryId: input.categoryId,
        productType: finalProductType,
        serviceType: finalProductType,  // Keep for compatibility
        specifications: safeStringify(input.specifications),
        images: input.images ? JSON.stringify(input.images) : '[]',
        featured: input.featured ? 1 : 0,
        active: 1,
      }).run();

      return {
        success: true,
        data: {
          id,
          title: input.title,
          productType: finalProductType,
          specifications: input.specifications,
        },
      };
    } catch (error) {
      console.error('[Products:create] Database insert failed:', getErrorMessage(error));
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});