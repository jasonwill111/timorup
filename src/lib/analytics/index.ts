/**
 * Analytics module
 * Centralized event tracking for user behavior
 */
export { Analytics, getAnalytics, trackEvent, trackPageView, trackBusinessView, trackSearchQuery } from './Analytics';
export { EventType } from './types';
export type { EventProperties, EventRecord, PageViewProperties, BusinessViewProperties, SearchProperties } from './types';
export type { EventProperties as EventProps } from './types';