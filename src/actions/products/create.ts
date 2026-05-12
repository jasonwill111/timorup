// Products Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { products, businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { canCreateSku, canEditBusiness } from '@/lib/subscription';
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

const CreateProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().optional().nullable(),
  priceUnit: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  businessPageId: z.string().min(1),
  priceFields: z.record(z.unknown()).optional().nullable(),
  serviceType: z.string().optional().default('product'),
  specifications: z.record(z.unknown()).optional().nullable(),
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
    try {
      // Check business exists
      const business = await db.select({
        id: businessPages.id,
        entityType: businessPages.entityType,
      })
      .from(businessPages)
      .where(eq(businessPages.id, input.businessPageId))
      .limit(1)
      .get();

      if (!business) {
        return { success: false, error: { message: 'Business not found' } };
      }

      // Non-profits cannot have SKUs
      if (business.entityType === 'nonprofit') {
        return { success: false, error: { message: 'Non-profit listings cannot have SKUs' } };
      }

      // Check subscription status and SKU limit
      const canCreate = await canCreateSku(input.businessPageId);
      if (!canCreate.can) {
        return { success: false, error: { code: 'SKU_NOT_ALLOWED', message: canCreate.reason || 'Cannot create SKU' } };
      }

      const id = `prod-${Date.now()}`;
      const finalServiceType = VALID_SERVICE_TYPES.includes(input.serviceType) ? input.serviceType : 'product';

      const safeStringify = (val: unknown): string | null => {
        if (!val) return null;
        if (typeof val === 'string') {
          try { JSON.parse(val); return val; } catch { return val; }
        }
        return JSON.stringify(val);
      };

      await db.insert(products).values({
        id,
        title: input.title,
        price: input.price ?? null,
        priceUnit: input.priceUnit ?? null,
        description: input.description ?? null,
        businessPageId: input.businessPageId,
        priceFields: safeStringify(input.priceFields),
        serviceType: finalServiceType,
        specifications: safeStringify(input.specifications),
        featured: input.featured ?? false,
        active: true,
      }).run();

      return {
        success: true,
        data: { id, title: input.title, price: input.price, priceFields: input.priceFields, serviceType: finalServiceType, specifications: input.specifications, featured: input.featured, description: input.description },
      };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});