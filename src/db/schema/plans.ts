// Plans table - stores subscription plan definitions
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(), // e.g., 'basic-monthly', 'pro-yearly'
  name: text('name').notNull(), // 'Basic', 'Pro', 'Max'
  period: text('period').notNull(), // 'monthly' | 'yearly'
  amount: integer('amount').notNull(), // cents USD
  skuLimit: integer('sku_limit').notNull().default(10),
  maxImages: integer('max_images').notNull().default(5),
  maxVideos: integer('max_videos').notNull().default(1),
  features: text('features'), // JSON array of feature strings
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
