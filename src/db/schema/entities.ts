/**
 * Entity Tables (4 independent tables)
 * TimorUp
 *
 * businesses, nonProfits, publicSectors, listings
 */
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"

// ============================================
// Businesses (有订阅)
// ============================================
export const businesses = sqliteTable("businesses", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),

  // Images
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),

  // Contact
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),

  // Location
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),

  // Content
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),

  // Stats
  likes: integer().default(0),
  saves: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  views: integer().default(0),

  // Verification
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(0),
  socialLinks: text("social_links"),

  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("businesses_slug_idx").on(table.slug),
  index("businesses_owner_idx").on(table.ownerId),
  index("businesses_status_idx").on(table.status),
  index("businesses_category_idx").on(table.categoryId),
]);

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;

// ============================================
// Non-Profits (免费，无订阅)
// ============================================
export const nonProfits = sqliteTable("non_profits", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),

  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),

  // Stats
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),

  // Verification
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(0),
  socialLinks: text("social_links"),

  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("non_profits_slug_idx").on(table.slug),
  index("non_profits_owner_idx").on(table.ownerId),
  index("non_profits_status_idx").on(table.status),
  index("non_profits_category_idx").on(table.categoryId),
]);

export type NonProfit = typeof nonProfits.$inferSelect;
export type NewNonProfit = typeof nonProfits.$inferInsert;

// ============================================
// Public Sectors (免费，无订阅)
// ============================================
export const publicSectors = sqliteTable("public_sectors", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),

  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),

  // Stats
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),

  // Verification
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(0),
  socialLinks: text("social_links"),

  // Government data
  governmentData: text("government_data"),  // JSON: { department, serviceTypes, ... }

  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("public_sectors_slug_idx").on(table.slug),
  index("public_sectors_owner_idx").on(table.ownerId),
  index("public_sectors_status_idx").on(table.status),
  index("public_sectors_category_idx").on(table.categoryId),
]);

export type PublicSector = typeof publicSectors.$inferSelect;
export type NewPublicSector = typeof publicSectors.$inferInsert;