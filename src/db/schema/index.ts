/**
 * Database Schema Index
 * TimorUp
 *
 * Single Source of Truth for all database tables.
 * Each table is defined in its own file.
 *
 * Structure:
 * ├── index.ts          ← Re-exports all tables
 * ├── auth/
 * │   ├── users.ts
 * │   ├── sessions.ts
 * │   ├── accounts.ts
 * │   └── verifications.ts
 * ├── categories.ts
 * ├── entities.ts
 * ├── listings.ts
 * ├── media.ts
 * ├── products.ts
 * ├── product-categories.ts
 * ├── reviews.ts
 * ├── latest-update.ts
 * ├── service-packages.ts
 * ├── orders.ts
 * ├── saved-items.ts
 * ├── ad-banners.ts
 * ├── blog-categories.ts
 * ├── blog-posts.ts
 * ├── site-settings.ts
 * └── landing-pages.ts
 */

// ============================================
// Auth Tables
// ============================================
export { users, type User, type NewUser } from "./users"
export { accounts, type Account, type NewAccount } from "./accounts"
export { verifications, type Verification, type NewVerification } from "./verifications"

// ============================================
// Categories (4 independent tables)
// ============================================
export { businessCategories } from "./categories"
export { nonProfitCategories } from "./categories"
export { publicSectorCategories } from "./categories"
export { listingCategories } from "./categories"

// ============================================
// Entity Tables
// ============================================
export { businesses, type Business, type NewBusiness } from "./entities"
export { nonProfits, type NonProfit, type NewNonProfit } from "./entities"
export { publicSectors, type PublicSector, type NewPublicSector } from "./entities"

// ============================================
// Listings
// ============================================
export { listings, type Listing, type NewListing } from "./listings"

// ============================================
// Media
// ============================================
export { media, type Media, type NewMedia } from "./media"

// ============================================
// Products
// ============================================
export { productCategories, type ProductCategory, type NewProductCategory } from "./product-categories"
export { products, type Product, type NewProduct } from "./products"

// ============================================
// Reviews
// ============================================
export { reviews, type Review, type NewReview } from "./reviews"

// ============================================
// Latest Update
// ============================================
export { latestUpdate, type LatestUpdate, type NewLatestUpdate } from "./latest-update"

// ============================================
// Commerce
// ============================================
export { servicePackages, type ServicePackage, type NewServicePackage } from "./service-packages"
export { orders, type Order, type NewOrder } from "./orders"

// ============================================
// Saved Items & Ads
// ============================================
export { savedItems, type SavedItem, type NewSavedItem } from "./saved-items"
export { adBanners, type AdBanner, type NewAdBanner } from "./ad-banners"

// ============================================
// Blog
// ============================================
export { blogCategories, type BlogCategory, type NewBlogCategory } from "./blog-categories"
export { blogPosts, type BlogPost, type NewBlogPost } from "./blog-posts"

// ============================================
// Settings & Landing Pages
// ============================================
export { siteSettings, type SiteSetting, type NewSiteSetting } from "./site-settings"
export { landingPages, type LandingPage, type NewLandingPage } from "./landing-pages"