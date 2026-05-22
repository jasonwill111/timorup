// Listings table - lightweight classified ads (gumtree style)
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull(),
  categoryId: text('category_id'),
  listingType: text('listing_type').notNull(), // 'job' | 'product' | 'service' | 'vehicle' | 'property' | 'wanted'
  status: text('status').default('draft'),
  // Lightweight fields
  description: text('description').notNull(),
  price: text('price'), // Could be "negotiable", "$50", etc.
  condition: text('condition'), // 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location: text('location'),
  locationLat: real('location_lat'),
  locationLng: real('location_lng'),
  contactName: text('contact_name'),
  contactNumber: text('contact_number'),
  countryCode: text('country_code').default('+670'),
  email: text('email'),
  // Images
  imageIds: text('image_ids'), // JSON array of media IDs
  // Tags for search
  tags: text('tags'),
  // Stats
  likes: integer('likes').default(0),
  saves: integer('saves').default(0),
  views: integer('views').default(0),
  // Expire mechanism - 3 day window, then delete if not renewed
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // createdAt + 3 days
  lastRenewedAt: integer('last_renewed_at', { mode: 'timestamp' }),
}, (table) => ({
  ownerIdx: index('listing_owner_idx').on(table.ownerId),
  statusIdx: index('listing_status_idx').on(table.status),
  categoryIdx: index('listing_category_idx').on(table.categoryId),
  listingTypeIdx: index('listing_type_idx').on(table.listingType),
  expiresAtIdx: index('listing_expires_idx').on(table.expiresAt),
}));

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;