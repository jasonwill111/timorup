/**
 * Unified Database Schema
 * timorlist
 * Last updated: 2026-05-14
 *
 * Key changes:
 * - productCategories: NEW table for SKU categories (42 categories with formFields)
 * - products: categoryId NOT NULL, removed price/priceUnit
 * - reviews: removed isEdited, added UNIQUE(userId, businessId)
 * - servicePackages: variants JSON array, removed flat price/config fields
 * - orders: variantSnapshot JSON instead of separate snapshot fields
 * - latestUpdates: content max 255 chars
 * - savedItems: added UNIQUE constraint
 * - adBanners: linkUrl/linkType/position/sortOrder, FK orderId
 * - blogPosts: added metaTitle/metaDescription/canonicalUrl, authorId→authorName
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
  entityType: text("entity_type").default("business"),
  status: text().default("draft"),
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
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
  latestUpdates: text("latest_updates"),
  tags: text(),
  industry: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  views: integer().default(0),
  // 订阅
  planType: text("plan_type"),
  publishDate: integer("publish_date"),
  expiryDate: integer("expiry_date"),
  subscriptionStatus: text("subscription_status").default("none"),
  subscriptionExpiresAt: integer("subscription_expires_at"),
  gracePeriodEndDate: integer("grace_period_end_date"),
  // 当前套餐限制（JSON，购买订阅时更新）
  limits: text(),
  planSlug: text("plan_slug"),
  registrationUrl: text("registration_url"),
  verifiedBadge: integer("verified_badge").default(false),
  socialLinks: text("social_links"),
  photoGallery: text("photo_gallery"),
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
  organizationType: text("organization_type"),
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
  entityType: text("entity_type").default("nonprofit"),
  status: text().default("draft"),
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
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
  latestUpdates: text("latest_updates"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  // 订阅（保留旧字段兼容性）
  planType: text("plan_type"),
  publishDate: integer("publish_date"),
  expiryDate: integer("expiry_date"),
  subscriptionStatus: text("subscription_status").default("none"),
  subscriptionExpiresAt: integer("subscription_expires_at"),
  trialStartedAt: integer("trial_started_at"),
  gracePeriodEndDate: integer("grace_period_end_date"),
  // 媒体
  photoGallery: text("photo_gallery"),
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
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
  entityType: text("entity_type").default("government"),
  status: text().default("draft"),
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
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
  latestUpdates: text("latest_updates"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  // 订阅（保留旧字段兼容性）
  planType: text("plan_type"),
  publishDate: integer("publish_date"),
  expiryDate: integer("expiry_date"),
  subscriptionStatus: text("subscription_status").default("none"),
  subscriptionExpiresAt: integer("subscription_expires_at"),
  trialStartedAt: integer("trial_started_at"),
  gracePeriodEndDate: integer("grace_period_end_date"),
  // 媒体
  photoGallery: text("photo_gallery"),
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
  // 政府特有字段 (JSON)
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
  categoryId: text("category_id"),
  status: text().default("draft"),
  listingType: text("listing_type").notNull().default("product"),
  description: text().notNull(),
  price: text(),
  condition: text(),
  location: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  email: text(),
  imageIds: text("image_ids"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  // 有效期
  expiresAt: integer("expires_at"),
  lastRenewedAt: integer("last_renewed_at"),
  // Admin 设置
  featured: integer().default(false),
  featuredUntil: integer("featured_until"),
  // 分类特有字段 - JSON 存储
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
// Product Categories (for businesses' SKUs)
// 42 categories with formFields for type-specific fields
// ============================================

export const productCategories = sqliteTable("product_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(true),
  // JSON 配置 - 分类特有的表单字段
  // 结构: [{ name: "brand", type: "text", label: "Brand", required: false }, ...]
  formFields: text("form_fields"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("product_categories_slug_idx").on(table.slug),
  index("product_categories_parent_idx").on(table.parentId),
]);

// ============================================
// Products (for businesses)
// 每个 product 属于一个 category，category 的 formFields 定义该分类的价格字段
// priceFields JSON 存储用户输入的价格值（来自 category 的 formFields）
// ============================================

export const products = sqliteTable("products", {
  id: text().primaryKey().notNull(),
  businessPageId: text("business_page_id"),  // 旧字段，保留兼容性
  businessId: text("business_id").notNull(),
  categoryId: text("category_id").notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  serviceType: text("service_type").default("product"),  // 旧字段，保留兼容性
  productType: text("product_type").default("product"),
  price: text(),
  priceUnit: text("price_unit"),
  priceFields: text("price_fields"),
  specifications: text(),
  images: text().default("[]"),
  featured: integer().default(false),
  active: integer().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("products_business_idx").on(table.businessId),
  index("products_category_idx").on(table.categoryId),
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
  content: text(),                           // max 255 chars
  reply: text(),
  repliedAt: integer("replied_at"),
  repliedBy: text("replied_by"),
  status: text().default("pending"),       // pending | approved | rejected
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("reviews_business_idx").on(table.businessId),
  index("reviews_user_idx").on(table.userId),
  index("reviews_status_idx").on(table.status),
  uniqueIndex("reviews_user_business_idx").on(table.userId, table.businessId),
]);

// ============================================
// Orders (Service Package Purchases)
// Orders store a SNAPSHOT of the selected variant at purchase time
// ============================================

export const orders = sqliteTable("orders", {
  id: text().primaryKey().notNull(),
  // 关联
  servicePackageId: text("service_package_id"),  // FK to service_packages

  // 变体快照 - 购买时的值（不随 service package 更新而变化）
  // 从 servicePackages.variants 数组中选择的那个变体的完整快照
  variantSnapshot: text("variant_snapshot").notNull(),  // JSON: { name, price, currency, durationValue, durationUnit, limits, features }

  // 订单信息
  type: text().notNull(),                       // 'business' | 'listing'
  typeId: text("type_id"),                      // business_id / listing_id
  userId: text("user_id").notNull(),

  // 付款
  amount: integer().notNull(),                  // 实际支付金额（分）
  status: text("status").default("pending"),     // pending | paid | cancelled | refunded
  paymentMethod: text("payment_method"),
  paidDate: integer("paid_date"),

  // 这次购买的有效期（从 variantSnapshot.duration 计算得出）
  expiresAt: integer("expires_at"),

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
// Service Packages (SKUs)
// Each SKU has multiple variants (different pricing/duration/limits)
// ============================================

export const servicePackages = sqliteTable("service_packages", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),                    // "Business Page Plan", "Listing Renewal", "Ad Banner"
  slug: text().notNull().unique(),
  type: text().notNull(),                    // 'subscription' | 'listing_renewal' | 'featured' | 'addon'
  category: text(),                          // 'business' | 'listing' | 'other'
  description: text(),
  // 变体数组 (JSON)
  // [{ name: "Starter Monthly", price: 29, currency: "USD", durationValue: 1, durationUnit: "month", limits: { skuLimit: 10, maxImages: 16, maxVideos: 2 }, features: ["SEO Tools"] }]
  variants: text("variants").notNull(),
  isActive: integer("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("service_packages_slug_idx").on(table.slug),
  index("service_packages_type_idx").on(table.type),
  index("service_packages_category_idx").on(table.category),
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
// Position: homepage | businesses | products-services | listings
// linkType: business | listing | product
// ============================================

export const adBanners = sqliteTable("ad_banners", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),                        // admin 备注
  imageId: text("image_id"),
  linkUrl: text("link_url"),               // slug
  linkType: text("link_type").notNull(),   // 'business' | 'listing' | 'product'
  position: text().notNull(),              // 'homepage' | 'businesses' | 'products-services' | 'listings'
  sortOrder: integer("sort_order").default(0),  // 越大越靠前
  orderId: text("order_id"),               // FK → orders.id (需付款后生效)
  isActive: integer("is_active").default(true),
  startDate: integer("start_date"),
  endDate: integer("end_date"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("ad_banners_position_idx").on(table.position),
  index("ad_banners_active_idx").on(table.isActive),
  index("ad_banners_order_idx").on(table.orderId),
]);

// ============================================
// Blog Posts
// ============================================

export const blogPosts = sqliteTable("blog_posts", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text(),                           // 列表显示
  content: text(),
  coverImageId: text("cover_image_id"),
  authorName: text("author_name"),          // 更灵活，不一定是平台用户
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
  status: text().default("draft"),
  tags: text(),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_status_idx").on(table.status),
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
