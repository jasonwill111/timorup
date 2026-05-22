/**
 * Reviews table (for businesses)
 * TimorUp
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const reviews = sqliteTable("reviews", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),
  userId: text("user_id").notNull(),
  rating: integer().notNull(),  // 1-5
  title: text(),
  content: text("content", { length: 104 }),  // 104 chars
  reply: text(),
  repliedAt: integer("replied_at"),
  repliedBy: text("replied_by"),
  status: text().default("pending"),  // pending | approved | rejected
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("reviews_business_idx").on(table.businessId),
  index("reviews_user_idx").on(table.userId),
  index("reviews_status_idx").on(table.status),
  index("reviews_replied_by_idx").on(table.repliedBy),  // 查询商家回复
  uniqueIndex("reviews_user_business_idx").on(table.userId, table.businessId),
]);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;