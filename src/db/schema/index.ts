// Database schema for timorbiz
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Re-export auth tables explicitly
import { sessions, accounts, verifications } from './auth';
export { sessions, accounts, verifications };

// Re-export blog tables
import { blogPosts } from './blogs';
export { blogPosts };

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  image: text('image'),
  role: text('role').default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (users) => ({
  emailIdx: index('users_email_idx').on(users.email),
}));

// Categories table - use string reference to avoid circular
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (categories) => ({
  slugIdx: index('categories_slug_idx').on(categories.slug),
}));

// Media table
export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  alt: text('alt'),
  type: text('type'),
  businessId: text('business_id'),
  createdById: text('created_by_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Business Pages table
export const businessPages = sqliteTable('business_pages', {
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
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (businessPages) => ({
  slugIdx: index('business_slug_idx').on(businessPages.slug),
  ownerIdx: index('business_owner_idx').on(businessPages.ownerId),
  statusIdx: index('business_status_idx').on(businessPages.status),
}));

// Products table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  price: text('price').notNull(),
  description: text('description'),
  businessPageId: text('business_page_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (products) => ({
  businessIdx: index('products_business_idx').on(products.businessPageId),
}));

// Product Images table
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  mediaId: text('media_id').notNull(),
  position: integer('position').default(0),
});

// Reviews table
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  businessPageId: text('business_page_id').notNull(),
  userId: text('user_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  isEdited: integer('is_edited', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (reviews) => ({
  businessIdx: index('reviews_business_idx').on(reviews.businessPageId),
  userIdx: index('reviews_user_idx').on(reviews.userId),
}));

// Orders table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  businessPageId: text('business_page_id').notNull(),
  userId: text('user_id').notNull(),
  planType: text('plan_type').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').default('unpaid'),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  paymentMethod: text('payment_method'),
  paidDate: integer('paid_date', { mode: 'timestamp' }),
  adminNotes: text('admin_notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (orders) => ({
  businessIdx: index('orders_business_idx').on(orders.businessPageId),
  userIdx: index('orders_user_idx').on(orders.userId),
}));

// Ad Banners table
export const adBanners = sqliteTable('ad_banners', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  imageId: text('image_id'),
  linkedBusinessPageId: text('linked_business_page_id'),
  externalUrl: text('external_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Site Settings (global)
export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Export type definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Media = typeof media.$inferSelect;
export type BusinessPage = typeof businessPages.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type AdBanner = typeof adBanners.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
