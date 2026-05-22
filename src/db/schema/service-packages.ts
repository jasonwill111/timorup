/**
 * Service Packages table (SKUs)
 * TimorUp
 *
 * type = business_page | listing_renewal | featured | ad_banner
 * variants JSON: [{ name, price, currency, durationValue, durationUnit, skuLimit, features }]
 *
 * BUSINESS PAGE PLANS:
 *   Basic:  $29/mo | $290/yr | 10 SKUs
 *   Pro:    $59/mo | $590/yr | 30 SKUs
 *   Max:    $89/mo | $890/yr | 60 SKUs
 *
 * LISTING RENEWALS:
 *   7 days:   $8
 *   30 days:  $20
 *   365 days: $200
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const servicePackages = sqliteTable("service_packages", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  type: text().notNull(),                    // business_page | listing_renewal | featured | ad_banner
  description: text(),
  variants: text("variants").notNull(),     // JSON array
  isActive: integer("is_active").default(1),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("service_packages_slug_idx").on(table.slug),
  index("service_packages_type_idx").on(table.type),
  index("service_packages_active_idx").on(table.isActive),
]);

export type ServicePackage = typeof servicePackages.$inferSelect;
export type NewServicePackage = typeof servicePackages.$inferInsert;