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
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  sku: string | null;
  stock: number | null;
  status: string;
  createdAt: number | Date;
  images: Array<{ id: string; url: string; alt: string | null }>;
}

/**
 * 获取 product by ID
 */
export async function getProductById(productId: string): Promise<ProductWithImages | null> {
  const db = await getDb();

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)
    .get();

  if (!product) return null;

  // images stored as JSON in products.images field
  return {
    ...product,
    images: [],
  };
}

/**
 * 获取 business 的 products
 */
export async function getBusinessProducts(
  businessId: string,
  options?: {
    status?: string;
    limit?: number;
  }
): Promise<ProductWithImages[]> {
  const db = await getDb();
  const { status = 'active', limit = 50 } = options || {};

  const conditions = [eq(products.businessId, businessId)];
  if (status) {
    conditions.push(eq(products.active, status === 'active' ? 1 : 0));
  }

  const productList = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .all();

  return productList.map(p => ({
    ...p,
    images: [],
  }));
}

/**
 * 获取 business 的产品数量
 */
export async function getBusinessProductCount(businessId: string): Promise<number> {
  const db = await getDb();

  const result = await db
    .select()
    .from(products)
    .where(eq(products.businessId, businessId))
    .all();

  return result.length;
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
