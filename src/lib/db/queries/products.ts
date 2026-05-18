/**
 * Product Query Functions
 * 统一 products 数据访问
 */
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export interface ProductWithImages {
  id: string;
  businessId: string;
  categoryId: string | null;
  title: string;
  description: string | null;
  productType: string;
  priceFields: Record<string, unknown> | null;
  specifications: Record<string, unknown> | null;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: number | null;
  updatedAt: number | null;
}

/**
 * 获取 product by ID
 */
export async function getProductById(productId: string): Promise<ProductWithImages | null> {
  const db = await getDb();
if (!db) throw new Error("Database not available");

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)
    .get() ?? undefined;

  if (!product) return null;

  return {
    id: product.id,
    businessId: product.businessId,
    categoryId: product.categoryId,
    title: product.title,
    description: product.description,
    productType: product.productType || 'product',
    priceFields: product.priceFields ? JSON.parse(product.priceFields as string) : null,
    specifications: product.specifications ? JSON.parse(product.specifications as string) : null,
    images: product.images ? JSON.parse(product.images as string) : [],
    featured: !!product.featured,
    active: !!product.active,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/**
 * 获取 business 的 products
 */
export async function getBusinessProducts(
  businessId: string,
  options?: {
    active?: boolean;
    limit?: number;
  }
): Promise<ProductWithImages[]> {
  const db = await getDb();
if (!db) throw new Error("Database not available");
  const { active = true, limit = 50 } = options || {};

  const conditions = [eq(products.businessId, businessId)];
  if (active !== undefined) {
    conditions.push(eq(products.active, active ? 1 : 0));
  }

  const productList = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .all();

  return productList.map(p => ({
    id: p.id,
    businessId: p.businessId,
    categoryId: p.categoryId,
    title: p.title,
    description: p.description,
    productType: p.productType || 'product',
    priceFields: p.priceFields ? JSON.parse(p.priceFields as string) : null,
    specifications: p.specifications ? JSON.parse(p.specifications as string) : null,
    images: p.images ? JSON.parse(p.images as string) : [],
    featured: !!p.featured,
    active: !!p.active,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

/**
 * 获取 business 的产品数量
 */
export async function getBusinessProductCount(businessId: string): Promise<number> {
  const db = await getDb();
if (!db) throw new Error("Database not available");

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.businessId, businessId))
    .all();

  return result[0]?.count ?? 0;
}

/**
 * 检查用户是否可以创建更多产品
 */
export async function canCreateProduct(
  businessId: string,
  skuLimit: number
): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
  const currentCount = await getBusinessProductCount(businessId);

  return {
    canCreate: currentCount < skuLimit,
    currentCount,
    limit: skuLimit,
  };
}
