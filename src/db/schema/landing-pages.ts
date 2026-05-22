/**
 * Landing Pages table (AI-generated promotional pages)
 * TimorUp
 *
 * pageType: promotion | event | seasonal | custom
 * content: JSON - 完整的页面内容（AI 生成什么结构，存什么结构）
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const landingPages = sqliteTable("landing_pages", {
  id: text().primaryKey().notNull(),
  pageType: text("page_type").default("promotion"),
  title: text().notNull(),
  slug: text().notNull().unique(),
  status: text().default("draft"),

  // AI 生成的内容 - 灵活的 JSON 结构
  content: text().notNull(),              // JSON: 完整的页面内容

  // 元数据
  views: integer().default(0),
  conversions: integer().default(0),
  createdBy: text("created_by").notNull(),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("landing_pages_slug_idx").on(table.slug),
  index("landing_pages_status_idx").on(table.status),
  index("landing_pages_created_by_idx").on(table.createdBy),
]);

export type LandingPage = typeof landingPages.$inferSelect;
export type NewLandingPage = typeof landingPages.$inferInsert;