/**
 * Tests for Analytics module
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { Analytics, getAnalytics, trackEvent } from './Analytics';
import { EventType } from './types';
import type { EventProperties } from './types';

describe('Analytics', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics();
  });

  describe('constructor', () => {
    it('should generate a session ID', () => {
      expect(analytics.getSessionId()).toMatch(/^sess_\d+_[a-z0-9]+$/);
    });

    it('should generate unique session IDs', () => {
      const analytics2 = new Analytics();
      expect(analytics.getSessionId()).not.toBe(analytics2.getSessionId());
    });
  });

  describe('trackEvent', () => {
    it('should track generic events', () => {
      analytics.trackEvent(EventType.PAGE_VIEW, { page: '/test' });

      const events = analytics.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(EventType.PAGE_VIEW);
      expect(events[0].properties.page).toBe('/test');
    });

    it('should include timestamp', () => {
      analytics.trackEvent(EventType.PAGE_VIEW);

      const events = analytics.getEvents();
      expect(events[0].timestamp).toBeInstanceOf(Date);
    });

    it('should track multiple events', () => {
      analytics.trackEvent(EventType.PAGE_VIEW);
      analytics.trackEvent(EventType.BUSINESS_VIEW, { businessId: 'biz-1' });

      const events = analytics.getEvents();
      expect(events).toHaveLength(2);
    });
  });

  describe('trackPageView', () => {
    it('should track page view with page property', () => {
      analytics.trackPageView('/business/timor-cafe');

      const events = analytics.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(EventType.PAGE_VIEW);
      expect(events[0].properties.page).toBe('/business/timor-cafe');
    });

    it('should include additional properties', () => {
      analytics.trackPageView('/test', { referrer: '/home' });

      const events = analytics.getEvents();
      expect(events[0].properties.referrer).toBe('/home');
    });
  });

  describe('trackBusinessView', () => {
    it('should track business view with ID', () => {
      analytics.trackBusinessView('biz-123', 'Timor Cafe');

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.BUSINESS_VIEW);
      expect(events[0].properties.businessId).toBe('biz-123');
      expect(events[0].properties.businessName).toBe('Timor Cafe');
    });

    it('should track with slug', () => {
      analytics.trackBusinessView('biz-123', 'Timor Cafe', 'timor-cafe');

      const events = analytics.getEvents();
      expect(events[0].properties.slug).toBe('timor-cafe');
    });
  });

  describe('trackSearchQuery', () => {
    it('should track search with query and results count', () => {
      analytics.trackSearchQuery('coffee', 15);

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.SEARCH_QUERY);
      expect(events[0].properties.query).toBe('coffee');
      expect(events[0].properties.resultsCount).toBe(15);
    });

    it('should include category filter', () => {
      analytics.trackSearchQuery('restaurant', 10, 'food');

      const events = analytics.getEvents();
      expect(events[0].properties.category).toBe('food');
    });
  });

  describe('trackUserAction', () => {
    it('should track event with user ID', () => {
      analytics.trackUserAction(EventType.USER_SIGNUP, 'user-123');

      const events = analytics.getEvents();
      expect(events[0].userId).toBe('user-123');
      expect(events[0].type).toBe(EventType.USER_SIGNUP);
    });

    it('should include session ID', () => {
      analytics.trackUserAction(EventType.USER_SIGNUP, 'user-123');

      const events = analytics.getEvents();
      expect(events[0].sessionId).toBeDefined();
    });

    it('should include additional properties', () => {
      analytics.trackUserAction(EventType.USER_SIGNUP, 'user-123', { method: 'email' });

      const events = analytics.getEvents();
      expect(events[0].properties.method).toBe('email');
    });
  });

  describe('trackUserSignup', () => {
    it('should track signup with user ID and method', () => {
      analytics.trackUserSignup('user-456', 'google');

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.USER_SIGNUP);
      expect(events[0].userId).toBe('user-456');
      expect(events[0].properties.method).toBe('google');
    });
  });

  describe('trackUserSignin', () => {
    it('should track signin with user ID', () => {
      analytics.trackUserSignin('user-789');

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.USER_SIGNIN);
      expect(events[0].userId).toBe('user-789');
    });
  });

  describe('trackListingCreated', () => {
    it('should track listing creation', () => {
      analytics.trackListingCreated('listing-001', 'user-123', 'business');

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.LISTING_CREATED);
      expect(events[0].properties.listingId).toBe('listing-001');
      expect(events[0].properties.listingType).toBe('business');
    });
  });

  describe('trackProductCreated', () => {
    it('should track product creation', () => {
      analytics.trackProductCreated('prod-001', 'biz-123');

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.PRODUCT_CREATED);
      expect(events[0].properties.productId).toBe('prod-001');
      expect(events[0].properties.businessId).toBe('biz-123');
    });
  });

  describe('trackReviewAdded', () => {
    it('should track review with rating', () => {
      analytics.trackReviewAdded('review-001', 'biz-123', 5);

      const events = analytics.getEvents();
      expect(events[0].type).toBe(EventType.REVIEW_ADDED);
      expect(events[0].properties.rating).toBe(5);
    });
  });

  describe('getEvents', () => {
    it('should return copy of events array', () => {
      analytics.trackEvent(EventType.PAGE_VIEW);
      const events = analytics.getEvents();

      events.push({} as any); // Should not affect internal state
      expect(analytics.getEvents()).toHaveLength(1);
    });
  });

  describe('clearEvents', () => {
    it('should clear all events', () => {
      analytics.trackEvent(EventType.PAGE_VIEW);
      analytics.trackEvent(EventType.BUSINESS_VIEW);

      analytics.clearEvents();

      expect(analytics.getEvents()).toHaveLength(0);
    });
  });
});

describe('getAnalytics singleton', () => {
  it('should return same instance', () => {
    const instance1 = getAnalytics();
    const instance2 = getAnalytics();
    expect(instance1).toBe(instance2);
  });
});

describe('EventType enum', () => {
  it('should have all expected event types', () => {
    expect(EventType.PAGE_VIEW).toBe('page_view');
    expect(EventType.BUSINESS_VIEW).toBe('business_view');
    expect(EventType.SEARCH_QUERY).toBe('search_query');
    expect(EventType.USER_SIGNUP).toBe('user_signup');
    expect(EventType.USER_SIGNIN).toBe('user_signin');
    expect(EventType.LISTING_CREATED).toBe('listing_created');
    expect(EventType.PRODUCT_CREATED).toBe('product_created');
    expect(EventType.REVIEW_ADDED).toBe('review_added');
  });
});