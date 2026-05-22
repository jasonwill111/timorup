/**
 * Category Tables (4 independent tables with same structure)
 * TimorUp
 *
 * businessCategories, nonProfitCategories, publicSectorCategories, listingCategories
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

// Base category columns (slug uniqueness handled by uniqueIndex)
const baseCategoryColumns = {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull(),  // unique via uniqueIndex below
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
} as const;

// Business Categories
export const businessCategories = sqliteTable("business_categories", {
  ...baseCategoryColumns,
},
(table) => [
  uniqueIndex("business_categories_slug_idx").on(table.slug),
  index("business_categories_parent_idx").on(table.parentId),
]);

// Non-Profit Categories
export const nonProfitCategories = sqliteTable("non_profit_categories", {
  ...baseCategoryColumns,
},
(table) => [
  uniqueIndex("non_profit_categories_slug_idx").on(table.slug),
  index("non_profit_categories_parent_idx").on(table.parentId),
]);

// Public Sector Categories
export const publicSectorCategories = sqliteTable("public_sector_categories", {
  ...baseCategoryColumns,
},
(table) => [
  uniqueIndex("public_sector_categories_slug_idx").on(table.slug),
  index("public_sector_categories_parent_idx").on(table.parentId),
]);

// Listing Categories (with formFields)
export const listingCategories = sqliteTable("listing_categories", {
  ...baseCategoryColumns,
  formFields: text("form_fields"),  // JSON: dynamic form fields config
},
(table) => [
  uniqueIndex("listing_categories_slug_idx").on(table.slug),
  index("listing_categories_parent_idx").on(table.parentId),
]);

export type BusinessCategory = typeof businessCategories.$inferSelect;
export type NonProfitCategory = typeof nonProfitCategories.$inferSelect;
export type PublicSectorCategory = typeof publicSectorCategories.$inferSelect;
export type ListingCategory = typeof listingCategories.$inferSelect;