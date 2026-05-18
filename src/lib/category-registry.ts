/**
 * Category Table Registry
 * Typed registry for 4 separate category tables
 */
import {
  businessCategories,
  nonProfitCategories,
  publicSectorCategories,
  listingCategories,
} from '@/db/schema';

export type EntityType = 'business' | 'non_profit' | 'public_sector' | 'listing';

export const VALID_ENTITY_TYPES: readonly EntityType[] = [
  'business',
  'non_profit',
  'public_sector',
  'listing',
] as const;

export interface CategoryTableConfig {
  schema: typeof businessCategories
    | typeof nonProfitCategories
    | typeof publicSectorCategories
    | typeof listingCategories;
  tableName: string;
}

export const CATEGORY_TABLE_MAP: Record<EntityType, CategoryTableConfig> = {
  business: {
    schema: businessCategories,
    tableName: 'business_categories',
  },
  non_profit: {
    schema: nonProfitCategories,
    tableName: 'non_profit_categories',
  },
  public_sector: {
    schema: publicSectorCategories,
    tableName: 'public_sector_categories',
  },
  listing: {
    schema: listingCategories,
    tableName: 'listing_categories',
  },
};

export function isValidEntityType(type: string): type is EntityType {
  return VALID_ENTITY_TYPES.includes(type as EntityType);
}

export function getCategoryTable(type: EntityType): CategoryTableConfig {
  return CATEGORY_TABLE_MAP[type];
}

export function getValidEntityTypesMessage(): string {
  return VALID_ENTITY_TYPES.join(', ');
}