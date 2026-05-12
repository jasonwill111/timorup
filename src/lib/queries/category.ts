/**
 * Category Query Functions
 * Centralized data access for categories
 */
import { getDb } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq, and, asc, isNull } from 'drizzle-orm';
import { success, error, type Result } from './result';

// Types
export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  entityType: 'business' | 'nonprofit' | null;
}

export interface CategoryWithChildren extends CategoryInfo {
  children: CategoryInfo[];
}

/**
 * Get all categories
 */
export async function getAllCategories(
  entityType?: 'business' | 'nonprofit' | 'all'
): Promise<Result<CategoryInfo[]>> {
  try {
    const db = await getDb();

    const conditions = [];
    if (entityType && entityType !== 'all') {
      conditions.push(eq(categories.entityType, entityType));
    }

    const results = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(categories.name))
      .all();

    return success(results);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Result<CategoryInfo | null>> {
  try {
    const db = await getDb();
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)
      .get();

    return success(result ?? null);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(
  id: string
): Promise<Result<CategoryInfo | null>> {
  try {
    const db = await getDb();
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)
      .get();

    return success(result ?? null);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get category with children
 */
export async function getCategoryWithChildren(
  slug: string
): Promise<Result<CategoryWithChildren | null>> {
  try {
    const db = await getDb();

    // Get parent category
    const parent = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)
      .get();

    if (!parent) {
      return success(null);
    }

    // Get children
    const children = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(eq(categories.parentId, parent.id))
      .orderBy(asc(categories.name))
      .all();

    return success({
      ...parent,
      children,
    });
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get top-level categories (no parent)
 */
export async function getTopLevelCategories(
  entityType?: 'business' | 'nonprofit' | 'all'
): Promise<Result<CategoryInfo[]>> {
  try {
    const db = await getDb();

    const conditions = [isNull(categories.parentId)];
    if (entityType && entityType !== 'all') {
      conditions.push(eq(categories.entityType, entityType));
    }

    const results = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        parentId: categories.parentId,
        entityType: categories.entityType,
      })
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.name))
      .all();

    return success(results);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}