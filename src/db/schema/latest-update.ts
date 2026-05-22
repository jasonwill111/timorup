/**
 * Latest Update table (for business/non-profit/public-sector)
 * TimorUp
 *
 * Each entity has ONE update record (UPSERT)
 * content: max 104 chars
 * imageIds: max 4 media IDs
 * videoId: 1 video media ID
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const latestUpdate = sqliteTable("latest_update", {
  id: text().primaryKey().notNull(),
  type: text().notNull(),                    // business | non_profit | public_sector
  typeId: text("type_id").notNull(),        // entity ID
  content: text("content", { length: 255 }).notNull(),
  imageIds: text("image_ids"),               // JSON array, max 4 media IDs
  videoId: text("video_id"),                // 1 video media ID
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("latest_update_unique").on(table.type, table.typeId),
  index("latest_update_type_idx").on(table.type),
  index("latest_update_type_id_idx").on(table.typeId),
]);

export type LatestUpdate = typeof latestUpdate.$inferSelect;
export type NewLatestUpdate = typeof latestUpdate.$inferInsert;