// Landing Pages schema - for AI-generated promotional pages
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const landingPages = sqliteTable('landing_pages', {
  id: text('id').primaryKey(),
  pageType: text('page_type').default('promotion'), // 'promotion' | 'product-showcase' | 'event' | 'seasonal'
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  heroImageId: text('hero_image_id'),              // Media ID for hero image
  hero: text('hero').notNull(),                    // JSON: { title, subtitle, ctaText, ctaSecondary }
  description: text('description'),                 // Tiptap HTML content
  features: text('features'),                      // JSON array: [{ title, description, icon }]
  cta: text('cta'),                                // JSON: { title, description (Tiptap HTML), buttonText }
  status: text('status').default('draft'),        // 'draft' | 'published'
  views: integer('views').default(0),
  conversions: integer('conversions').default(0),
  createdBy: text('created_by').notNull(),        // FK to users.id
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (t) => ({
  slugIdx: index('landing_pages_slug_idx').on(t.slug),
  statusIdx: index('landing_pages_status_idx').on(t.status),
  createdByIdx: index('landing_pages_created_by_idx').on(t.createdBy),
}));