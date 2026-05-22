/**
 * Blog Categories Seed Data
 * TimorUp (2026-05-21)
 *
 * Blog categories based on website business types:
 * - Business Spotlight
 * - Products & Services
 * - Non-Profits
 * - Government
 * - Tourism & Attractions
 * - News & Updates
 * - Tips & Guides
 * - Community
 */

export const blogCategories = [
  { id: "business-spotlight", name: "Business Spotlight", slug: "business-spotlight", description: "Featured businesses, success stories, new openings", icon: "Store", parentId: null, sortOrder: 1, isActive: 1 },
  { id: "products-services", name: "Products & Services", slug: "products-services", description: "New products, promotions, service highlights", icon: "Package", parentId: null, sortOrder: 2, isActive: 1 },
  { id: "non-profits", name: "Non-Profits", slug: "non-profits", description: "NGO stories, humanitarian work, community impact", icon: "Heart", parentId: null, sortOrder: 3, isActive: 1 },
  { id: "government", name: "Government", slug: "government", description: "Public services, government announcements, policies", icon: "Landmark", parentId: null, sortOrder: 4, isActive: 1 },
  { id: "tourism-attractions", name: "Tourism & Attractions", slug: "tourism-attractions", description: "Places to visit, local attractions, travel guides", icon: "MapPin", parentId: null, sortOrder: 5, isActive: 1 },
  { id: "news-updates", name: "News & Updates", slug: "news-updates", description: "Platform news, announcements, events", icon: "Newspaper", parentId: null, sortOrder: 6, isActive: 1 },
  { id: "tips-guides", name: "Tips & Guides", slug: "tips-guides", description: "Buying guides, tutorials, best practices", icon: "Lightbulb", parentId: null, sortOrder: 7, isActive: 1 },
  { id: "community", name: "Community", slug: "community", description: "Community stories, user sharing, local events", icon: "Users", parentId: null, sortOrder: 8, isActive: 1 },
];

export default blogCategories;