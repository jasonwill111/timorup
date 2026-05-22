/**
 * Blog Posts table
 * TimorUp
 */
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

export const blogPosts = sqliteTable("blog_posts", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text(),
  content: text(),
  coverImageId: text("cover_image_id"),
  categoryId: text("category_id"),         // FK to blog_categories.id
  authorId: text("author_id"),
  authorName: text("author_name"),
  status: text().default("draft"),          // draft | published
  tags: text(),

  // Stats
  views: integer().default(0),
  likes: integer().default(0),
  saves: integer().default(0),
  shares: integer().default(0),

  publishedAt: integer("published_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
},
(table) => [
  index("blog_posts_status_idx").on(table.status),
  index("blog_posts_category_idx").on(table.categoryId),
  index("blog_posts_author_idx").on(table.authorId),
]);

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;