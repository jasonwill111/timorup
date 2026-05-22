/**
 * Products table (SKU for businesses)
 * TimorUp
 *
 * priceAmount + priceUnit (unified with listings)
 * specifications: JSON with type-specific attributes
 * images: JSON array of media IDs
 */
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const products = sqliteTable("products", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),  // 产品必须在 business 下
  categoryId: text("category_id"),
  title: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  productType: text("product_type").default("product"),  // product | service | virtual | ticket | rental | subscription

  // Price (amount + unit)
  priceAmount: real("price_amount"),
  priceUnit: text("price_unit"),

  // Type-specific attributes
  specifications: text(),
  images: text().default("[]"),

  featured: integer().default(0),
  active: integer().default(1),
  sortOrder: integer("sort_order").default(0),

  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("products_business_idx").on(table.businessId),
  index("products_category_idx").on(table.categoryId),
  uniqueIndex("products_slug_idx").on(table.slug),
  uniqueIndex("products_business_slug_idx").on(table.businessId, table.slug),  // 防重复
  index("products_business_category_idx").on(table.businessId, table.categoryId),
  index("products_business_active_idx").on(table.businessId, table.active),
  index("products_active_idx").on(table.active),
]);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;