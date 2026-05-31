/**
 * Analytics tracking module
 * Centralized event collection for user behavior analysis
 */
import { EventType, type EventProperties, type EventRecord } from './types';

/**
 * Analytics instance for tracking user events
 *
 * Currently logs to console. Future: extend to external analytics services
 */
export class Analytics {
  private sessionId: string;
  private events: EventRecord[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Track a generic event
   */
  trackEvent(event: EventType, properties?: EventProperties): void {
    const record: EventRecord = {
      type: event,
      timestamp: new Date(),
      properties: properties || {},
    };

    this.events.push(record);
    this.logEvent(record);
  }

  /**
   * Track a page view
   */
  trackPageView(page: string, properties?: EventProperties): void {
    this.trackEvent(EventType.PAGE_VIEW, {
      page,
      ...properties,
    });
  }

  /**
   * Track business view
   */
  trackBusinessView(businessId: string, businessName?: string, slug?: string): void {
    this.trackEvent(EventType.BUSINESS_VIEW, {
      businessId,
      businessName,
      slug,
    });
  }

  /**
   * Track search query
   */
  trackSearchQuery(query: string, resultsCount: number, category?: string): void {
    this.trackEvent(EventType.SEARCH_QUERY, {
      query,
      resultsCount,
      category,
    });
  }

  /**
   * Track user action with user ID
   */
  trackUserAction(event: EventType, userId: string, properties?: EventProperties): void {
    const record: EventRecord = {
      type: event,
      timestamp: new Date(),
      userId,
      sessionId: this.sessionId,
      properties: properties || {},
    };

    this.events.push(record);
    this.logEvent(record);
  }

  /**
   * Track user signup
   */
  trackUserSignup(userId: string, method?: string): void {
    this.trackUserAction(EventType.USER_SIGNUP, userId, { method });
  }

  /**
   * Track user signin
   */
  trackUserSignin(userId: string, method?: string): void {
    this.trackUserAction(EventType.USER_SIGNIN, userId, { method });
  }

  /**
   * Track listing creation
   */
  trackListingCreated(listingId: string, userId: string, listingType?: string): void {
    this.trackUserAction(EventType.LISTING_CREATED, userId, {
      listingId,
      listingType,
    });
  }

  /**
   * Track product creation
   */
  trackProductCreated(productId: string, businessId: string, userId?: string): void {
    this.trackEvent(EventType.PRODUCT_CREATED, {
      productId,
      businessId,
    });
  }

  /**
   * Track review added
   */
  trackReviewAdded(reviewId: string, businessId: string, rating: number): void {
    this.trackEvent(EventType.REVIEW_ADDED, {
      reviewId,
      businessId,
      rating,
    });
  }

  /**
   * Log event to console (development/debugging)
   */
  private logEvent(record: EventRecord): void {
    if (import.meta.env.PROD) {
      // In production, this would send to an analytics service
      console.log(`[Analytics] ${record.type}`, JSON.stringify(record));
    }
  }

  /**
   * Get all tracked events for the current session
   */
  getEvents(): EventRecord[] {
    return [...this.events];
  }

  /**
   * Clear all tracked events
   */
  clearEvents(): void {
    this.events = [];
  }
}

// Singleton instance for easy access
let analyticsInstance: Analytics | null = null;

export function getAnalytics(): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  return analyticsInstance;
}

export function trackEvent(event: EventType, properties?: EventProperties): void {
  getAnalytics().trackEvent(event, properties);
}

export function trackPageView(page: string, properties?: EventProperties): void {
  getAnalytics().trackPageView(page, properties);
}

export function trackBusinessView(businessId: string, businessName?: string, slug?: string): void {
  getAnalytics().trackBusinessView(businessId, businessName, slug);
}

export function trackSearchQuery(query: string, resultsCount: number, category?: string): void {
  getAnalytics().trackSearchQuery(query, resultsCount, category);
}