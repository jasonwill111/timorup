// Database schema for timorlist
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm/relations';
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
  emailVerified: integer('email_verified').default(0),  // 0=false, 1=true
  phone: text('phone'),
  name: text('name').notNull(),
  image: text('image'),
  role: text('role').default('user'),
  createdAt: integer('created_at'),  // Unix timestamp
  updatedAt: integer('updated_at'),  // Unix timestamp
});

// Categories table - use string reference to avoid circular
// entityType: 'business' | 'government' | 'nonprofit' | null (null = all types)
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon').default(''), // 'emoji:🍽️' or 'lucide:utensils' or ''
  parentId: text('parent_id'),
  entityType: text('entity_type').default('business'), // 'business' | 'government' | 'nonprofit' | null (all types)
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

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
// Also used for organizations (gov, nonprofits) with entityType field
export const businessPages = sqliteTable('business_pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull(),
  categoryId: text('category_id'),
  entityType: text('entity_type').default('business'), // 'business' | 'government' | 'nonprofit'
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
  // Industry for businesses (e.g., 'food.restaurants', 'retail.clothing')
  industry: text('industry'),
  likes: integer('likes').default(0),
  saves: integer('saves').default(0),
  ratingAverage: real('rating_average').default(0),
  ratingCount: integer('rating_count').default(0),
  views: integer('views').default(0),
  planType: text('plan_type'),
  publishDate: integer('publish_date', { mode: 'timestamp' }),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  // Organization-specific fields
  registrationUrl: text('registration_url'), // Link to official registration
  verifiedBadge: integer('verified_badge', { mode: 'boolean' }).default(false),
  // Social media links
  socialLinks: text('social_links'), // JSON: { facebook, instagram, tiktok }
  // Photo gallery (separate from banner/profile)
  photoGallery: text('photo_gallery'), // JSON array of media IDs (max 6 images + 1 video)
  // Latest update tracking (weekly limit)
  latestUpdate: text('latest_update'), // Text content
  latestUpdateImages: text('latest_update_images'), // JSON array of media IDs (max 3)
  latestUpdateDate: integer('latest_update_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (businessPages) => ({
  ownerIdx: index('business_owner_idx').on(businessPages.ownerId),
  statusIdx: index('business_status_idx').on(businessPages.status),
  entityTypeIdx: index('business_entity_type_idx').on(businessPages.entityType),
}));

// Products/SKUs table with flexible pricing
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  businessPageId: text('business_page_id').notNull(),
  // Flexible pricing: JSON array of { label, value, unit }
  // Example: [{ "label": "Hourly Rate", "value": "25.00", "unit": "/hour" }]
  priceFields: text('price_fields'),
  // Service type for determining available price units and UI
  serviceType: text('service_type').default('product'), // 'product' | 'service' | 'rental' | 'food' | 'accommodation' | 'automotive' | 'healthcare' | 'education' | 'beauty' | 'event'
  // Fallback single price (for simple products)
  price: text('price'),
  priceUnit: text('price_unit'),
  // Industry-specific specifications (JSON)
  // Structure depends on serviceType - see below
  specifications: text('specifications'),
  // Common fields
  featured: integer('featured', { mode: 'boolean' }).default(false),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (products) => ({
  businessIdx: index('products_business_idx').on(products.businessPageId),
  activeIdx: index('products_active_idx').on(products.active),
}));

// Product specifications by serviceType:
//
// serviceType: 'automotive' (Vehicle Sales/Rental)
// {
//   vehicleType: 'sedan' | 'suv' | 'motorcycle' | 'truck' | 'van' | 'pickup'
//   brand: string
//   model: string
//   year: number
//   mileage: number (km)
//   fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
//   transmission: 'manual' | 'automatic'
//   color: string
//   condition: 'new' | 'used' | 'certified'
//   doors: number
//   seats: number
// }
//
// serviceType: 'food' (Restaurant/Food Service)
// {
//   cuisine: string[] (e.g., ['Indonesian', 'Chinese'])
//   dietaryOptions: string[] (e.g., ['Halal', 'Vegetarian'])
//   mealType: 'breakfast' | 'lunch' | 'dinner' | 'all_day'
//   priceRange: '$' | '$$' | '$$$' | '$$$$'
//   parking: boolean
//   delivery: boolean
//   takeaway: boolean
//   reservation: boolean
//   avgWaitTime: number (minutes)
// }
//
// serviceType: 'accommodation' (Hotel/Homestay/Rental)
// {
//   roomType: 'single' | 'double' | 'twin' | 'suite' | 'dorm' | 'villa'
//   maxGuests: number
//   bedType: 'single' | 'double' | 'queen' | 'king'
//   numBeds: number
//   checkInTime: string (e.g., '14:00')
//   checkOutTime: string (e.g., '12:00')
//   roomSize: number (sqm)
//   floor: number
//   amenities: string[] (e.g., ['wifi', 'ac', 'pool', 'parking', 'breakfast'])
// }
//
// serviceType: 'healthcare' (Clinic/Pharmacy)
// {
//   specialization: string (e.g., 'General', 'Dental', 'Eye')
//   consultationType: 'in_person' | 'telemedicine'
//   consultationDuration: number (minutes)
//   acceptedInsurance: string[]
//   emergencyService: boolean
//   homeVisit: boolean
// }
//
// serviceType: 'education' (School/Training/Tutoring)
// {
//   courseType: 'language' | 'vocational' | 'tutoring' | 'training' | 'workshop'
//   subject: string
//   duration: string (e.g., '2 hours', '3 months')
//   schedule: 'weekday' | 'weekend' | 'evening' | 'flexible'
//   level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
//   certificate: boolean
//   classSize: number
//   language: string
// }
//
// serviceType: 'beauty' (Salon/Spa/Massage)
// {
//   serviceCategory: 'hair' | 'nail' | 'spa' | 'massage' | 'makeup' | 'tattoo'
//   genderPreference: 'male' | 'female' | 'unisex'
//   duration: number (minutes)
//   advanceBooking: boolean
//   homeService: boolean
// }
//
// serviceType: 'event' (Photography/Catering/Events)
// {
//   eventType: 'photography' | 'catering' | 'decoration' | 'entertainment' | 'transport'
//   coverage: string (e.g., 'East Timor', 'Dili only')
//   minBooking: string (e.g., '2 hours', '1 day')
//   teamIncluded: number
//   equipment: string[]
// }
//
// serviceType: 'service' (General Services)
// {
//   serviceCategory: 'repair' | 'cleaning' | 'delivery' | 'moving' | 'installation'
//   coverage: string
//   responseTime: string (e.g., 'Same day', '24 hours')
//   warranty: string
//   insured: boolean
// }
//
// serviceType: 'rental' (Equipment/Property)
// {
//   rentalType: 'equipment' | 'vehicle' | 'property' | 'furniture'
//   minRental: string (e.g., '1 day', '1 week')
//   maxRental: string
//   deposit: string
//   delivery: boolean
//   deliveryFee: string
// }

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
  // Reply fields
  reply: text('reply'),
  repliedAt: integer('replied_at', { mode: 'timestamp' }),
  repliedBy: text('replied_by'),
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

// Saved Items table (favorites/bookmarks for SKUs and Pages)
export const savedItems = sqliteTable('saved_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  // itemType: 'sku' for products, 'page' for business pages
  itemType: text('item_type').notNull(), // 'sku' | 'page'
  itemId: text('item_id').notNull(), // product id or business_page id
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (savedItems) => ({
  userIdx: index('saved_items_user_idx').on(savedItems.userId),
  itemIdx: index('saved_items_item_idx').on(savedItems.itemId),
}));

// Relations for better-auth (required for join queries)
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

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
