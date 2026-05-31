// Products Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { canCreateSku } from '@/lib/subscription';
import { verifyBusinessExists } from '@/lib/db/queries/businesses';
import { createErrorResponse, ErrorCode } from '@/lib/errors';


const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  businessId: z.string().min(1),
  categoryId: z.string().min(1),
  productType: z.enum([
    'product', 'service', 'virtual', 'ticket', 'rental',
    'food', 'accommodation', 'automotive', 'healthcare',
    'education', 'beauty', 'event', 'subscription'
  ]).default('product'),
  specifications: z.record(z.string(), z.unknown()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  featured: z.boolean().optional().default(false),
});

export const createProduct = defineAction({
  input: CreateProductSchema,
  handler: async (input, { cookies }) => {
    // Use requireAdmin for unified auth
    const authResult = await requireAdmin(cookies);
    if ('error' in authResult) {
      return { success: false, error: { code: authResult.error, message: 'Admin access required' } };
    }

    try {
      // Verify business via query layer
      const businessExists = await verifyBusinessExists(input.businessId);
      if (!businessExists) {
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

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");

      await db.insert(products).values({
        id,
        slug: `prod-${id}`,
        title: input.title,
        description: input.description ?? null,
        businessId: input.businessId,
        businessPageId: input.businessId,
        categoryId: input.categoryId,
        productType: finalProductType,
        serviceType: finalProductType,
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