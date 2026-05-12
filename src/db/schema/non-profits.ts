// Non-Profits table - similar structure to businesses but without SKU
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const nonProfits = sqliteTable('non_profits', {
  id: text('id').primaryKey(),
  // For distinguishing gov vs ngo (stored in organization_type field)
  entityType: text('entity_type').default('nonprofit'),
  // Organization type: 'government' | 'ngo'
  organizationType: text('organization_type'),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull(),
  categoryId: text('category_id'),
  status: text('status').default('draft'),
  bannerImageId: text('banner_image_id'),
  profileImageId: text('profile_image_id'),
  contactName: text('contact_name'),
  contactNumber: text('contact_number'),
  countryCode: text('country_code').default('+670'),
  yearOfEstablishment: integer('year_of_establishment'),
  email: text('email'),
  address: text('address'),
  locationLat: real('location_lat'),
  locationLng: real('location_lng'),
  openingHours: text('opening_hours'),
  aboutUs: text('about_us'),
  latestUpdates: text('latest_updates'),
  tags: text('tags'),
  likes: integer('likes').default(0),
  saves: integer('saves').default(0),
  ratingAverage: real('rating_average').default(0),
  ratingCount: integer('rating_count').default(0),
  views: integer('views').default(0),
  planType: text('plan_type'),
  publishDate: integer('publish_date', { mode: 'timestamp' }),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  subscriptionStatus: text('subscription_status').default('none'),
  subscriptionExpiresAt: integer('subscription_expires_at'),
  trialStartedAt: integer('trial_started_at'),
  gracePeriodEndDate: integer('grace_period_end_date'),
  registrationUrl: text('registration_url'),
  verifiedBadge: integer('verified_badge', { mode: 'boolean' }).default(false),
  socialLinks: text('social_links'),
  photoGallery: text('photo_gallery'),
  latestUpdate: text('latest_update'),
  latestUpdateImages: text('latest_update_images'),
  latestUpdateDate: integer('latest_update_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  ownerIdx: index('np_owner_idx').on(table.ownerId),
  statusIdx: index('np_status_idx').on(table.status),
  categoryIdx: index('np_category_idx').on(table.categoryId),
  subscriptionStatusIdx: index('np_subscription_status_idx').on(table.subscriptionStatus),
}));

export type NonProfit = typeof nonProfits.$inferSelect;
export type NewNonProfit = typeof nonProfits.$inferInsert;