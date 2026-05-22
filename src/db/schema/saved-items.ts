/**
 * Saved Items table (bookmarks)
 * TimorUp
 *
 * type = businesses | listings
 * typeId = entity ID
 * UNIQUE constraint prevents duplicate bookmarks
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const savedItems = sqliteTable("saved_items", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  type: text().notNull(),                   // businesses | listings
  typeId: text("type_id").notNull(),       // entity ID
  createdAt: integer("created_at"),
},
(table) => [
  index("saved_items_user_idx").on(table.userId),
  index("saved_items_type_idx").on(table.type),
  index("saved_items_type_id_idx").on(table.typeId),
  uniqueIndex("saved_items_user_type_typeId_idx").on(table.userId, table.type, table.typeId),
]);

export type SavedItem = typeof savedItems.$inferSelect;
export type NewSavedItem = typeof savedItems.$inferInsert;