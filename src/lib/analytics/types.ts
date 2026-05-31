/**
 * Analytics event types for TimorUp
 */

/**
 * Standard event types for tracking user interactions
 */
export enum EventType {
  // Page events
  PAGE_VIEW = 'page_view',

  // Business events
  BUSINESS_VIEW = 'business_view',
  BUSINESS_LIKE = 'business_like',
  BUSINESS_SEARCH = 'business_search',

  // Listing events
  LISTING_VIEW = 'listing_view',
  LISTING_CREATED = 'listing_created',
  LISTING_UPDATED = 'listing_updated',
  LISTING_DELETED = 'listing_deleted',

  // Product events
  PRODUCT_VIEW = 'product_view',
  PRODUCT_CREATED = 'product_created',
  PRODUCT_UPDATED = 'product_updated',

  // Review events
  REVIEW_ADDED = 'review_added',
  REVIEW_LIKE = 'review_like',

  // User events
  USER_SIGNUP = 'user_signup',
  USER_SIGNIN = 'user_signin',
  USER_SIGNOUT = 'user_signout',

  // Search events
  SEARCH_QUERY = 'search_query',

  // Media events
  MEDIA_UPLOADED = 'media_uploaded',
}

/**
 * Properties attached to events
 */
export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Event record structure
 */
export interface EventRecord {
  type: EventType;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  properties: EventProperties;
}

/**
 * Page view specific properties
 */
export interface PageViewProperties extends EventProperties {
  page: string;
  referrer?: string;
  title?: string;
}

/**
 * Business view specific properties
 */
export interface BusinessViewProperties extends EventProperties {
  businessId: string;
  businessName?: string;
  slug?: string;
}

/**
 * Search query specific properties
 */
export interface SearchProperties extends EventProperties {
  query: string;
  resultsCount: number;
  category?: string;
  location?: string;
}