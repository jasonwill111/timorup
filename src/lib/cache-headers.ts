/**
 * Cache-Control header constants for Cloudflare edge caching
 * 
 * STATIC_CACHE: For public pages that don't change often (pricing, terms, privacy, FAQ)
 * SHORT_CACHE: For public pages with dynamic content (listing pages, search)
 * PRIVATE_CACHE: For personalized/authenticated pages (account, admin, dashboard)
 */

export const STATIC_CACHE = 'public, s-maxage=3600, stale-while-revalidate=600';
// 边缘缓存 1 小时 + 后台重新验证 = 接近静态页面效果

export const SHORT_CACHE = 'public, s-maxage=300, stale-while-revalidate=60';
// 边缘缓存 5 分钟，适合列表页等中等变化频率内容

export const PRIVATE_CACHE = 'private, no-store, no-cache, must-revalidate';
// 不缓存，适合个性化内容或需要登录的页面

export const API_CACHE = 'public, s-maxage=60, stale-while-revalidate=30';
// API 响应缓存 1 分钟

/**
 * Set cache headers on Astro response
 */
export function setCacheHeaders(response: Response, cacheType: string): void {
  response.headers.set('Cache-Control', cacheType);
}
