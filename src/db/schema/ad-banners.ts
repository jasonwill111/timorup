/**
 * Ad Banners table
 * TimorUp
 *
 * position: homepage | businesses | products-services | listings
 * linkType: business | listing | product
 * Max 4 banners per position
 */
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

export const adBanners = sqliteTable("ad_banners", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),
  imageId: text("image_id"),
  linkUrl: text("link_url"),               // slug
  linkType: text("link_type").notNull(),  // business | listing | product
  position: text().notNull(),             // homepage | businesses | products-services | listings
  sortOrder: integer("sort_order").default(0),
  orderId: text("order_id"),              // FK to orders (paid banners)
  isActive: integer("is_active").default(1),
  startDate: integer("start_date"),
  endDate: integer("end_date"),
  clickCount: integer("click_count").default(0),  // 点击统计
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("ad_banners_position_idx").on(table.position),
  index("ad_banners_active_idx").on(table.isActive),
  index("ad_banners_order_idx").on(table.orderId),
]);

export type AdBanner = typeof adBanners.$inferSelect;
export type NewAdBanner = typeof adBanners.$inferInsert;