/**
 * Site Settings table
 * TimorUp
 */
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"

export const siteSettings = sqliteTable("site_settings", {
  id: text().primaryKey().notNull(),
  key: text().notNull().unique(),
  value: text(),
  type: text().default("string"),          // string | number | boolean | json
  description: text(),
  isPublic: integer("is_public").default(0),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("site_settings_key_idx").on(table.key),
]);

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;