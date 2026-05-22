// Blog Posts schema
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const blogPosts = sqliteTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),           // Short summary for list view
  content: text('content'),           // Rich text HTML (TipTap output)
  coverImageId: text('cover_image_id'), // FK to media.id
  authorId: text('author_id').notNull(), // FK to users.id
  status: text('status').default('draft'), // 'draft' | 'published' | 'archived'
  tags: text('tags'),                 // JSON array of tags
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (t) => ({
  slugIdx: index('blog_posts_slug_idx').on(t.slug),
  authorIdx: index('blog_posts_author_idx').on(t.authorId),
  statusIdx: index('blog_posts_status_idx').on(t.status),
  coverIdx: index('blog_posts_cover_idx').on(t.coverImageId),
  publishedIdx: index('blog_posts_published_idx').on(t.publishedAt),
}));
