/**
 * Product Categories (SKU 分类)
 * TimorUp
 *
 * 42 categories with formFields for type-specific fields
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const productCategories = sqliteTable("product_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  formFields: text("form_fields"),  // JSON: type-specific form fields
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("product_categories_slug_idx").on(table.slug),
  index("product_categories_parent_idx").on(table.parentId),
]);

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;