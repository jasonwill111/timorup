/**
 * Media table
 * TimorUp
 *
 * R2 structure: {entityType}/{entityId}/{purpose}_{uuid}.{ext}
 * entityType: pages | general | businesses | listings | non-profits | public-sectors | blog | users
 * purpose: avatar | banner | cover | gallery | logo | icon | og-image | content
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const media = sqliteTable("media", {
  id: text().primaryKey().notNull(),
  r2Key: text("r2_key").notNull().unique(),  // R2 storage path

  // File info
  filename: text().notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer().notNull(),
  width: integer(),
  height: integer(),

  // Association
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),

  // Purpose
  purpose: text().notNull(),

  // Sorting (for gallery)
  sortOrder: integer("sort_order").default(0),

  // SEO
  alt: text(),

  // Audit
  hash: text().unique(),
  createdById: text("created_by_id"),
  createdAt: integer("created_at"),

  // Soft delete
  deletedAt: integer("deleted_at"),
},
(table) => [
  uniqueIndex("media_r2_key_idx").on(table.r2Key),
  index("media_entity_idx").on(table.entityType, table.entityId),
  index("media_purpose_idx").on(table.purpose),
  index("media_hash_idx").on(table.hash),
  index("media_deleted_idx").on(table.deletedAt),
  // Note: entity+purpose NOT unique - gallery needs multiple images
]);

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;