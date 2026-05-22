// Businesses table - with SKU support
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const businesses = sqliteTable('businesses', {
  // Constant field for distinguishing entity type in UNION queries
  entityType: text('entity_type').default('business'),
  id: text('id').primaryKey(),
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
  ownerIdx: index('biz_owner_idx').on(table.ownerId),
  statusIdx: index('biz_status_idx').on(table.status),
  categoryIdx: index('biz_category_idx').on(table.categoryId),
  subscriptionStatusIdx: index('biz_subscription_status_idx').on(table.subscriptionStatus),
}));

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;