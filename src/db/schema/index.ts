/**
 * Unified Database Schema
 * timorlist
 * Last updated: 2026-05-13
 *
 * Key changes:
 * - listingCategories: added formFields for dynamic category-specific fields
 * - listings: removed listingType/imageIds/price/condition, added extraData/featured/featuredUntil
 * - businesses/nonProfits/publicSectors: removed legacy fields, businesses has limits/planSlug
 * - orders: added snapshots (snapshotName/snapshotPrice/snapshotConfig/snapshotFeatures)
 * - servicePackages: new unified table (renamed from plans), supports subscriptions/renewals/addons
 */
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

// ============================================
// Users & Auth
// ============================================

export const users = sqliteTable("users", {
  id: text().primaryKey().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer("email_verified").default(0),
  phone: text(),
  name: text().notNull(),
  image: text(),
  role: text().default("user"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("users_role_idx").on(table.role),
  uniqueIndex("users_email_unique").on(table.email),
]);

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  token: text().notNull().unique(),
  expiresAt: integer("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at"),
},
(table) => [
  index("sessions_user_idx").on(table.userId),
  uniqueIndex("sessions_token_unique").on(table.token),
]);

export const accounts = sqliteTable("accounts", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at"),
  refreshTokenExpiresAt: integer("refresh_token_expires_at"),
  scope: text(),
  password: text(),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("accounts_user_idx").on(table.userId),
]);

export const verifications = sqliteTable("verifications", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at"),
},
(table) => [
  index("verifications_expires_idx").on(table.expiresAt),
]);

// ============================================
// Categories (4 independent tables)
// ============================================

export const businessCategories = sqliteTable("business_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(true),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("business_categories_slug_idx").on(table.slug),
  index("business_categories_parent_idx").on(table.parentId),
]);

export const nonProfitCategories = sqliteTable("non_profit_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(true),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("non_profit_categories_slug_idx").on(table.slug),
  index("non_profit_categories_parent_idx").on(table.parentId),
]);

export const publicSectorCategories = sqliteTable("public_sector_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(true),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("public_sector_categories_slug_idx").on(table.slug),
  index("public_sector_categories_parent_idx").on(table.parentId),
]);

export const listingCategories = sqliteTable("listing_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(true),
  // JSON 配置 - 分类特有的表单字段，在 admin 后台可编辑
  // 结构: [{ name: "price", type: "number", label: "Price", required: true }, ...]
  formFields: text("form_fields"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("listing_categories_slug_idx").on(table.slug),
  index("listing_categories_parent_idx").on(table.parentId),
]);

// ============================================
// Media
// R2 structure: /pages/, /general/, /businesses/{id}/, /listings/{id}/,
//              /non-profits/{id}/, /public-sectors/{id}/, /blog/{id}/, /users/{id}/
// r2Key format: {entityType}/{entityId}/{purpose}_{uuid}.{ext}
// ============================================

export const media = sqliteTable("media", {
  id: text().primaryKey().notNull(),
  r2Key: text("r2_key").notNull().unique(),  // R2 storage path (e.g., businesses/biz-123/avatar_abc123.jpg)

  // File info
  filename: text().notNull(),                  // Original filename
  mimeType: text("mime_type").notNull(),      // image/jpeg, video/mp4
  size: integer().notNull(),                   // bytes
  width: integer(),                            // Image width
  height: integer(),                           // Image height

  // Association
  entityType: text("entity_type").notNull(),  // 'pages' | 'general' | 'businesses' | 'listings' | 'non-profits' | 'public-sectors' | 'blog' | 'users'
  entityId: text("entity_id").notNull(),      // Entity ID

  // Purpose
  purpose: text().notNull(),                  // 'avatar' | 'banner' | 'cover' | 'gallery' | 'logo' | 'icon' | 'og-image' | 'content'

  // Sorting (for gallery)
  sortOrder: integer("sort_order").default(0),

  // SEO
  alt: text(),                                // Alt text for accessibility

  // Audit
  hash: text().unique(),                      // Content hash for deduplication
  createdById: text("created_by_id"),
  createdAt: integer("created_at"),

  // Soft delete
  deletedAt: integer("deleted_at"),            // null = active, timestamp = deleted
},
(table) => [
  uniqueIndex("media_r2_key_idx").on(table.r2Key),
  index("media_entity_idx").on(table.entityType, table.entityId),
  index("media_purpose_idx").on(table.purpose),
  index("media_hash_idx").on(table.hash),
  index("media_deleted_idx").on(table.deletedAt),
]);

// ============================================
// Entity Tables (4 independent tables)
// ============================================

export const businesses = sqliteTable("businesses", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),
  industry: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  views: integer().default(0),
  // 订阅
  subscriptionStatus: text("subscription_status").default("none"), // none | trial | active | expired
  subscriptionExpiresAt: integer("subscription_expires_at"),
  gracePeriodEndDate: integer("grace_period_end_date"),
  // 当前套餐限制（JSON，购买订阅时更新）
  // { "skuLimit": 10, "maxImages": 16, "maxVideos": 2 }
  limits: text(),
  planSlug: text("plan_slug"),           // 当前订阅的 plan slug
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(false),
  socialLinks: text("social_links"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("businesses_slug_idx").on(table.slug),
  index("businesses_owner_idx").on(table.ownerId),
  index("businesses_status_idx").on(table.status),
  index("businesses_category_idx").on(table.categoryId),
  index("businesses_subscription_status_idx").on(table.subscriptionStatus),
]);

export const nonProfits = sqliteTable("non_profits", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  // 免费 - 无订阅
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(false),
  socialLinks: text("social_links"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("non_profits_slug_idx").on(table.slug),
  index("non_profits_owner_idx").on(table.ownerId),
  index("non_profits_status_idx").on(table.status),
  index("non_profits_category_idx").on(table.categoryId),
]);

export const publicSectors = sqliteTable("public_sectors", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  // 政府特有字段 (JSON)
  // { "department": "Education", "serviceTypes": ["consulting", "permits"], ... }
  governmentData: text("government_data"),
  // 免费 - 无订阅
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(false),
  socialLinks: text("social_links"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("public_sectors_slug_idx").on(table.slug),
  index("public_sectors_owner_idx").on(table.ownerId),
  index("public_sectors_status_idx").on(table.status),
  index("public_sectors_category_idx").on(table.categoryId),
]);

export const listings = sqliteTable("listings", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),                 // FK to listing_categories
  status: text().default("draft"),
  description: text().notNull(),
  // 通用字段
  location: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  email: text(),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  // 有效期
  expiresAt: integer("expires_at"),               // null = 永久（付费后设置）
  lastRenewedAt: integer("last_renewed_at"),
  // Admin 设置
  featured: integer().default(false),             // 精选标记
  featuredUntil: integer("featured_until"),       // 精选截止日期
  // 分类特有字段 - JSON 存储
  // 结构: { price: 100, currency: "USD", condition: "new", brand: "Apple", ... }
  extraData: text("extra_data"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("listings_slug_idx").on(table.slug),
  index("listings_owner_idx").on(table.ownerId),
  index("listings_status_idx").on(table.status),
  index("listings_category_idx").on(table.categoryId),
  index("listings_featured_idx").on(table.featured),
  index("listings_expires_idx").on(table.expiresAt),
]);

// ============================================
// Latest Updates (for business/non_profit/public_sector)
// Each entity has ONE update record that can be edited/deleted
// Limit: 104 chars content, max 4 images, 1 video, once per day
// ============================================

export const latestUpdates = sqliteTable("latest_updates", {
  id: text().primaryKey().notNull(),
  type: text().notNull(),                    // 'business' | 'non_profit' | 'public_sector'
  typeId: text("type_id").notNull(),         // entity ID
  content: text().notNull(),                // max 104 chars
  imageIds: text("image_ids"),               // JSON array, max 4 media IDs
  videoId: text("video_id"),                 // 1 video media ID
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  // Each entity has only ONE update record (UPSERT)
  uniqueIndex("latest_updates_unique").on(table.type, table.typeId),
  index("latest_updates_type_idx").on(table.type),
  index("latest_updates_type_id_idx").on(table.typeId),
]);

// ============================================
// Products (for businesses)
// ============================================

export const products = sqliteTable("products", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  priceFields: text("price_fields"),
  serviceType: text("service_type").default("product"),
  price: text(),
  priceUnit: text("price_unit"),
  specifications: text(),
  images: text(),                          // JSON array of media IDs
  featured: integer().default(false),
  active: integer().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("products_business_idx").on(table.businessId),
  uniqueIndex("products_slug_idx").on(table.slug),
  index("products_active_idx").on(table.active),
]);

// ============================================
// Reviews (for businesses)
// ============================================

export const reviews = sqliteTable("reviews", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),
  userId: text("user_id").notNull(),
  rating: integer().notNull(),
  title: text(),
  content: text(),
  reply: text(),
  repliedAt: integer("replied_at"),
  repliedBy: text("replied_by"),
  isEdited: integer("is_edited").default(false),
  status: text().default("pending"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("reviews_business_idx").on(table.businessId),
  index("reviews_user_idx").on(table.userId),
  index("reviews_status_idx").on(table.status),
]);

// ============================================
// Orders (Service Package Purchases)
// Orders store a SNAPSHOT of the service package at purchase time
// type = 'business' | 'listing' (entity type)
// typeId = entity ID (business_id / listing_id)
// ============================================

export const orders = sqliteTable("orders", {
  id: text().primaryKey().notNull(),
  // 关联
  servicePackageId: text("service_package_id"),  // FK to service_packages

  // 快照 - 购买时的值（不随 service package 更新而变化）
  snapshotName: text("snapshot_name"),           // "Starter Plan"
  snapshotPrice: integer("snapshot_price"),       // 购买时的总价（分）
  snapshotCurrency: text("snapshot_currency"),   // "USD"
  snapshotConfig: text("snapshot_config"),       // JSON: { duration, limits, featured, credits }
  snapshotFeatures: text("snapshot_features"),   // JSON: ["SEO Tools"]

  // 订单信息
  type: text().notNull(),                       // 'business' | 'listing'
  typeId: text("type_id"),                      // business_id / listing_id (nullable for future services)
  userId: text("user_id").notNull(),

  // 付款
  amount: integer().notNull(),
  status: text("status").default("pending"),     // pending | paid | cancelled | refunded
  paymentMethod: text("payment_method"),
  paidDate: integer("paid_date"),

  // 这次购买的有效期
  expiresAt: integer("expires_at"),             // 这次购买的截止日期

  // Admin
  adminNotes: text("admin_notes"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("orders_service_package_idx").on(table.servicePackageId),
  index("orders_type_idx").on(table.type),
  index("orders_type_id_idx").on(table.typeId),
  index("orders_user_idx").on(table.userId),
  index("orders_status_idx").on(table.status),
]);

// ============================================
// Service Packages (Formerly Plans)
// Unified service product table - covers subscriptions, renewals, and one-time services
// ============================================

export const servicePackages = sqliteTable("service_packages", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  // 服务类型
  type: text().notNull(),               // 'subscription' | 'listing_renewal' | 'featured' | 'addon'
  description: text(),
  // 价格
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  // 灵活配置 (JSON)
  // subscription: { "duration": { "value": 1, "unit": "month" }, "limits": { "skuLimit": 10, "maxImages": 16 } }
  // listing_renewal: { "duration": { "value": 30, "unit": "days" } }
  // featured: { "featured": { "days": 7, "renewable": true } }
  // addon: { "credits": 100 }
  config: text(),
  // 附加功能列表
  features: text(),                      // JSON array: ["SEO Tools", "Analytics"]
  // 状态
  isActive: integer("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("service_packages_slug_idx").on(table.slug),
  index("service_packages_type_idx").on(table.type),
  index("service_packages_active_idx").on(table.isActive),
]);

// Alias for backward compatibility (deprecated - use servicePackages)
export const plans = servicePackages;

// ============================================
// Saved Items (bookmarks for businesses/listings)
// type = 'businesses' | 'listings'
// typeId = entity ID
// ============================================

export const savedItems = sqliteTable("saved_items", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  type: text().notNull(),                // 'businesses' | 'listings'
  typeId: text("type_id").notNull(),    // entity ID
  createdAt: integer("created_at"),
},
(table) => [
  index("saved_items_user_idx").on(table.userId),
  index("saved_items_type_idx").on(table.type),
  index("saved_items_type_id_idx").on(table.typeId),
  uniqueIndex("saved_items_user_type_typeId_idx").on(table.userId, table.type, table.typeId),
]);

// ============================================
// Ad Banners
// ============================================

export const adBanners = sqliteTable("ad_banners", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),
  imageId: text("image_id"),
  linkedEntityType: text("linked_entity_type"),
  linkedEntityId: text("linked_entity_id"),
  externalUrl: text("external_url"),
  isActive: integer("is_active").default(true),
  startDate: integer("start_date"),
  endDate: integer("end_date"),
  position: text().default("homepage"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("ad_banners_active_idx").on(table.isActive),
  index("ad_banners_date_range_idx").on(table.startDate, table.endDate),
]);

// ============================================
// Blog Posts
// ============================================

export const blogPosts = sqliteTable("blog_posts", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text(),
  content: text(),
  coverImageId: text("cover_image_id"),
  authorId: text("author_id").notNull(),
  status: text().default("draft"),
  tags: text(),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_status_idx").on(table.status),
  index("blog_posts_author_idx").on(table.authorId),
]);

// ============================================
// Site Settings
// ============================================

export const siteSettings = sqliteTable("site_settings", {
  id: text().primaryKey().notNull(),
  key: text().notNull().unique(),
  value: text(),
  type: text().default("string"),
  description: text(),
  isPublic: integer("is_public").default(false),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("site_settings_key_idx").on(table.key),
]);
