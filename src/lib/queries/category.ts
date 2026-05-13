/**
 * Category Query Functions
 * Centralized data access for entity-specific categories
 */
import { getDb } from '@/lib/db';
import {
  businessCategories,
  nonProfitCategories,
  publicSectorCategories,
  listingCategories,
} from '@/db/schema';
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
}

export interface CategoryWithChildren extends CategoryInfo {
  children: CategoryInfo[];
}

export type EntityType = 'business' | 'nonprofit' | 'public_sector' | 'listing';

function getCategoryTable(entityType: EntityType) {
  switch (entityType) {
    case 'business':
      return businessCategories;
    case 'nonprofit':
      return nonProfitCategories;
    case 'public_sector':
      return publicSectorCategories;
    case 'listing':
      return listingCategories;
  }
}

/**
 * Get all categories for an entity type
 */
export async function getAllCategories(
  entityType: EntityType = 'business'
): Promise<Result<CategoryInfo[]>> {
  try {
    const db = await getDb();
    const table = getCategoryTable(entityType);

    const results = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .orderBy(asc(table.name))
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
  slug: string,
  entityType: EntityType = 'business'
): Promise<Result<CategoryInfo | null>> {
  try {
    const db = await getDb();
    const table = getCategoryTable(entityType);

    const result = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .where(eq(table.slug, slug))
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
  id: string,
  entityType: EntityType = 'business'
): Promise<Result<CategoryInfo | null>> {
  try {
    const db = await getDb();
    const table = getCategoryTable(entityType);

    const result = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .where(eq(table.id, id))
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
  slug: string,
  entityType: EntityType = 'business'
): Promise<Result<CategoryWithChildren | null>> {
  try {
    const db = await getDb();
    const table = getCategoryTable(entityType);

    // Get parent category
    const parent = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .where(eq(table.slug, slug))
      .limit(1)
      .get();

    if (!parent) {
      return success(null);
    }

    // Get children
    const children = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .where(eq(table.parentId, parent.id))
      .orderBy(asc(table.name))
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
  entityType: EntityType = 'business'
): Promise<Result<CategoryInfo[]>> {
  try {
    const db = await getDb();
    const table = getCategoryTable(entityType);

    const results = await db
      .select({
        id: table.id,
        name: table.name,
        slug: table.slug,
        description: table.description,
        icon: table.icon,
        parentId: table.parentId,
      })
      .from(table)
      .where(isNull(table.parentId))
      .orderBy(asc(table.name))
      .all();

    return success(results);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}