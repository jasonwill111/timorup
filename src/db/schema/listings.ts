/**
 * Listings table
 * TimorUp
 *
 * 有 7 天免费试用期
 * 续费后重新计算 expiresAt
 */
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const listings = sqliteTable("listings", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),
  description: text("description", { length: 255 }).notNull(),

  // Price (amount + unit)
  priceAmount: real("price_amount"),
  priceUnit: text("price_unit"),
  condition: text(),

  // Location
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),

  // Contact
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  email: text(),
  imageIds: text("image_ids"),
  tags: text(),

  // Stats
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  shares: integer().default(0),

  // Expiration (null = 永久/付费)
  expiresAt: integer("expires_at"),
  lastRenewedAt: integer("last_renewed_at"),

  // Admin
  featured: integer().default(0),
  featuredUntil: integer("featured_until"),

  // Legacy (type-specific data)
  extraData: text("extra_data"),

  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("listings_slug_idx").on(table.slug),
  index("listings_owner_idx").on(table.ownerId),
  index("listings_status_idx").on(table.status),
  index("listings_category_idx").on(table.categoryId),
  index("listings_featured_idx").on(table.featured),
  index("listings_expires_idx").on(table.expiresAt),
]);

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;